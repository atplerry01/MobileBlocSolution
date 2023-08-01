import * as React from 'react';
import { Routes, Route, Outlet, NavLink } from 'react-router-dom';

const LandingLayout = () => {
    const style = ({ isActive }) => ({
        fontWeight: isActive ? 'bold' : 'normal',
    });

    return (
        <>
            <div class="d-flex flex-column flex-root" id="kt_app_root">
                <div class="mb-0" id="home">
                    <div class="bgi-no-repeat bgi-size-contain bgi-position-x-center bgi-position-y-bottom landing-dark-bg"
                        data-style="background-image: url(assets/media/svg/illustrations/landing.svg)">

                        <div class="landing-header" data-kt-sticky="true" data-kt-sticky-name="landing-header"
                            data-kt-sticky-offset="{default: '200px', lg: '300px'}">
                            <div class="container">
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="d-flex align-items-center flex-equal">

                                        <div style={{
                                            fontSize: 25, color: '#fff', fontWeight: 900
                                        }}>
                                            HealthBloc
                                        </div>

                                    </div>


                                    <div class="d-lg-block" id="kt_header_nav_wrapper">
                                        <div class="d-lg-block p-5 p-lg-0" data-kt-drawer="true"
                                            data-kt-drawer-name="landing-menu"
                                            data-kt-drawer-activate="{default: true, lg: false}" data-kt-drawer-overlay="true"
                                            data-kt-drawer-width="200px" data-kt-drawer-direction="start"
                                            data-kt-drawer-toggle="#kt_landing_menu_toggle" data-kt-swapper="true"
                                            data-kt-swapper-mode="prepend"
                                            data-kt-swapper-parent="{default: '#kt_body', lg: '#kt_header_nav_wrapper'}">

                                            <div class="menu menu-column flex-nowrap menu-rounded menu-lg-row menu-title-gray-500 menu-state-title-primary nav nav-flush fs-5 fw-semibold"
                                                id="kt_landing_menu">

                                                <div class="menu-item">

                                                    <a class="menu-link nav-link active py-3 px-4 px-xxl-6" href="#kt_body"
                                                        data-kt-scroll-toggle="true" data-kt-drawer-dismiss="true">Home</a>

                                                </div>


                                                <div class="menu-item">

                                                    <a class="menu-link nav-link py-3 px-4 px-xxl-6" href="#how-it-works"
                                                        data-kt-scroll-toggle="true" data-kt-drawer-dismiss="true">How it
                                                        Works</a>

                                                </div>


                                                <div class="menu-item">

                                                    <a class="menu-link nav-link py-3 px-4 px-xxl-6" href="#achievements"
                                                        data-kt-scroll-toggle="true"
                                                        data-kt-drawer-dismiss="true">Achievements</a>

                                                </div>


                                                <div class="menu-item">

                                                    <a class="menu-link nav-link py-3 px-4 px-xxl-6" href="#team"
                                                        data-kt-scroll-toggle="true" data-kt-drawer-dismiss="true">Team</a>

                                                </div>


                                                <div class="menu-item">

                                                    <a class="menu-link nav-link py-3 px-4 px-xxl-6" href="#portfolio"
                                                        data-kt-scroll-toggle="true" data-kt-drawer-dismiss="true">Portfolio</a>

                                                </div>


                                                <div class="menu-item">

                                                    <a class="menu-link nav-link py-3 px-4 px-xxl-6" href="#pricing"
                                                        data-kt-scroll-toggle="true" data-kt-drawer-dismiss="true">Pricing</a>

                                                </div>

                                            </div>

                                        </div>
                                    </div>


                                    <div class="flex-equal text-end ms-1">
                                        <a href="/login"
                                            class="btn btn-success">Sign In</a>
                                    </div>

                                </div>

                            </div>

                        </div>


                        <div class="d-flex flex-column flex-center w-100 min-h-350px min-h-lg-500px px-9">

                            <div class="text-center mb-5 mb-lg-10 py-10 py-lg-20">

                                <h1 class="text-white lh-base fw-bold fs-2x fs-lg-3x mb-15">
                                    Build An Outstanding Health Solutions
                                    <br /> with <br />
                                    <span data-style="background: linear-gradient(to right, #12CE5D 0%, #FFD80C 100%);-webkit-background-clip: text;-webkit-text-fill-color: transparent;">
                                        <span id="kt_landing_hero_text">Cloud storage in mind</span>
                                    </span>
                                </h1>

                                <a href="#" class="btn btn-primary">Try Whycespace Mobile</a>

                            </div>


                            <div class="d-flex flex-center flex-wrap position-relative px-5">

                                <div class="d-flex flex-center m-3 m-md-6" data-bs-toggle="tooltip" title="Fujifilm">
                                    <img src="assets/media/svg/brand-logos/fujifilm.svg" class="mh-30px mh-lg-40px" alt="" />
                                </div>


                                <div class="d-flex flex-center m-3 m-md-6" data-bs-toggle="tooltip" title="Vodafone">
                                    <img src="assets/media/svg/brand-logos/vodafone.svg" class="mh-30px mh-lg-40px" alt="" />
                                </div>


                                <div class="d-flex flex-center m-3 m-md-6" data-bs-toggle="tooltip" title="KPMG International">
                                    <img src="assets/media/svg/brand-logos/kpmg.svg" class="mh-30px mh-lg-40px" alt="" />
                                </div>


                                <div class="d-flex flex-center m-3 m-md-6" data-bs-toggle="tooltip" title="Nasa">
                                    <img src="assets/media/svg/brand-logos/nasa.svg" class="mh-30px mh-lg-40px" alt="" />
                                </div>


                                <div class="d-flex flex-center m-3 m-md-6" data-bs-toggle="tooltip" title="Aspnetzero">
                                    <img src="assets/media/svg/brand-logos/aspnetzero.svg" class="mh-30px mh-lg-40px" alt="" />
                                </div>


                                <div class="d-flex flex-center m-3 m-md-6" data-bs-toggle="tooltip"
                                    title="AON - Empower Results">
                                    <img src="assets/media/svg/brand-logos/aon.svg" class="mh-30px mh-lg-40px" alt="" />
                                </div>


                                <div class="d-flex flex-center m-3 m-md-6" data-bs-toggle="tooltip" title="Hewlett-Packard">
                                    <img src="assets/media/svg/brand-logos/hp-3.svg" class="mh-30px mh-lg-40px" alt="" />
                                </div>


                                <div class="d-flex flex-center m-3 m-md-6" data-bs-toggle="tooltip" title="Truman">
                                    <img src="assets/media/svg/brand-logos/truman.svg" class="mh-30px mh-lg-40px" alt="" />
                                </div>

                            </div>

                        </div>

                    </div>




                </div>

                <div class="mb-n10 mb-lg-n20 z-index-2" style={{ marginTop: 30, marginBottom: 30}}>

                    <div class="container">

                        <div class="text-center mb-17">

                            <h3 class="fs-2hx text-dark mb-5" id="how-it-works" data-kt-scroll-offset="{default: 100, lg: 150}">
                                How it Works</h3>
                            <div class="fs-5 text-muted fw-bold">Gives providers, caregivers, suppliers, and patients more information for better and safer care.
                                <br />Starting with affordable tags, providers and suppliers can closely monitor supplies, medications, and consumables.
                            </div>

                        </div>


                        <div class="row w-100 gy-10 mb-md-20">

                            <div class="col-md-4 px-5">

                                <div class="text-center mb-10 mb-md-0">

                                    <img src="assets/media/illustrations/sketchy-1/2.png" class="mh-125px mb-9" alt="" />


                                    <div class="d-flex flex-center mb-5">

                                        <span class="badge badge-circle badge-light-success fw-bold p-5 me-3 fs-3">1</span>


                                        <div class="fs-5 fs-lg-3 fw-bold text-dark">Jane Miller</div>

                                    </div>


                                    <div class="fw-semibold fs-6 fs-lg-4 text-muted">Save thousands to millions of bucks
                                        <br />by using single tool for different
                                        <br />amazing and great
                                    </div>

                                </div>

                            </div>


                            <div class="col-md-4 px-5">

                                <div class="text-center mb-10 mb-md-0">

                                    <img src="assets/media/illustrations/sketchy-1/8.png" class="mh-125px mb-9" alt="" />


                                    <div class="d-flex flex-center mb-5">

                                        <span class="badge badge-circle badge-light-success fw-bold p-5 me-3 fs-3">2</span>


                                        <div class="fs-5 fs-lg-3 fw-bold text-dark">Setup Your App</div>

                                    </div>


                                    <div class="fw-semibold fs-6 fs-lg-4 text-muted">Save thousands to millions of bucks
                                        <br />by using single tool for different
                                        <br />amazing and great
                                    </div>

                                </div>

                            </div>


                            <div class="col-md-4 px-5">

                                <div class="text-center mb-10 mb-md-0">

                                    <img src="assets/media/illustrations/sketchy-1/12.png" class="mh-125px mb-9" alt="" />


                                    <div class="d-flex flex-center mb-5">

                                        <span class="badge badge-circle badge-light-success fw-bold p-5 me-3 fs-3">3</span>


                                        <div class="fs-5 fs-lg-3 fw-bold text-dark">Enjoy Nautica App</div>

                                    </div>


                                    <div class="fw-semibold fs-6 fs-lg-4 text-muted">Save thousands to millions of bucks
                                        <br />by using single tool for different
                                        <br />amazing and great
                                    </div>

                                </div>

                            </div>

                        </div>


                        <div class="tns tns-default">

                            <div data-tns="true" data-tns-loop="true" data-tns-swipe-angle="false" data-tns-speed="2000"
                                data-tns-autoplay="true" data-tns-autoplay-timeout="18000" data-tns-controls="true"
                                data-tns-nav="false" data-tns-items="1" data-tns-center="false" data-tns-dots="false"
                                data-tns-prev-button="#kt_team_slider_prev1" data-tns-next-button="#kt_team_slider_next1">

                                <div class="text-center px-5 pt-5 pt-lg-10 px-lg-10">
                                    <img src="assets/media/preview/demos/demo1/light-ltr.png"
                                        class="card-rounded shadow mh-lg-650px mw-100" alt="" />
                                </div>


                                <div class="text-center px-5 pt-5 pt-lg-10 px-lg-10">
                                    <img src="assets/media/preview/demos/demo2/light-ltr.png"
                                        class="card-rounded shadow mh-lg-650px mw-100" alt="" />
                                </div>


                                <div class="text-center px-5 pt-5 pt-lg-10 px-lg-10">
                                    <img src="assets/media/preview/demos/demo4/light-ltr.png"
                                        class="card-rounded shadow mh-lg-650px mw-100" alt="" />
                                </div>


                                <div class="text-center px-5 pt-5 pt-lg-10 px-lg-10">
                                    <img src="assets/media/preview/demos/demo5/light-ltr.png"
                                        class="card-rounded shadow mh-lg-650px mw-100" alt="" />
                                </div>

                            </div>



                        </div>

                    </div>

                </div>

                <div class="mb-0">

                    <div class="landing-dark-bg">

                        <div class="landing-dark-separator"></div>

                        <div class="container">

                            <div class="d-flex flex-column flex-md-row flex-stack py-7 py-lg-10">

                                <div class="d-flex align-items-center order-2 order-md-1">

                                    <a href="#">
                                        <span style={{ fontSize: 20, color: '#fff', fontWeight: 'bold'}}>HealthBloc</span>
                                    </a>


                                    <span class="mx-5 fs-6 fw-semibold text-gray-600 pt-1" href="#">&copy;
                                        2023 Whycespace Inc.</span>

                                </div>


                                <ul class="menu menu-gray-600 menu-hover-primary fw-semibold fs-6 fs-md-5 order-1 mb-5 mb-md-0">
                                    <li class="menu-item">
                                        <a href="#" target="_blank" class="menu-link px-2">About</a>
                                    </li>
                                    <li class="menu-item mx-5">
                                        <a href="https://devs.keenthemes.com" target="_blank" class="menu-link px-2">Support</a>
                                    </li>
                                    <li class="menu-item">
                                        <a href="" target="_blank" class="menu-link px-2">Purchase</a>
                                    </li>
                                </ul>

                            </div>

                        </div>

                    </div>

                </div>


                <div id="kt_scrolltop" class="scrolltop" data-kt-scrolltop="true">
                    <i class="ki-duotone ki-arrow-up">
                        <span class="path1"></span>
                        <span class="path2"></span>
                    </i>
                </div>

            </div>

            <main style={{ padding: '1rem 0' }}>
                <Outlet />
            </main>
        </>
    );
};

export default LandingLayout