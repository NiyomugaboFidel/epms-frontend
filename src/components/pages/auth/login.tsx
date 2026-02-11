import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../utils/axios";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const handleChange = (e: any) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!credentials.username || !credentials.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      console.log("Attempting login with credentials:", { username: credentials.username });
      const res = await api.post("/login", credentials);
      
      // Store token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      toast.success("Login successful!");
      navigate("/");
    } catch (error: any) {
      console.error("Login error details:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        fullError: error.response?.data
      });
      
      const message = error.response?.data?.message || "Login failed. Please check your credentials and try again.";
      console.log("Displaying error message to user:", message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-gray-800 text-3xl font-bold mb-8 text-center">Login</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full border-2 p-3 rounded focus:outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border-2 p-3 rounded focus:outline-none focus:border-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white rounded p-3 font-bold hover:bg-gray-800 disabled:bg-gray-600"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-gray-900 font-bold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
