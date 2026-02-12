

import { BrowserRouter, Route , Routes } from "react-router-dom"
import Navbar from "./components/layout/Navbar";
import Employee from "./components/pages/employee/EmployeeForm";
import Deparment from "./components/pages/department/Department";
import Salary from "./components/pages/salary/Salary";
import Report from "./components/pages/report/report";
import SignUp from "./components/pages/auth/signup";
import Login from "./components/pages/auth/login";
import Home from "./components/pages/Home";

const App = ()=>{

  return(

    <>

    <BrowserRouter>
      <Navbar />


    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/employee"  element={<Employee />} />
      <Route path="/department"  element={<Deparment />} />
      <Route path="/salaryform"  element={<Salary />} />
      <Route path="/report"  element={<Report />} />
       <Route path="/login"  element={<Login />} />
        <Route path="/signup"  element={<SignUp />} />


    </Routes>
    
    </BrowserRouter>
    </>
  )
}


export default App;