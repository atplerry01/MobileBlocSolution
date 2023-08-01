/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    username: '', password: ''
  });

  useEffect(() => {
    if (localStorage.getItem('user')) {
      window.location.pathname = '/patients'
  }
  }, [])

  const handleChange = (event) => {
    setLoginInfo({ ...loginInfo, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true); // Set loading state to true

    axios.post('https://localhost:7011/login', loginInfo)
      .then((response) => {
        console.log('xxxx=>', response.data);
        // Reset form data

        if (response.data.responseCode === 200) {
          if (response.data.data && response.data.data.userDetails.isDoctor === false) {
            alert("This portal is not enable for Patients");
          } else {

            localStorage.setItem("user", JSON.stringify(response.data.data));
            window.location.pathname = "/patients"
          }

        } else {
          alert(response.data.message);
        }

        setLoginInfo({ username: "", password: "" });
        setLoading(false); // Set loading state to false
      })
      .catch((error) => {
        console.error(error);
        setLoading(false); // Set loading state to false
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="form w-100" noValidate="novalidate" id="kt_sign_in_form"
        action="#">

        <div className="text-center mb-11">

          <h1 className="text-dark fw-bolder mb-3">Sign In</h1>

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
            <a href="#" className="btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100">
              <img alt="Logo" src="assets/media/svg/brand-logos/apple-black.svg" className="theme-light-show h-15px me-3" />
              <img alt="Logo" src="assets/media/svg/brand-logos/apple-black-dark.svg" className="theme-dark-show h-15px me-3" />Sign in with Apple</a>
          </div>

        </div>

        <div className="separator separator-content my-14">
          <span className="w-125px text-gray-500 fw-semibold fs-7">Or with email</span>
        </div>


        <div className="fv-row mb-8">
          <input type="text"
            name="username"
            value={loginInfo.username}
            onChange={handleChange}
            required
            placeholder="Email" autoComplete="off" className="form-control bg-transparent" />
        </div>

        <div className="fv-row mb-3">
          <input type="password"
            name="password"
            value={loginInfo.password}
            onChange={handleChange}
            required
            placeholder="Password" autoComplete="off" className="form-control bg-transparent" />
        </div>

        <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
          <div></div>
          <a href="../../demo1/dist/authentication/layouts/corporate/reset-password.html"
            className="link-primary">Forgot Password ?</a>
        </div>

        <div className="d-grid mb-10">
          <button type="submit" disabled={loading}
            id="kt_sign_in_submit" className="btn btn-primary">
            <span className="indicator-label">
              {loading ? 'Submitting...' : 'Sign In'}
            </span>
            <span className="indicator-progress">Please wait...
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          </button>
        </div>

        <div className="text-gray-500 text-center fw-semibold fs-6">Not a Member yet? &nbsp;
          <NavLink className="link-primary" to="/signup">
            Sign up
          </NavLink>
        </div>

      </form>
    </div>
  )
}

export default Login