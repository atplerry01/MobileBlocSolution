import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { decodeToken } from 'react-jwt';
import { useNavigate } from 'react-router-dom';
import { jwtToken } from '../app/helper';

const api = 'https://localhost:7011/api';
const healthProviderId = '78cc38ec-93f2-45d7-81e5-7e49661940dd'

function PatientsCreate() {
    const navigate = useNavigate()

    const [profileId, setprofileId] = useState('')
    const [loading, setLoading] = useState(false)
    const [patients, setPatients] = useState([])
    const [providerId, setProviderId] = useState('')

    useEffect(() => {
        async function test() {
            const providerId = await decodeToken(jwtToken)['ProviderId']
            setProviderId(providerId)
        }
        test()
        getPatients()
    }, [])

    const handleChange = (evt) => {
        setprofileId(evt.target.value)
    }

    const getPatients = () => {
        axios.get(`${api}/Patients/ByProviderId/${providerId}`)
            .then((response) => {
                setPatients(response.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        if(profileId.trim().length === 0) return;
        let check = patients.filter(patient => {
            return patient.userProfileId === profileId
        })
        if (check.length > 0) {
            alert('User already exists!')
        } else {
            setLoading(true)
            axios.post(`${api}/Patients/${profileId}/Provider/${providerId}/create`).then(() => {
                setprofileId('')
                setPatients([])
                navigate('/patients')
            }).catch((error) => {
                alert(error.message)
                console.log(error);
            })
            setLoading(false)
        }
    }

    return (
        <>
            <div class="d-flex flex-column flex-column-fluid">

                <div id="kt_app_toolbar" class="app-toolbar py-3 py-lg-6">

                    <div id="kt_app_toolbar_container" class="app-container container-xxl d-flex flex-stack">

                        <div class="page-title d-flex flex-column justify-content-center flex-wrap me-3">

                            <h1 class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0">Patient Management</h1>


                            <ul class="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">

                                <li class="breadcrumb-item text-muted">
                                    <a href="../../demo1/dist/index.html" class="text-muted text-hover-primary">Home</a>
                                </li>


                                <li class="breadcrumb-item">
                                    <span class="bullet bg-gray-400 w-5px h-2px"></span>
                                </li>


                                <li class="breadcrumb-item text-muted">Account</li>

                            </ul>

                        </div>



                    </div>

                </div>


                <div id="kt_app_content" class="app-content flex-column-fluid">

                    <div id="kt_app_content_container" class="app-container container-xxl">

                        <div class="card mb-5 mb-xl-10">

                            <div class="card-header border-0 cursor-pointer" role="button" data-bs-toggle="collapse" data-bs-target="#kt_account_profile_details" aria-expanded="true" aria-controls="kt_account_profile_details">

                                <div class="card-title m-0">
                                    <h3 class="fw-bold m-0">Profile Details</h3>
                                </div>

                            </div>


                            <div id="kt_account_settings_profile_details" class="collapse show">

                                <form id="kt_account_profile_details_form" class="form">

                                    <div class="card-body border-top p-9">





                                        <div class="row mb-6">

                                            <label class="col-lg-4 col-form-label required fw-semibold fs-6">Patient Id</label>


                                            <div class="col-lg-8 fv-row">
                                                <input
                                                    type="text"
                                                    value={profileId}
                                                    onChange={handleChange}
                                                    name="profileId"
                                                    required
                                                    class="form-control form-control-lg form-control-solid"
                                                    placeholder="Enter profile Id" />
                                            </div>

                                        </div>




                                    </div>


                                    <div class="card-footer d-flex justify-content-end py-6 px-9">
                                        <button onClick={handleSubmit} class="btn btn-primary" id="kt_account_profile_details_submit">{loading ? 'Loading' : 'Create Patients'}</button>
                                    </div>

                                </form>

                            </div>

                        </div>


                    </div>

                </div>

            </div>
        </>
    )
}

export default PatientsCreate