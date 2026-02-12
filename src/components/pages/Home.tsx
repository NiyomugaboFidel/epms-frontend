import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center">
      <section className="bg-white shadow-xl rounded-2xl p-10 max-w-3xl text-center">
        
        <h1 className="text-4xl uppercase font-bold text-gray-900 mb-4">
          Employee Payroll Management System
        </h1>

        <p className="text-gray-600 text-lg mb-6">
          Manage employees, departments, and salaries efficiently with a
          simple and powerful payroll management platform.
        </p>

        <div className="flex justify-center gap-4 text-white">
     <button className="bg-gray-900 hover:bg-gray-600 px-4 py-2 rounded">
                    <Link to={'/login'}>Login</Link>
                  </button>
                  <button className="bg-gray-900 hover:bg-gray-600 px-4 py-2 rounded">
                    <Link to={"/signup"}>Sign Up</Link>
                  </button>
        </div>

      </section>
    </div>
  );
};

export default Home;
