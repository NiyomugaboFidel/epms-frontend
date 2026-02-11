import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../../utils/axios";
import { toast } from "sonner";

const SignUp = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: ""
  });

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password || !formData.fullName) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      console.log("Attempting signup with username:", formData.username);
      await api.post("/signup", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName
      });

      toast.success("Account created successfully! Please login.");
      navigate("/login");
    } catch (error: any) {
      console.error("Signup error details:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        fullError: error.response?.data
      });
      
      const message = error.response?.data?.message || "Signup failed. Please try again.";
      console.log("Displaying error message to user:", message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-gray-800 text-3xl font-bold mb-8 text-center">Sign Up</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border-2 p-3 rounded focus:outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className="w-full border-2 p-3 rounded focus:outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border-2 p-3 rounded focus:outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border-2 p-3 rounded focus:outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              className="w-full border-2 p-3 rounded focus:outline-none focus:border-gray-900"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white rounded p-3 font-bold hover:bg-gray-800 disabled:bg-gray-600"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-gray-900 font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
