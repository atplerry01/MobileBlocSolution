import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./../layouts/MainLayout";
import AuthLayout from "./../layouts/AuthLayout";
import LandingLayout from "./../layouts/LandingLayout";
import About from "../pages/about";
import Login from "../pages/login";
import Signup from "../pages/signup";
import Home from "../pages/home";
import PatientLists from "../pages/patients";
import PatientExternal from "../pages/patientExternal";
import PatientDetails from "../pages/patientDetails";
import PatientCreate from "../pages/patientsCreate";
import CloudSync from "../pages/cloudSync";
import ProviderCreate from "../pages/providerCreate";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route element={<LandingLayout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<p>There's nothing here: 404!</p>} />
        </Route>

        <Route path="patients" element={<MainLayout />}>
          <Route index element={<PatientLists />} />
          <Route path=":id" element={<PatientDetails />} />
          <Route path="create" element={<PatientCreate />} />
          <Route path="external" element={<PatientExternal />} />
          <Route path="cloud-sync" element={<CloudSync />} />
          <Route path="createProvider" element={<ProviderCreate />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
