import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { Routes, Route, Outlet, NavLink, useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    username: '', password: '',
    email: '', fullName: '',
    address: '', city: '',
    gender: '', region: '',
    country: '', phoneNumber: '',
    dateOfBirth: '', nationalID: '',
  });

  const handleChange = (event) => {
    setLoginInfo({ ...loginInfo, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true); // Set loading state to true

    // TODO: remove
    // navigate("/patients");
    axios.post('https://localhost:7011/register', loginInfo)
      .then((response) => {
        console.log('xxxx=>', response.data);
        // Reset form data

        if (response.data.responseCode === 200) {
          // Check
          // if (response.data.data && response.data.data.isDoctor === false) {
          if (response.data.data) {
            alert("This portal is not enable for Patients");
          } else {

            localStorage.setItem("user", JSON.stringify(response.data.data));

            navigate("/patients");
          }

        } else {
          alert(response.data.message);
        }

        setLoginInfo({
          username: '', password: '',
          email: '', fullName: '',
          address: '', city: '',
          gender: '', region: '',
          country: '', phoneNumber: '',
          dateOfBirth: '', nationalID: '',
        });
        setLoading(false); // Set loading state to false
      })
      .catch((error) => {
        console.error(error);
        setLoading(false); // Set loading state to false
      });
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className="form w-100" novalidate="novalidate" id="kt_sign_in_form"
        data-kt-redirect-url="../../demo1/dist/index.html" action="#">

        <div className="text-center mb-11">

          <h1 className="text-dark fw-bolder mb-3">Register</h1>

          <div className="text-gray-500 fw-semibold fs-6">Your Social Campaigns</div>

        </div>

        <div className="row g-3 mb-9">

          <div className="col-md-6">

            <a href="#"
              className="btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100">
              <img alt="Logo" src="assets/media/svg/brand-logos/google-icon.svg"
                className="h-15px me-3" />Sign in with Google</a>

          </div>


          <div className="col-md-6">

            <a href="#"
              className="btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100">
              <img alt="Logo" src="assets/media/svg/brand-logos/apple-black.svg"
                className="theme-light-show h-15px me-3" />
              <img alt="Logo" src="assets/media/svg/brand-logos/apple-black-dark.svg"
                className="theme-dark-show h-15px me-3" />Sign in with Apple</a>

          </div>

        </div>



        <div className="separator separator-content my-14">
          <span className="w-125px text-gray-500 fw-semibold fs-7">Or with email</span>
        </div>

        <div className="row g-3 mb-9">

          <div className="col-md-6">
            <div className="fv-row mb-8">
              <input type="text" placeholder="Username" name="username" value={loginInfo.username}
                onChange={handleChange} autoComplete="off"
                required
                className="form-control bg-transparent" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="fv-row mb-8">
              <input type="password" placeholder="Password" name="password" value={loginInfo.password}
                onChange={handleChange} autoComplete="off" required
                className="form-control bg-transparent" />
            </div>
          </div>

          <div className="col-md-12">
            <div className="fv-row mb-8">
              <input type="email" placeholder="Email" name="email" value={loginInfo.email}
                onChange={handleChange} autoComplete="off" required
                className="form-control bg-transparent" />
            </div>
          </div>
        </div>


        <div className="row g-3 mb-9">
          <div className="col-md-6">
            <div className="fv-row mb-8">
              <input type="text" placeholder="Full Name" name="fullName" value={loginInfo.fullName}
                onChange={handleChange} autoComplete="off" required
                className="form-control bg-transparent" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="fv-row mb-3">
              <input type="text" placeholder="Address" name="address" value={loginInfo.address}
                onChange={handleChange} autoComplete="off" required
                className="form-control bg-transparent" />
            </div>
          </div>
          {/*  */}
          <div className="col-md-6">
            <div className="fv-row mb-8">
              <input type="text" placeholder="City" name="city" value={loginInfo.city}
                onChange={handleChange} autoComplete="off" required
                className="form-control bg-transparent" />
            </div>
          </div>
          <div className="col-md-6">
            <div className="fv-row mb-3">
              <select name="gender" id="gender" value={loginInfo.gender}
                onChange={handleChange} className="form-control bg-transparent" required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
          {/*  */}

          <div className="col-md-6">
            <div className="fv-row mb-3">
              <input type="text" placeholder="Region" name="region" value={loginInfo.region}
                onChange={handleChange} autoComplete="off" required
                className="form-control bg-transparent" />
            </div>
          </div>

          <div className="col-md-6">
            <div className="fv-row mb-3">
              <input type="text" placeholder="Country" name="country" value={loginInfo.country}
                onChange={handleChange} autoComplete="off" required
                className="form-control bg-transparent" />
            </div>
          </div>


          <div className="col-md-6">
            <div className="fv-row mb-3">
              <input type="text" placeholder="Phone Number" name="phoneNumber" value={loginInfo.phoneNumber}
                onChange={handleChange} autoComplete="off" required
                className="form-control bg-transparent" />
            </div>
          </div>

          <div className="col-md-6">
            <div className="fv-row mb-3">
              <input type="date" placeholder="DateOfBirth" name="dateOfBirth" value={loginInfo.dateOfBirth}
                onChange={handleChange} autoComplete="off" required
                className="form-control bg-transparent" />
            </div>
          </div>

        </div>


        <div className="fv-row mb-3">
          <input type="text" placeholder="National Id" name="nationalID" value={loginInfo.nationalID}
            onChange={handleChange} autoComplete="off" required
            className="form-control bg-transparent" />
        </div>

        <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
          <div></div>

          <a href="#"
            className="link-primary">Forgot Password ?</a>

        </div>


        <div className="d-grid mb-10">
          <button type="submit" id="kt_sign_in_submit" className="btn btn-primary">

            <span className="indicator-label">{loading ? 'Submitting...' : 'Sign In'}</span>


            <span className="indicator-progress">Please wait...
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>

          </button>
        </div>

        <div className="text-gray-500 text-center fw-semibold fs-6">Not a Member yet? &nbsp;

          <NavLink className="link-primary" to="/login">
            Login
          </NavLink>
        </div>

      </form>
    </div>
  )
}

export default Signup