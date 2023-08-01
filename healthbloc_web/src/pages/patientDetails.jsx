/* eslint-disable no-unreachable */
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Loader from '../app/components/Loader';
import { create as ipfsHttpClient } from "ipfs-http-client";
import { Buffer } from 'buffer';
import { jwtToken } from '../app/helper';
import { decodeToken } from 'react-jwt';
import { toast } from "react-toastify";

const projectId = "2QdriIO9q5qFkJMrZDtReZHlsaz"
const projectSecretKey = "19d6a4437e9fd03149ed5fa4b971822e"
const authorization = "Basic " + btoa(projectId + ":" + projectSecretKey);

const api = 'https://localhost:7011/api';
const id = window.location.pathname.split('/')[2]

const PatientDetails = () => {

    const ipfs = ipfsHttpClient({
        url: "https://ipfs.infura.io:5001/api/v0",
        headers: {
            authorization
        }
    })

    const [patient, setPatient] = useState(null);
    const [providerId, setProviderId] = useState(null);

    const [loadingAllergy, setLoadingAllergy] = useState(false);
    const [showAllergyInput, setShowAllergyInput] = useState(false);
    const [newAllergy, setNewAllergy] = useState('');

    const [loadingCloudSync, setLoadingCloudSync] = useState(false);
    const [loadingTreatment, setLoadingTreatment] = useState(false);
    const [showTreatmentInput, setShowTreatmentInput] = useState(false);
    const [newTreatment, setNewTreatment] = useState({
        patientId: id,
        healthProviderId: '',
        treatmentName: '',
        treatmentDetails: '',
        treatmentMedication: '',
    });


    useEffect(() => {
        // get all patients
        async function test() {
            if (localStorage.getItem('user')) {
                const providerId = await decodeToken(jwtToken)?.ProviderId
                setProviderId(providerId)
                getPatient();
            } else {
                toast.success('User not login')
                window.location.pathname = '/login'
            }
        }

        test()
    }, []);

    const handleAllergyChange = (event) => {
        setNewAllergy(event.target.value);
    };

    // TODO:
    const handleCloudSyncSubmit = async (event) => {
        console.log('get patiemt');
        console.log(patient);

        setLoadingCloudSync(true);

        console.log('ooo=> ', patient?.patientMedicalHistorySummary);

        /// Build Patietn Details

        //// PatientInfo
        var patientInfo = {
            id: patient?.patientMedicalHistorySummary.patientId,
            name: patient?.patientMedicalHistorySummary.patientName,
            provider: patient?.patientMedicalHistorySummary.providerName,
        }

        //// Allergies
        var allergyArrayObject = patient?.patientMedicalHistorySummary.allergies;
        var allergiesX = createStringArray(allergyArrayObject);
        var allergies = toCSV(allergiesX, "|")

        /// Treatment
        var treats = patient?.patientMedicalHistorySummary.patientTreatments;
        var treatments = createStringArray(treats);

        var patientDetails = {
            patientInfo,
            allergies,
            treatments
        };

        console.log('mmm>', patientDetails);

        // Add to IPFS
        const result = await ipfs.add(Buffer.from(JSON.stringify(patient?.patientMedicalHistorySummary)));

        // Update the IPFS Ref
        await updateIPFSRef(patient.id, result.path);

        console.log('Update done');

        // Updated Cloud Data
        axios.get(`https://skywalker.infura-ipfs.io/ipfs/${patient.ipfsReference}`)
            .then((response) => {
                console.log('xxx=>', response.data);
            });
    }

    function createStringArray(arr) {
        var result = [];
        for (var i = 0; i < arr.length; i += 1) {
            var strg1 = toCSV(arr[i], "|");
           result.push(strg1);
        }
        return result;
     }

     function toCSV(obj, separator) {
        var arr = [];
    
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                arr.push(obj[key]);
            }
        }
    
        return arr.join(separator || ",");
    }

    const updateIPFSRef = async (patientId, refHash) => {
        console.log('updating...')
        axios.post(`${api}/CloudSync/UpdateIPFSReferences/${patientId}`, { referenceHash: refHash })
            .then((response) => {
                setLoadingCloudSync(false);
            }).catch((error) => {
                console.error(error);
                setLoadingCloudSync(false);
            });

    }

    const handleAllergySubmit = async (event) => {
        event.preventDefault();
        if (!showAllergyInput) {
            setShowAllergyInput(true)
        } else if (newAllergy) {
            setNewAllergy('')
            setLoadingAllergy(true); // Set loading state to true
            axios.post(`${api}/PatientHistory/${id}/Allery/create`, { patientId: id, name: newAllergy })
                .then((response) => {
                    getPatient();
                    setLoadingAllergy(false);
                    setShowAllergyInput(false)
                }).catch((error) => {
                    console.error(error);
                });
        } else {
            setShowAllergyInput(false)
        }
    }

    const handleTreatmentChange = (event) => {
        setNewTreatment({ ...newTreatment, [event.target.name]: event.target.value });
    };

    const handleTreatmentSubmit = (event) => {
        event.preventDefault();
        if (!showTreatmentInput) {
            setShowTreatmentInput(true)
        } else if (newTreatment.treatmentName && newTreatment.treatmentDetails && newTreatment.treatmentMedication) {
            setLoadingTreatment(true); // Set loading state to true
            axios.post(`${api}/PatientHistory/${id}/Treatment/create`, {
                ...newTreatment,
                healthProviderId: providerId,
            })
                .then(async (response) => {
                    console.log('other', response);
                    await getPatient();
                    setLoadingTreatment(false);
                    setShowTreatmentInput(false)
                    setNewTreatment({
                        patientId: id,
                        healthProviderId: '',
                        treatmentName: '',
                        treatmentDetails: '',
                        treatmentMedication: '',
                    })
                }).catch((error) => {
                    console.error(error);
                    setLoadingTreatment(false);
                });
        } else {
            setShowTreatmentInput(false)
        }

    }

    const getPatient = () => {
        axios.get(`${api}/Patients/ById/${id}`)
            .then((response) => {
                setPatient(response.data.data);
                setLoadingAllergy(false);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const patientTreatments = patient?.patientMedicalHistory?.patientTreatments
    const allergies = patient?.patientMedicalHistory?.allergies


    return (
        <>
            {
                !patient ? <Loader /> :
                    <div className="d-flex flex-column flex-column-fluid">

                        <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">

                            <div id="kt_app_toolbar_container" className="app-container container-xxl d-flex flex-stack">

                                <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">

                                    <h1 className="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">Activity</h1>


                                    <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">

                                        <li className="breadcrumb-item text-muted">
                                            <a href="../../demo1/dist/index.html" className="text-muted text-hover-primary">Home</a>
                                        </li>


                                        <li className="breadcrumb-item">
                                            <span className="bullet bg-gray-400 w-5px h-2px"></span>
                                        </li>


                                        <li className="breadcrumb-item text-muted"><a href="/patients">Patient</a></li>
                                        <li className="breadcrumb-item">
                                            <span className="bullet bg-gray-400 w-5px h-2px"></span>
                                        </li>

                                        <li className="breadcrumb-item text-muted">Management</li>

                                    </ul>

                                </div>



                            </div>

                        </div>


                        <div id="kt_app_content" className="app-content flex-column-fluid">

                            <div id="kt_app_content_container" className="app-container container-xxl">

                                <div className="card mb-5 mb-xl-10">
                                    <div className="card-body pt-9 pb-0">

                                        <div className="d-flex flex-wrap flex-sm-nowrap">

                                            <div className="me-7 mb-4">
                                                <div className="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
                                                    <img src="assets/media/avatars/blank.png" alt="image" />
                                                    <div className="position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-body h-20px w-20px"></div>
                                                </div>
                                            </div>


                                            <div className="flex-grow-1">

                                                <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">

                                                    <div className="d-flex flex-column">

                                                        <div className="d-flex align-items-center mb-2">
                                                            <span href="#" className="text-gray-900 text-hover-primary fs-2 fw-bold me-1">{patient?.userProfile?.fullName}</span>
                                                            <a href="#">
                                                                <i className="ki-duotone ki-verify fs-1 text-primary">
                                                                    <span className="path1"></span>
                                                                    <span className="path2"></span>
                                                                </i>
                                                            </a>
                                                        </div>


                                                        <div className="d-flex flex-wrap fw-semibold fs-6 mb-4 pe-2">
                                                            <a href="#" className="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2">
                                                                <i className="ki-duotone ki-profile-circle fs-4 me-1">
                                                                    <span className="path1"></span>
                                                                    <span className="path2"></span>
                                                                    <span className="path3"></span>
                                                                </i>{patient?.userProfile?.fullName.split(' ')[0]}</a>
                                                            <a href="#" className="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2">
                                                                <i className="ki-duotone ki-geolocation fs-4 me-1">
                                                                    <span className="path1"></span>
                                                                    <span className="path2"></span>
                                                                </i>{patient?.userProfile?.address}</a>
                                                            <a href="#" className="d-flex align-items-center text-gray-400 text-hover-primary mb-2">
                                                                <i className="ki-duotone ki-sms fs-4 me-1">
                                                                    <span className="path1"></span>
                                                                    <span className="path2"></span>
                                                                </i>{patient?.userProfile?.email}</a>
                                                        </div>

                                                        <div>
                                                            <button value={'submit'} onClick={handleCloudSyncSubmit} className="btn btn-primary px-6 align-self-center text-nowrap mt-8">
                                                                {loadingCloudSync ? 'Syncing...' : 'Cloud Sync'}</button>

                                                        </div>
                                                    </div>



                                                </div>



                                            </div>

                                        </div>


                                    </div>
                                </div>


                                <div className="card">

                                    <div className="card-header card-header-stretch">

                                        <div className="card-title d-flex align-items-center">
                                            <i className="ki-duotone ki-calendar-8 fs-1 text-primary me-3 lh-0">
                                                <span className="path1"></span>
                                                <span className="path2"></span>
                                                <span className="path3"></span>
                                                <span className="path4"></span>
                                                <span className="path5"></span>
                                                <span className="path6"></span>
                                            </i>
                                            <h3 className="fw-bold m-0 text-gray-800">Jun 25, 2023 - Patient Medical Information</h3>
                                        </div>


                                        <div className="card-toolbar m-0">

                                            <ul className="nav nav-tabs nav-line-tabs nav-stretch fs-6 border-0 fw-bold" role="tablist">
                                                <li className="nav-item" role="presentation">
                                                    <a id="kt_activity_today_tab" className="nav-link justify-content-center text-active-gray-800 active" data-bs-toggle="tab" role="tab" href="#kt_activity_today">Today</a>
                                                </li>
                                                {/* <li className="nav-item" role="presentation">
                                                    <a id="kt_activity_week_tab" className="nav-link justify-content-center text-active-gray-800" data-bs-toggle="tab" role="tab" href="#kt_activity_week">Week</a>
                                                </li>
                                                <li className="nav-item" role="presentation">
                                                    <a id="kt_activity_month_tab" className="nav-link justify-content-center text-active-gray-800" data-bs-toggle="tab" role="tab" href="#kt_activity_month">Month</a>
                                                </li>
                                                <li className="nav-item" role="presentation">
                                                    <a id="kt_activity_year_tab" className="nav-link justify-content-center text-active-gray-800 text-hover-gray-800" data-bs-toggle="tab" role="tab" href="#kt_activity_year">2023</a>
                                                </li> */}
                                            </ul>

                                        </div>

                                    </div>


                                    <div className="card-body">

                                        <div className="row g-3 mb-12">
                                            <div className="col-md-8">

                                                <div className="tab-content">

                                                    <div id="kt_activity_today" className="card-body p-0 tab-pane fade show active" role="tabpanel" aria-labelledby="kt_activity_today_tab">

                                                        <div className="timeline">

                                                            <div className="timeline-item">

                                                                <div className="timeline-line w-40px"></div>


                                                                <div className="timeline-icon symbol symbol-circle symbol-40px me-4">
                                                                    <div className="symbol-label bg-light">
                                                                        <i className="ki-duotone ki-message-text-2 fs-2 text-gray-500">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                            <span className="path3"></span>
                                                                        </i>
                                                                    </div>
                                                                </div>


                                                                <div className="timeline-content mb-10 mt-n1">

                                                                    <div className="pe-3 mb-5">

                                                                        <div className="fs-5 fw-semibold mb-2"><span style={{ color: 'red' }}> {patient?.userProfile?.fullName}</span>, Here is your treatment plan:</div>


                                                                        <div className="d-flex align-items-center mt-1 fs-6">

                                                                            <div className="text-muted me-2 fs-7">Added at 4:23 PM by</div>


                                                                            <div className="symbol symbol-circle symbol-25px" data-bs-toggle="tooltip" data-bs-boundary="window" data-bs-placement="top" title="Nina Nilson">
                                                                                <img src="assets/media/avatars/blank.png" alt="img" />
                                                                            </div>

                                                                        </div>

                                                                    </div>


                                                                    <div className="overflow-auto pb-5">

                                                                        <div className="d-flex align-items-center border border-dashed border-gray-300 rounded min-w-750px px-7 py-3 mb-5">
                                                                            <div className="accordion" style={{ width: '100%' }} id="accordionExample">
                                                                                {patientTreatments?.length === 0 ? <h3 className='fs-5 fw-semibold mb-2'>No Medical treatment added yet</h3> : patientTreatments?.map((patient) => (
                                                                                    <div className="accordion-item" key={patient.id}>
                                                                                        <div className="accordion-header flex align-center" id={`h1-${patient?.id}`} style={{
                                                                                            alignItems: 'center', justifyContent: 'center', display: 'flex'
                                                                                        }}>
                                                                                            <p className="fs-5 text-dark text-hover-primary fw-semibold" style={{ width: '100%', marginBottom: 0 }} >{patient?.treatmentName}</p>


                                                                                            <div className="min-w-175px pe-2">
                                                                                                <span className="badge badge-light text-muted">{patient?.healthProvider?.name}</span>
                                                                                            </div>

                                                                                            <div className="min-w-125px pe-2">
                                                                                                <span className="badge badge-light-primary">In Progress</span>
                                                                                            </div>


                                                                                            {/* <a className="btn btn-sm btn-light btn-active-light-primary accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">View</a> */}

                                                                                            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target={`#c1-${patient?.id}`} aria-expanded="true" aria-controls={`c1-${patient?.id}`} style={{ width: '30%' }}>
                                                                                            </button>
                                                                                        </div>
                                                                                        <div id={`c1-${patient?.id}`} className="accordion-collapse collapse show" aria-labelledby={`h1-${patient?.id}`} data-bs-parent="#accordionExample">
                                                                                            <div className="accordion-body">
                                                                                                <div style={{ display: 'flex', alignItems: 'center' }}> <h3 style={{ marginRight: '1.5rem' }}>Treatment Name:</h3> <span>{patient?.treatmentName}</span></div>
                                                                                                <hr />
                                                                                                <h5>Treatment Details</h5>
                                                                                                <div
                                                                                                    dangerouslySetInnerHTML={{
                                                                                                        __html: `<p style='white-space: pre-wrap;'>${patient?.treatmentDetails}</p>`
                                                                                                    }}></div>
                                                                                                <h5>Treatment Medication</h5>
                                                                                                <div
                                                                                                    dangerouslySetInnerHTML={{
                                                                                                        __html: `<p style='white-space: pre-wrap;'>${patient?.treatmentMedication}</p>`
                                                                                                    }}></div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))
                                                                                }
                                                                            </div>

                                                                        </div>
                                                                    </div>


                                                                    <div className="d-flex align-items-center mt-7 mb-5" style={{ width: '100%' }}>
                                                                        <form onSubmit={handleTreatmentSubmit} style={{ width: '100%' }}>
                                                                            <div className="fv-row mb-3">
                                                                                <input type="text"
                                                                                    name="treatmentName"
                                                                                    value={newTreatment.treatmentName}
                                                                                    onChange={handleTreatmentChange}
                                                                                    placeholder="Enter Treatment Name"
                                                                                    autoComplete="off"
                                                                                    required
                                                                                    className="form-control bg-transparent"
                                                                                    style={{ display: showTreatmentInput ? 'block' : 'none', width: '100%' }}
                                                                                />
                                                                            </div>
                                                                            <div className="fv-row mb-3">
                                                                                <textarea type="text"
                                                                                    name="treatmentDetails"
                                                                                    value={newTreatment.treatmentDetails}
                                                                                    onChange={handleTreatmentChange}
                                                                                    placeholder="Enter Treatment Details"
                                                                                    autoComplete="off"
                                                                                    required
                                                                                    className="form-control bg-transparent"
                                                                                    style={{ display: showTreatmentInput ? 'block' : 'none', width: '100%' }}
                                                                                ></textarea>
                                                                            </div>
                                                                            <div className="fv-row mb-3">
                                                                                <textarea type="text"
                                                                                    name="treatmentMedication"
                                                                                    value={newTreatment.treatmentMedication}
                                                                                    onChange={handleTreatmentChange}
                                                                                    placeholder="Enter Treatment Medication"
                                                                                    autoComplete="off"
                                                                                    required
                                                                                    className="form-control bg-transparent"
                                                                                    style={{ display: showTreatmentInput ? 'block' : 'none', width: '100%' }}
                                                                                ></textarea>
                                                                            </div>

                                                                        </form>
                                                                    </div>




                                                                    <button value={'submit'} onClick={handleTreatmentSubmit} className="btn btn-primary px-6 align-self-center text-nowrap mt-8"> {loadingTreatment ? 'Adding...' : 'Add New treatment'}</button>
                                                                    {/* <a onClick={() => setShowTreatmentInput(prev => !prev)} className="btn btn-primary px-6 align-self-center text-nowrap mt-8"> {loadingTreatment ? 'Adding...' : 'Add New treatment'}</a> */}


                                                                </div>

                                                            </div>
                                                        </div>

                                                    </div>


                                                    <div id="kt_activity_week" className="card-body p-0 tab-pane fade show" role="tabpanel" aria-labelledby="kt_activity_week_tab">

                                                        <div className="timeline">

                                                            <div className="timeline-item">

                                                                <div className="timeline-line w-40px"></div>


                                                                <div className="timeline-icon symbol symbol-circle symbol-40px">
                                                                    <div className="symbol-label bg-light">
                                                                        <i className="ki-duotone ki-flag fs-2 text-gray-500">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                        </i>
                                                                    </div>
                                                                </div>


                                                                <div className="timeline-content mb-10 mt-n2">

                                                                    <div className="overflow-auto pe-3">

                                                                        <div className="fs-5 fw-semibold mb-2">Invitation for crafting engaging designs that speak human workshop</div>


                                                                        <div className="d-flex align-items-center mt-1 fs-6">

                                                                            <div className="text-muted me-2 fs-7">Sent at 4:23 PM by</div>


                                                                            <div className="symbol symbol-circle symbol-25px" data-bs-toggle="tooltip" data-bs-boundary="window" data-bs-placement="top" title="Alan Nilson">
                                                                                <img src="assets/media/avatars/blank.png" alt="img" />
                                                                            </div>

                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            </div>


                                                            <div className="timeline-item">

                                                                <div className="timeline-line w-40px"></div>


                                                                <div className="timeline-icon symbol symbol-circle symbol-40px">
                                                                    <div className="symbol-label bg-light">
                                                                        <i className="ki-duotone ki-disconnect fs-2 text-gray-500">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                            <span className="path3"></span>
                                                                            <span className="path4"></span>
                                                                            <span className="path5"></span>
                                                                        </i>
                                                                    </div>
                                                                </div>


                                                                <div className="timeline-content mb-10 mt-n1">

                                                                    <div className="mb-5 pe-3">

                                                                        <a href="#" className="fs-5 fw-semibold text-gray-800 text-hover-primary mb-2">3 New Incoming Project Files:</a>


                                                                        <div className="d-flex align-items-center mt-1 fs-6">

                                                                            <div className="text-muted me-2 fs-7">Sent at 10:30 PM by</div>


                                                                            <div className="symbol symbol-circle symbol-25px" data-bs-toggle="tooltip" data-bs-boundary="window" data-bs-placement="top" title="Jan Hummer">
                                                                                <img src="assets/media/avatars/blank.png" alt="img" />
                                                                            </div>

                                                                        </div>

                                                                    </div>


                                                                    <div className="overflow-auto pb-5">
                                                                        <div className="d-flex align-items-center border border-dashed border-gray-300 rounded min-w-700px p-5">

                                                                            <div className="d-flex flex-aligns-center pe-10 pe-lg-20">

                                                                                <img alt="" className="w-30px me-3" src="assets/media/svg/files/pdf.svg" />


                                                                                <div className="ms-1 fw-semibold">

                                                                                    <a href="../../demo1/dist/apps/projects/project.html" className="fs-6 text-hover-primary fw-bold">Finance KPI App Guidelines</a>


                                                                                    <div className="text-gray-400">1.9mb</div>

                                                                                </div>

                                                                            </div>


                                                                            <div className="d-flex flex-aligns-center pe-10 pe-lg-20">

                                                                                <img alt="../../demo1/dist/apps/projects/project.html" className="w-30px me-3" src="assets/media/svg/files/doc.svg" />


                                                                                <div className="ms-1 fw-semibold">

                                                                                    <a href="#" className="fs-6 text-hover-primary fw-bold">Client UAT Testing Results</a>


                                                                                    <div className="text-gray-400">18kb</div>

                                                                                </div>

                                                                            </div>


                                                                            <div className="d-flex flex-aligns-center">

                                                                                <img alt="../../demo1/dist/apps/projects/project.html" className="w-30px me-3" src="assets/media/svg/files/css.svg" />


                                                                                <div className="ms-1 fw-semibold">

                                                                                    <a href="#" className="fs-6 text-hover-primary fw-bold">Finance Reports</a>


                                                                                    <div className="text-gray-400">20mb</div>

                                                                                </div>

                                                                            </div>

                                                                        </div>
                                                                    </div>

                                                                </div>

                                                            </div>


                                                            <div className="timeline-item">

                                                                <div className="timeline-line w-40px"></div>


                                                                <div className="timeline-icon symbol symbol-circle symbol-40px">
                                                                    <div className="symbol-label bg-light">
                                                                        <i className="ki-duotone ki-abstract-26 fs-2 text-gray-500">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                        </i>
                                                                    </div>
                                                                </div>


                                                                <div className="timeline-content mb-10 mt-n1">

                                                                    <div className="pe-3 mb-5">

                                                                        <div className="fs-5 fw-semibold mb-2">Task
                                                                            <a href="#" className="text-primary fw-bold me-1">#45890</a>merged with
                                                                            <a href="#" className="text-primary fw-bold me-1">#45890</a>in “Ads Pro Admin Dashboard project:</div>


                                                                        <div className="d-flex align-items-center mt-1 fs-6">

                                                                            <div className="text-muted me-2 fs-7">Initiated at 4:23 PM by</div>


                                                                            <div className="symbol symbol-circle symbol-25px" data-bs-toggle="tooltip" data-bs-boundary="window" data-bs-placement="top" title="Nina Nilson">
                                                                                <img src="assets/media/avatars/blank.png" alt="img" />
                                                                            </div>

                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            </div>


                                                            <div className="timeline-item">

                                                                <div className="timeline-line w-40px"></div>


                                                                <div className="timeline-icon symbol symbol-circle symbol-40px">
                                                                    <div className="symbol-label bg-light">
                                                                        <i className="ki-duotone ki-pencil fs-2 text-gray-500">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                        </i>
                                                                    </div>
                                                                </div>


                                                                <div className="timeline-content mb-10 mt-n1">

                                                                    <div className="pe-3 mb-5">

                                                                        <div className="fs-5 fw-semibold mb-2">3 new application design concepts added:</div>


                                                                        <div className="d-flex align-items-center mt-1 fs-6">

                                                                            <div className="text-muted me-2 fs-7">Created at 4:23 PM by</div>


                                                                            <div className="symbol symbol-circle symbol-25px" data-bs-toggle="tooltip" data-bs-boundary="window" data-bs-placement="top" title="Marcus Dotson">
                                                                                <img src="assets/media/avatars/blank.png" alt="img" />
                                                                            </div>

                                                                        </div>

                                                                    </div>


                                                                    <div className="overflow-auto pb-5">
                                                                        <div className="d-flex align-items-center border border-dashed border-gray-300 rounded min-w-700px p-7">

                                                                            <div className="overlay me-10">

                                                                                <div className="overlay-wrapper">
                                                                                    <img alt="img" className="rounded w-150px" src="assets/media/stock/600x400/img-29.jpg" />
                                                                                </div>


                                                                                <div className="overlay-layer bg-dark bg-opacity-10 rounded">
                                                                                    <a href="#" className="btn btn-sm btn-primary btn-shadow">Explore</a>
                                                                                </div>

                                                                            </div>


                                                                            <div className="overlay me-10">

                                                                                <div className="overlay-wrapper">
                                                                                    <img alt="img" className="rounded w-150px" src="assets/media/stock/600x400/img-31.jpg" />
                                                                                </div>


                                                                                <div className="overlay-layer bg-dark bg-opacity-10 rounded">
                                                                                    <a href="#" className="btn btn-sm btn-primary btn-shadow">Explore</a>
                                                                                </div>

                                                                            </div>


                                                                            <div className="overlay">

                                                                                <div className="overlay-wrapper">
                                                                                    <img alt="img" className="rounded w-150px" src="assets/media/stock/600x400/img-40.jpg" />
                                                                                </div>


                                                                                <div className="overlay-layer bg-dark bg-opacity-10 rounded">
                                                                                    <a href="#" className="btn btn-sm btn-primary btn-shadow">Explore</a>
                                                                                </div>

                                                                            </div>

                                                                        </div>
                                                                    </div>

                                                                </div>

                                                            </div>


                                                            <div className="timeline-item">

                                                                <div className="timeline-line w-40px"></div>


                                                                <div className="timeline-icon symbol symbol-circle symbol-40px">
                                                                    <div className="symbol-label bg-light">
                                                                        <i className="ki-duotone ki-sms fs-2 text-gray-500">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                        </i>
                                                                    </div>
                                                                </div>


                                                                <div className="timeline-content mb-10 mt-n1">

                                                                    <div className="pe-3 mb-5">

                                                                        <div className="fs-5 fw-semibold mb-2">New case
                                                                            <a href="#" className="text-primary fw-bold me-1">#67890</a>is assigned to you in Multi-platform Database Design project</div>


                                                                        <div className="overflow-auto pb-5">

                                                                            <div className="d-flex align-items-center mt-1 fs-6">

                                                                                <div className="text-muted me-2 fs-7">Added at 4:23 PM by</div>


                                                                                <a href="#" className="text-primary fw-bold me-1">Alice Tan</a>

                                                                            </div>

                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            </div>

                                                        </div>

                                                    </div>


                                                    <div id="kt_activity_month" className="card-body p-0 tab-pane fade show" role="tabpanel" aria-labelledby="kt_activity_month_tab">

                                                        <div className="timeline">

                                                            <div className="timeline-item">

                                                                <div className="timeline-line w-40px"></div>


                                                                <div className="timeline-icon symbol symbol-circle symbol-40px">
                                                                    <div className="symbol-label bg-light">
                                                                        <i className="ki-duotone ki-pencil fs-2 text-gray-500">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                        </i>
                                                                    </div>
                                                                </div>


                                                                <div className="timeline-content mb-10 mt-n1">

                                                                    <div className="pe-3 mb-5">

                                                                        <div className="fs-5 fw-semibold mb-2">3 new application design concepts added:</div>


                                                                        <div className="d-flex align-items-center mt-1 fs-6">

                                                                            <div className="text-muted me-2 fs-7">Created at 4:23 PM by</div>


                                                                            <div className="symbol symbol-circle symbol-25px" data-bs-toggle="tooltip" data-bs-boundary="window" data-bs-placement="top" title="Marcus Dotson">
                                                                                <img src="assets/media/avatars/blank.png" alt="img" />
                                                                            </div>

                                                                        </div>

                                                                    </div>


                                                                    <div className="overflow-auto pb-5">
                                                                        <div className="d-flex align-items-center border border-dashed border-gray-300 rounded min-w-700px p-7">

                                                                            <div className="overlay me-10">

                                                                                <div className="overlay-wrapper">
                                                                                    <img alt="img" className="rounded w-150px" src="assets/media/stock/600x400/img-29.jpg" />
                                                                                </div>


                                                                                <div className="overlay-layer bg-dark bg-opacity-10 rounded">
                                                                                    <a href="#" className="btn btn-sm btn-primary btn-shadow">Explore</a>
                                                                                </div>

                                                                            </div>


                                                                            <div className="overlay me-10">

                                                                                <div className="overlay-wrapper">
                                                                                    <img alt="img" className="rounded w-150px" src="assets/media/stock/600x400/img-31.jpg" />
                                                                                </div>


                                                                                <div className="overlay-layer bg-dark bg-opacity-10 rounded">
                                                                                    <a href="#" className="btn btn-sm btn-primary btn-shadow">Explore</a>
                                                                                </div>

                                                                            </div>


                                                                            <div className="overlay">

                                                                                <div className="overlay-wrapper">
                                                                                    <img alt="img" className="rounded w-150px" src="assets/media/stock/600x400/img-40.jpg" />
                                                                                </div>


                                                                                <div className="overlay-layer bg-dark bg-opacity-10 rounded">
                                                                                    <a href="#" className="btn btn-sm btn-primary btn-shadow">Explore</a>
                                                                                </div>

                                                                            </div>

                                                                        </div>
                                                                    </div>

                                                                </div>

                                                            </div>


                                                            <div className="timeline-item">

                                                                <div className="timeline-line w-40px"></div>


                                                                <div className="timeline-icon symbol symbol-circle symbol-40px">
                                                                    <div className="symbol-label bg-light">
                                                                        <i className="ki-duotone ki-sms fs-2 text-gray-500">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                        </i>
                                                                    </div>
                                                                </div>


                                                                <div className="timeline-content mb-10 mt-n1">

                                                                    <div className="pe-3 mb-5">

                                                                        <div className="fs-5 fw-semibold mb-2">New case
                                                                            <a href="#" className="text-primary fw-bold me-1">#67890</a>is assigned to you in Multi-platform Database Design project</div>


                                                                        <div className="overflow-auto pb-5">

                                                                            <div className="d-flex align-items-center mt-1 fs-6">

                                                                                <div className="text-muted me-2 fs-7">Added at 4:23 PM by</div>


                                                                                <a href="#" className="text-primary fw-bold me-1">Alice Tan</a>

                                                                            </div>

                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            </div>


                                                            <div className="timeline-item">

                                                                <div className="timeline-line w-40px"></div>


                                                                <div className="timeline-icon symbol symbol-circle symbol-40px">
                                                                    <div className="symbol-label bg-light">
                                                                        <i className="ki-duotone ki-basket fs-2 text-gray-500">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                            <span className="path3"></span>
                                                                            <span className="path4"></span>
                                                                        </i>
                                                                    </div>
                                                                </div>


                                                                <div className="timeline-content mt-n1">

                                                                    <div className="pe-3 mb-5">

                                                                        <div className="fs-5 fw-semibold mb-2">New order
                                                                            <a href="#" className="text-primary fw-bold me-1">#67890</a>is placed for Workshow Planning & Budget Estimation</div>


                                                                        <div className="d-flex align-items-center mt-1 fs-6">

                                                                            <div className="text-muted me-2 fs-7">Placed at 4:23 PM by</div>


                                                                            <a href="#" className="text-primary fw-bold me-1">Jimmy Bold</a>

                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            </div>


                                                            <div className="timeline-item">

                                                                <div className="timeline-line w-40px"></div>


                                                                <div className="timeline-icon symbol symbol-circle symbol-40px">
                                                                    <div className="symbol-label bg-light">
                                                                        <i className="ki-duotone ki-flag fs-2 text-gray-500">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                        </i>
                                                                    </div>
                                                                </div>


                                                                <div className="timeline-content mb-10 mt-n2">

                                                                    <div className="overflow-auto pe-3">

                                                                        <div className="fs-5 fw-semibold mb-2">Invitation for crafting engaging designs that speak human workshop</div>


                                                                        <div className="d-flex align-items-center mt-1 fs-6">

                                                                            <div className="text-muted me-2 fs-7">Sent at 4:23 PM by</div>


                                                                            <div className="symbol symbol-circle symbol-25px" data-bs-toggle="tooltip" data-bs-boundary="window" data-bs-placement="top" title="Alan Nilson">
                                                                                <img src="assets/media/avatars/blank.png" alt="img" />
                                                                            </div>

                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            </div>


                                                            <div className="timeline-item">

                                                                <div className="timeline-line w-40px"></div>


                                                                <div className="timeline-icon symbol symbol-circle symbol-40px">
                                                                    <div className="symbol-label bg-light">
                                                                        <i className="ki-duotone ki-disconnect fs-2 text-gray-500">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                            <span className="path3"></span>
                                                                            <span className="path4"></span>
                                                                            <span className="path5"></span>
                                                                        </i>
                                                                    </div>
                                                                </div>


                                                                <div className="timeline-content mb-10 mt-n1">

                                                                    <div className="mb-5 pe-3">

                                                                        <a href="#" className="fs-5 fw-semibold text-gray-800 text-hover-primary mb-2">3 New Incoming Project Files:</a>


                                                                        <div className="d-flex align-items-center mt-1 fs-6">

                                                                            <div className="text-muted me-2 fs-7">Sent at 10:30 PM by</div>


                                                                            <div className="symbol symbol-circle symbol-25px" data-bs-toggle="tooltip" data-bs-boundary="window" data-bs-placement="top" title="Jan Hummer">
                                                                                <img src="assets/media/avatars/blank.png" alt="img" />
                                                                            </div>

                                                                        </div>

                                                                    </div>


                                                                    <div className="overflow-auto pb-5">
                                                                        <div className="d-flex align-items-center border border-dashed border-gray-300 rounded min-w-700px p-5">

                                                                            <div className="d-flex flex-aligns-center pe-10 pe-lg-20">

                                                                                <img alt="" className="w-30px me-3" src="assets/media/svg/files/pdf.svg" />


                                                                                <div className="ms-1 fw-semibold">

                                                                                    <a href="../../demo1/dist/apps/projects/project.html" className="fs-6 text-hover-primary fw-bold">Finance KPI App Guidelines</a>


                                                                                    <div className="text-gray-400">1.9mb</div>

                                                                                </div>

                                                                            </div>


                                                                            <div className="d-flex flex-aligns-center pe-10 pe-lg-20">

                                                                                <img alt="../../demo1/dist/apps/projects/project.html" className="w-30px me-3" src="assets/media/svg/files/doc.svg" />


                                                                                <div className="ms-1 fw-semibold">

                                                                                    <a href="#" className="fs-6 text-hover-primary fw-bold">Client UAT Testing Results</a>


                                                                                    <div className="text-gray-400">18kb</div>

                                                                                </div>

                                                                            </div>


                                                                            <div className="d-flex flex-aligns-center">

                                                                                <img alt="../../demo1/dist/apps/projects/project.html" className="w-30px me-3" src="assets/media/svg/files/css.svg" />


                                                                                <div className="ms-1 fw-semibold">

                                                                                    <a href="#" className="fs-6 text-hover-primary fw-bold">Finance Reports</a>


                                                                                    <div className="text-gray-400">20mb</div>

                                                                                </div>

                                                                            </div>

                                                                        </div>
                                                                    </div>

                                                                </div>

                                                            </div>


                                                            <div className="timeline-item">

                                                                <div className="timeline-line w-40px"></div>


                                                                <div className="timeline-icon symbol symbol-circle symbol-40px">
                                                                    <div className="symbol-label bg-light">
                                                                        <i className="ki-duotone ki-abstract-26 fs-2 text-gray-500">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                        </i>
                                                                    </div>
                                                                </div>


                                                                <div className="timeline-content mb-10 mt-n1">

                                                                    <div className="pe-3 mb-5">

                                                                        <div className="fs-5 fw-semibold mb-2">Task
                                                                            <a href="#" className="text-primary fw-bold me-1">#45890</a>merged with
                                                                            <a href="#" className="text-primary fw-bold me-1">#45890</a>in “Ads Pro Admin Dashboard project:</div>


                                                                        <div className="d-flex align-items-center mt-1 fs-6">

                                                                            <div className="text-muted me-2 fs-7">Initiated at 4:23 PM by</div>


                                                                            <div className="symbol symbol-circle symbol-25px" data-bs-toggle="tooltip" data-bs-boundary="window" data-bs-placement="top" title="Nina Nilson">
                                                                                <img src="assets/media/avatars/blank.png" alt="img" />
                                                                            </div>

                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            </div>

                                                        </div>

                                                    </div>


                                                    <div id="kt_activity_year" className="card-body p-0 tab-pane fade show" role="tabpanel" aria-labelledby="kt_activity_year_tab">

                                                        <div className="timeline">

                                                            <div className="timeline-item">

                                                                <div className="timeline-line w-40px"></div>


                                                                <div className="timeline-icon symbol symbol-circle symbol-40px">
                                                                    <div className="symbol-label bg-light">
                                                                        <i className="ki-duotone ki-disconnect fs-2 text-gray-500">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                            <span className="path3"></span>
                                                                            <span className="path4"></span>
                                                                            <span className="path5"></span>
                                                                        </i>
                                                                    </div>
                                                                </div>


                                                                <div className="timeline-content mb-10 mt-n1">

                                                                    <div className="mb-5 pe-3">

                                                                        <a href="#" className="fs-5 fw-semibold text-gray-800 text-hover-primary mb-2">3 New Incoming Project Files:</a>


                                                                        <div className="d-flex align-items-center mt-1 fs-6">

                                                                            <div className="text-muted me-2 fs-7">Sent at 10:30 PM by</div>


                                                                            <div className="symbol symbol-circle symbol-25px" data-bs-toggle="tooltip" data-bs-boundary="window" data-bs-placement="top" title="Jan Hummer">
                                                                                <img src="assets/media/avatars/blank.png" alt="img" />
                                                                            </div>

                                                                        </div>

                                                                    </div>


                                                                    <div className="overflow-auto pb-5">
                                                                        <div className="d-flex align-items-center border border-dashed border-gray-300 rounded min-w-700px p-5">

                                                                            <div className="d-flex flex-aligns-center pe-10 pe-lg-20">

                                                                                <img alt="" className="w-30px me-3" src="assets/media/svg/files/pdf.svg" />


                                                                                <div className="ms-1 fw-semibold">

                                                                                    <a href="../../demo1/dist/apps/projects/project.html" className="fs-6 text-hover-primary fw-bold">Finance KPI App Guidelines</a>


                                                                                    <div className="text-gray-400">1.9mb</div>

                                                                                </div>

                                                                            </div>


                                                                            <div className="d-flex flex-aligns-center pe-10 pe-lg-20">

                                                                                <img alt="../../demo1/dist/apps/projects/project.html" className="w-30px me-3" src="assets/media/svg/files/doc.svg" />


                                                                                <div className="ms-1 fw-semibold">

                                                                                    <a href="#" className="fs-6 text-hover-primary fw-bold">Client UAT Testing Results</a>


                                                                                    <div className="text-gray-400">18kb</div>

                                                                                </div>

                                                                            </div>


                                                                            <div className="d-flex flex-aligns-center">

                                                                                <img alt="../../demo1/dist/apps/projects/project.html" className="w-30px me-3" src="assets/media/svg/files/css.svg" />


                                                                                <div className="ms-1 fw-semibold">

                                                                                    <a href="#" className="fs-6 text-hover-primary fw-bold">Finance Reports</a>


                                                                                    <div className="text-gray-400">20mb</div>

                                                                                </div>

                                                                            </div>

                                                                        </div>
                                                                    </div>

                                                                </div>

                                                            </div>


                                                            <div className="timeline-item">

                                                                <div className="timeline-line w-40px"></div>


                                                                <div className="timeline-icon symbol symbol-circle symbol-40px">
                                                                    <div className="symbol-label bg-light">
                                                                        <i className="ki-duotone ki-abstract-26 fs-2 text-gray-500">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                        </i>
                                                                    </div>
                                                                </div>


                                                                <div className="timeline-content mb-10 mt-n1">

                                                                    <div className="pe-3 mb-5">

                                                                        <div className="fs-5 fw-semibold mb-2">Task
                                                                            <a href="#" className="text-primary fw-bold me-1">#45890</a>merged with
                                                                            <a href="#" className="text-primary fw-bold me-1">#45890</a>in “Ads Pro Admin Dashboard project:</div>


                                                                        <div className="d-flex align-items-center mt-1 fs-6">

                                                                            <div className="text-muted me-2 fs-7">Initiated at 4:23 PM by</div>


                                                                            <div className="symbol symbol-circle symbol-25px" data-bs-toggle="tooltip" data-bs-boundary="window" data-bs-placement="top" title="Nina Nilson">
                                                                                <img src="assets/media/avatars/blank.png" alt="img" />
                                                                            </div>

                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            </div>


                                                            <div className="timeline-item">

                                                                <div className="timeline-line w-40px"></div>


                                                                <div className="timeline-icon symbol symbol-circle symbol-40px">
                                                                    <div className="symbol-label bg-light">
                                                                        <i className="ki-duotone ki-pencil fs-2 text-gray-500">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                        </i>
                                                                    </div>
                                                                </div>


                                                                <div className="timeline-content mb-10 mt-n1">

                                                                    <div className="pe-3 mb-5">

                                                                        <div className="fs-5 fw-semibold mb-2">3 new application design concepts added:</div>


                                                                        <div className="d-flex align-items-center mt-1 fs-6">

                                                                            <div className="text-muted me-2 fs-7">Created at 4:23 PM by</div>


                                                                            <div className="symbol symbol-circle symbol-25px" data-bs-toggle="tooltip" data-bs-boundary="window" data-bs-placement="top" title="Marcus Dotson">
                                                                                <img src="assets/media/avatars/blank.png" alt="img" />
                                                                            </div>

                                                                        </div>

                                                                    </div>


                                                                    <div className="overflow-auto pb-5">
                                                                        <div className="d-flex align-items-center border border-dashed border-gray-300 rounded min-w-700px p-7">

                                                                            <div className="overlay me-10">

                                                                                <div className="overlay-wrapper">
                                                                                    <img alt="img" className="rounded w-150px" src="assets/media/stock/600x400/img-29.jpg" />
                                                                                </div>


                                                                                <div className="overlay-layer bg-dark bg-opacity-10 rounded">
                                                                                    <a href="#" className="btn btn-sm btn-primary btn-shadow">Explore</a>
                                                                                </div>

                                                                            </div>


                                                                            <div className="overlay me-10">

                                                                                <div className="overlay-wrapper">
                                                                                    <img alt="img" className="rounded w-150px" src="assets/media/stock/600x400/img-31.jpg" />
                                                                                </div>


                                                                                <div className="overlay-layer bg-dark bg-opacity-10 rounded">
                                                                                    <a href="#" className="btn btn-sm btn-primary btn-shadow">Explore</a>
                                                                                </div>

                                                                            </div>


                                                                            <div className="overlay">

                                                                                <div className="overlay-wrapper">
                                                                                    <img alt="img" className="rounded w-150px" src="assets/media/stock/600x400/img-40.jpg" />
                                                                                </div>


                                                                                <div className="overlay-layer bg-dark bg-opacity-10 rounded">
                                                                                    <a href="#" className="btn btn-sm btn-primary btn-shadow">Explore</a>
                                                                                </div>

                                                                            </div>

                                                                        </div>
                                                                    </div>

                                                                </div>

                                                            </div>


                                                            <div className="timeline-item">

                                                                <div className="timeline-line w-40px"></div>


                                                                <div className="timeline-icon symbol symbol-circle symbol-40px">
                                                                    <div className="symbol-label bg-light">
                                                                        <i className="ki-duotone ki-sms fs-2 text-gray-500">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                        </i>
                                                                    </div>
                                                                </div>


                                                                <div className="timeline-content mb-10 mt-n1">

                                                                    <div className="pe-3 mb-5">

                                                                        <div className="fs-5 fw-semibold mb-2">New case
                                                                            <a href="#" className="text-primary fw-bold me-1">#67890</a>is assigned to you in Multi-platform Database Design project</div>


                                                                        <div className="overflow-auto pb-5">

                                                                            <div className="d-flex align-items-center mt-1 fs-6">

                                                                                <div className="text-muted me-2 fs-7">Added at 4:23 PM by</div>


                                                                                <a href="#" className="text-primary fw-bold me-1">Alice Tan</a>

                                                                            </div>

                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            </div>


                                                            <div className="timeline-item">

                                                                <div className="timeline-line w-40px"></div>


                                                                <div className="timeline-icon symbol symbol-circle symbol-40px">
                                                                    <div className="symbol-label bg-light">
                                                                        <i className="ki-duotone ki-basket fs-2 text-gray-500">
                                                                            <span className="path1"></span>
                                                                            <span className="path2"></span>
                                                                            <span className="path3"></span>
                                                                            <span className="path4"></span>
                                                                        </i>
                                                                    </div>
                                                                </div>


                                                                <div className="timeline-content mt-n1">

                                                                    <div className="pe-3 mb-5">

                                                                        <div className="fs-5 fw-semibold mb-2">New order
                                                                            <a href="#" className="text-primary fw-bold me-1">#67890</a>is placed for Workshow Planning & Budget Estimation</div>
                                                                        <div className="d-flex align-items-center mt-1 fs-6">

                                                                            <div className="text-muted me-2 fs-7">Placed at 4:23 PM by</div>

                                                                            <a href="#" className="text-primary fw-bold me-1">Jimmy Bold</a>

                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>
                                            </div>

                                            <div className="col-md-4">

                                                <div className="card-title d-flex align-items-center">
                                                    <i className="ki-duotone ki-calendar-8 fs-1 text-primary me-3 lh-0">
                                                        <span className="path1"></span>
                                                        <span className="path2"></span>
                                                        <span className="path3"></span>
                                                        <span className="path4"></span>
                                                        <span className="path5"></span>
                                                        <span className="path6"></span>
                                                    </i>
                                                    <div className='d-flex' style={{ flexDirection: 'column' }}>

                                                        <h3 className="fw-bold m-0 text-gray-800">Patient Allergy Lists</h3>

                                                    </div>
                                                </div>
                                                {
                                                    allergies?.length === 0 ? <div className="d-flex align-items-center border border-dashed border-gray-300 rounded px-7 py-3 mt-7 mb-5" style={{ width: '100%' }}>
                                                        <span href="#" className="fs-5 text-dark text-hover-primary fw-semibold w-auto">Patient has no allergies</span>
                                                    </div> : allergies?.map((allergy) => (
                                                        <div key={allergy.id} className="d-flex align-items-center border border-dashed border-gray-300 rounded px-5 py-2 mt-3 mb-2" style={{ width: '100%' }}>
                                                            <a href="#" className="fs-5 text-dark text-hover-primary fw-semibold w-auto">{allergy.name}</a>
                                                        </div>
                                                    ))
                                                }

                                                <div className="d-flex align-items-center mt-7 mb-5" style={{ width: '100%' }}>
                                                    <form onSubmit={handleAllergySubmit} style={{ width: '100%' }}>
                                                        <div className="fv-row mb-3">
                                                            <input type="text"
                                                                name="new-allergy"
                                                                value={newAllergy}
                                                                onChange={handleAllergyChange}
                                                                placeholder="Enter Allergy"
                                                                autoComplete="off"
                                                                required
                                                                className="form-control bg-transparent"
                                                                style={{ display: showAllergyInput ? 'block' : 'none', width: '100%' }}
                                                            />
                                                        </div>
                                                    </form>
                                                </div>

                                                <a onClick={handleAllergySubmit} className="btn btn-primary px-6 align-self-center text-nowrap mt-8">{loadingAllergy ? 'Adding...' : 'Add New Allergy'}</a>

                                            </div>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div >

                    </div >
            }
        </>
    )

}

export default PatientDetails