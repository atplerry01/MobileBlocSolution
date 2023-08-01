/* eslint-disable no-unreachable */
import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { decodeToken } from 'react-jwt';
import Loader from '../app/components/Loader';
import { jwtToken } from '../app/helper';
import { toast } from 'react-toastify';


const api = 'https://localhost:7011/api';
// const jwtToken = JSON.parse(localStorage.getItem('user'))['jwtToken']

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [provider, setProvider] = useState('');


    useEffect(() => {
        // get all patients
        // async function test(cb) {
        //     const providerId = await decodeToken(jwtToken)['ProviderId']
        //     const expired = await isExpired(jwtToken)
        //     setProviderId(providerId)
        //     if (expired) {
        //         localStorage.removeItem('user')
        //         toast.error('You need to login to continue!')
        //         window.location.pathname = '/login'
        //     }
        //     getPatients();
        // }
        if (localStorage.getItem('user')) {
            getPatients()
        } else {
            toast.success('User not login')
            window.location.pathname = '/login'
        }
    }, []);


    const getPatients = async () => {
        const providerId = await decodeToken(jwtToken)['ProviderId']
        axios.get(`${api}/Patients/ByProviderId/${providerId}`)
            .then((response) => {
                setPatients(response.data.data);
                getHealthCareProvider(providerId)
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const getHealthCareProvider = async (id) => {
        try {
            const name = await axios.get(`${api}/HealthProviders/${id}`)
            setProvider(name.data.data);
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <>
            {
                patients.length === 0 ? <Loader /> :
                    <div className="d-flex flex-column flex-column-fluid">

                        <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">

                            <div id="kt_app_toolbar_container" className="app-container container-xxl d-flex flex-stack">

                                <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">

                                    <h1 style={{ fontSize: 32 }} className="page-heading d-flex text-dark fw-bold flex-column justify-content-center my-0">
                                        {provider?.name}
                                    </h1>


                                    <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">

                                        <li className="breadcrumb-item text-muted">
                                            <a href="../../demo1/dist/index.html" className="text-muted text-hover-primary">Home</a>
                                        </li>

                                        <li className="breadcrumb-item">
                                            <span className="bullet bg-gray-400 w-5px h-2px"></span>
                                        </li>

                                        <li className="breadcrumb-item text-muted">{provider?.name}</li>

                                        <li className="breadcrumb-item">
                                            <span className="bullet bg-gray-400 w-5px h-2px"></span>
                                        </li>


                                        <li className="breadcrumb-item text-muted">Patients</li>

                                    </ul>

                                </div>


                                <div className="d-flex align-items-center gap-2 gap-lg-3">

                                    <div className="m-0">



                                    </div>

                                    <NavLink className="btn btn-sm fw-bold btn-primary" to={`/patients/create/`}>
                                        Add New Patient
                                    </NavLink>



                                </div>

                            </div>

                        </div>

                        <div id="kt_app_content" className="app-content flex-column-fluid">

                            <div id="kt_app_content_container" className="app-container container-xxl">

                                <div className="card mb-5 mb-xxl-10">

                                    <div className="card-header">

                                        <div className="card-title">
                                            <h3>Patient Lists</h3>
                                        </div>

                                    </div>

                                    <div className="card-body p-0">

                                        <div className="table-responsive">

                                            <table className="table align-middle table-row-bordered table-row-solid gy-4 gs-9">

                                                <thead className="border-gray-200 fs-5 fw-semibold bg-lighten">
                                                    <tr>
                                                        <th className="min-w-250px">FullName</th>
                                                        <th className="min-w-100px">Status</th>
                                                        <th className="min-w-150px">Last HealthCare</th>
                                                        <th className="min-w-150px">Gender</th>
                                                        <th className="min-w-150px">Last Treatment</th>
                                                    </tr>
                                                </thead>

                                                <tbody className="fw-6 fw-semibold text-gray-600">
                                                    {
                                                        patients?.map((item) => (
                                                            <tr key={item.id}>

                                                                <td>

                                                                    <a className="text-hover-primary text-gray-600" href={`/patients/${item.id}`}>
                                                                        {item.userProfile.fullName}
                                                                    </a>

                                                                </td>

                                                                <td>
                                                                    <span className="badge badge-light-success fs-7 fw-bold">OK</span>
                                                                </td>
                                                                <td>{item?.lastHealthProvider.name}</td>
                                                                <td>{item.userProfile.gender !== 'Female' ? 'Male' : 'Female'}</td>
                                                                <td>2 mins ago</td>
                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>

                                            </table>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>
            }
        </>
    )

    // const renderLists = () => {
    //     if (providers.length > 0) {
    //         return providers.slice(0, 6).map((blog) => {
    //             return (<>ok</>);
    //         });
    //     }
    // }



}



export default Patients