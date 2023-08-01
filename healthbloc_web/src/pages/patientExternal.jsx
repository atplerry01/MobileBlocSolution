/* eslint-disable no-unreachable */
import React, { useState, useEffect } from 'react'
import { Routes, Route, Outlet, NavLink } from 'react-router-dom';
import axios from 'axios';

const api = 'https://localhost:7011/api';

const PatientExternal = () => {
    const [isAuth, setIsAuth] = useState(false);
    const [patients, setPatients] = useState(null);
    const [providers, setProviders] = useState(null);

    useEffect(() => {
        console.log('xxx');
        // get all patients
        getPatients();

    }, []);

    const getPatients = () => {
        axios.get(`${api}/HealthProviders`)
            .then((response) => {
                setProviders(response.data.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <>
            <div class="d-flex flex-column flex-column-fluid">

                <div id="kt_app_toolbar" class="app-toolbar py-3 py-lg-6">

                    <div id="kt_app_toolbar_container" class="app-container container-xxl d-flex flex-stack">

                        <div class="page-title d-flex flex-column justify-content-center flex-wrap me-3">

                            <h1 style={{ fontSize: 32 }} class="page-heading d-flex text-dark fw-bold flex-column justify-content-center my-0">
                                Crystal Specialist Hospital
                            </h1>


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


                        <div class="d-flex align-items-center gap-2 gap-lg-3">

                            <div class="m-0">

                                <a href="#" class="btn btn-sm btn-flex bg-body btn-color-gray-700 btn-active-color-primary fw-bold" data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end">
                                    <i class="ki-duotone ki-filter fs-6 text-muted me-1">
                                        <span class="path1"></span>
                                        <span class="path2"></span>
                                    </i>Filter</a>


                                <div class="menu menu-sub menu-sub-dropdown w-250px w-md-300px"
                                    data-kt-menu="true" id="kt_menu_641d513899ad2">

                                    <div class="px-7 py-5">
                                        <div class="fs-5 text-dark fw-bold">Filter Options</div>
                                    </div>


                                    <div class="separator border-gray-200"></div>


                                    <div class="px-7 py-5">

                                        <div class="mb-10">

                                            <label class="form-label fw-semibold">Status:</label>


                                            <div>
                                                <select class="form-select form-select-solid" data-kt-select2="true" data-placeholder="Select option" data-dropdown-parent="#kt_menu_641d513899ad2" data-allow-clear="true">
                                                    <option></option>
                                                    <option value="1">Approved</option>
                                                    <option value="2">Pending</option>
                                                    <option value="2">In Process</option>
                                                    <option value="2">Rejected</option>
                                                </select>
                                            </div>

                                        </div>


                                        <div class="mb-10">

                                            <label class="form-label fw-semibold">Member Type:</label>


                                            <div class="d-flex">

                                                <label class="form-check form-check-sm form-check-custom form-check-solid me-5">
                                                    <input class="form-check-input" type="checkbox" value="1" />
                                                    <span class="form-check-label">Author</span>
                                                </label>


                                                <label class="form-check form-check-sm form-check-custom form-check-solid">
                                                    <input class="form-check-input" type="checkbox" value="2" checked="checked" />
                                                    <span class="form-check-label">Customer</span>
                                                </label>

                                            </div>

                                        </div>


                                        <div class="mb-10">

                                            <label class="form-label fw-semibold">Notifications:</label>


                                            <div class="form-check form-switch form-switch-sm form-check-custom form-check-solid">
                                                <input class="form-check-input" type="checkbox" value="" name="notifications" checked="checked" />
                                                <label class="form-check-label">Enabled</label>
                                            </div>

                                        </div>


                                        <div class="d-flex justify-content-end">
                                            <button type="reset" class="btn btn-sm btn-light btn-active-light-primary me-2" data-kt-menu-dismiss="true">Reset</button>
                                            <button type="submit" class="btn btn-sm btn-primary" data-kt-menu-dismiss="true">Apply</button>
                                        </div>

                                    </div>

                                </div>

                            </div>


                            <NavLink className="btn btn-sm fw-bold btn-primary" to="/profiles/create">
                                Create New Profile
                            </NavLink>



                        </div>

                    </div>

                </div>

                <div id="kt_app_content" class="app-content flex-column-fluid">

                    <div id="kt_app_content_container" class="app-container container-xxl">

                        <div class="card mb-5 mb-xxl-10">

                            <div class="card-header">

                                <div class="card-title">
                                    <h3>External Patient Lists</h3>
                                </div>

                                <div class="card-toolbar">
                                    <div class="my-1 me-4">

                                        <select class="form-select form-select-sm form-select-solid w-125px" data-control="select2" data-placeholder="Select Hours" data-hide-search="true">
                                            <option value="1" selected="selected">1 Hours</option>
                                            <option value="2">6 Hours</option>
                                            <option value="3">12 Hours</option>
                                            <option value="4">24 Hours</option>
                                        </select>

                                    </div>
                                    <a href="#" class="btn btn-sm btn-primary my-1">View All</a>
                                </div>

                            </div>

                            <div class="card-body p-0">

                                <div class="table-responsive">

                                    <table class="table align-middle table-row-bordered table-row-solid gy-4 gs-9">

                                        <thead class="border-gray-200 fs-5 fw-semibold bg-lighten">
                                            <tr>
                                                <th class="min-w-250px">FullName</th>
                                                <th class="min-w-100px">Status</th>
                                                <th class="min-w-150px">Last HealthCare</th>
                                                <th class="min-w-150px">Primary HealthCare</th>
                                                <th class="min-w-150px">Last Treatment</th>
                                            </tr>
                                        </thead>

                                        <tbody class="fw-6 fw-semibold text-gray-600">
                                            <tr>
                                                <td>

                                                    <NavLink className="text-hover-primary text-gray-600" to="/patients/1">
                                                        Akinsanya Olanrewaju
                                                    </NavLink>

                                                </td>

                                                <td>
                                                    <span class="badge badge-light-success fs-7 fw-bold">OK</span>
                                                </td>
                                                <td>Chrome - Windows</td>
                                                <td>236.125.56.78</td>
                                                <td>2 mins ago</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href="#" class="text-hover-primary text-gray-600">United Kingdom(10)</a>
                                                </td>
                                                <td>
                                                    <span class="badge badge-light-success fs-7 fw-bold">OK</span>
                                                </td>
                                                <td>Safari - Mac OS</td>
                                                <td>236.125.56.78</td>
                                                <td>10 mins ago</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href="#" class="text-hover-primary text-gray-600">Norway(-)</a>
                                                </td>
                                                <td>
                                                    <span class="badge badge-light-danger fs-7 fw-bold">ERR</span>
                                                </td>
                                                <td>Firefox - Windows</td>
                                                <td>236.125.56.10</td>
                                                <td>20 mins ago</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href="#" class="text-hover-primary text-gray-600">Japan(112)</a>
                                                </td>
                                                <td>
                                                    <span class="badge badge-light-success fs-7 fw-bold">OK</span>
                                                </td>
                                                <td>iOS - iPhone Pro</td>
                                                <td>236.125.56.54</td>
                                                <td>30 mins ago</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a href="#" class="text-hover-primary text-gray-600">Italy(5)</a>
                                                </td>
                                                <td>
                                                    <span class="badge badge-light-warning fs-7 fw-bold">WRN</span>
                                                </td>
                                                <td>Samsung Noted 5- Android</td>
                                                <td>236.100.56.50</td>
                                                <td>40 mins ago</td>
                                            </tr>
                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    )

    const renderLists = () => {
        if (providers.length > 0) {
            return providers.slice(0, 6).map((blog) => {
                return (<>ok</>);
            });
        }
    }



}



export default PatientExternal