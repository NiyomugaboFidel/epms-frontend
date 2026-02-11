import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "sonner";


const Navbar = ()=>{
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUser(null);
      toast.success("Logged out successfully!");
      navigate("/login");
    }
  };

    return(

        <nav  className="bg-gray-900 text-white flex justify-between px-8">
            <ul className="flex justify-center items-center gap-5 p-4">
                {isLoggedIn && (
                  <>
                    <li>
                        <Link to="/">Employees</Link>
                    </li>
                    <li>
                         <Link to="department">Department</Link>
                    </li>
                    <li>
                         <Link to="salaryform">Payroll</Link>
                    </li>
                    <li>
                        <Link to="report">Report</Link>
                    </li>
                  </>
                )}
            </ul>
            <div className="flex justify-center items-center gap-5 p-4">
              {!isLoggedIn ? (
                <>
                  <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">
                    <Link to={'/login'}>Login</Link>
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded">
                    <Link to={"/signup"}>Sign Up</Link>
                  </button>
                </>
              ) : (
                <>
                  <span className="text-sm text-gray-300">Welcome, {user?.username || "User"}</span>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-bold"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
        </nav>

        
    );
}


export default Navbar;

