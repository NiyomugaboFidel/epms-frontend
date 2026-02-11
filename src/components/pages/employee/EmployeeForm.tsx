import { useEffect, useState } from "react";
import api from "../../../utils/axios";
import { toast } from "sonner";

const Employee = () => {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    gender: "male",
    address: "",
    position: "",
    departmentCode: ""
  });

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/department");
      setDepartments(res.data.departments);
    } catch (error) {
      console.error("Failed to fetch departments", error);
      toast.error("Failed to fetch departments");
    }
  };

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get("/employee");
      setEmployees(res.data.employee);
    } catch (error: any) {
      console.error("Failed to fetch employees", error);
      const message = error.response?.data?.message || "Failed to fetch employees. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (employeeNumber: number) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      await api.delete(`/employee/${employeeNumber}`);
      toast.success("Employee deleted successfully!");
      fetchEmployees();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete employee. Please try again.";
      toast.error(message);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!employee.firstName || !employee.lastName || !employee.departmentCode || !employee.position) {
      toast.error("Please fill in all required fields: First Name, Last Name, Position, and Department.");
      return;
    }

    try {
      await api.post("/employee", employee);
      toast.success("Employee created successfully!");
      setEmployee({
        firstName: "",
        lastName: "",
        gender: "male",
        address: "",
        position: "",
        departmentCode: ""
      });
      fetchEmployees();
    } catch (error: any) {
      console.error("Employee creation error details:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        fullError: error.response?.data
      });
      
      const message = error.response?.data?.message || "Failed to create employee. Please try again.";
      console.log("Displaying error message to user:", message);
      toast.error(message);
    }
  };

  return (
    <main className="flex justify-center items-center p-5 flex-col min-h-screen">
      <div className="w-full max-w-7xl">
        <div className="mb-8">
          <h1 className="text-gray-800 text-3xl font-bold mb-6">Employees</h1>
          <div className="flex justify-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-8 border-2 border-gray-300">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
              <input
                type="text"
                value={employee.firstName}
                onChange={(e) =>
                  setEmployee({ ...employee, firstName: e.target.value })
                }
                placeholder="First Name"
                className="border-2 border-gray-400 p-2 rounded focus:outline-none focus:border-gray-900"
              />

              <input
                type="text"
                value={employee.lastName}
                onChange={(e) =>
                  setEmployee({ ...employee, lastName: e.target.value })
                }
                placeholder="Last Name"
                className="border-2 border-gray-400 p-2 rounded focus:outline-none focus:border-gray-900"
              />

              <select
                value={employee.gender}
                onChange={(e) =>
                  setEmployee({ ...employee, gender: e.target.value })
                }
                className="border-2 border-gray-400 p-2 rounded focus:outline-none focus:border-gray-900"
              >
                <option value="">-- Select Gender --</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <select
                value={employee.departmentCode}
                onChange={(e) =>
                  setEmployee({ ...employee, departmentCode: e.target.value })
                }
                className="border-2 border-gray-400 p-2 rounded focus:outline-none focus:border-gray-900"
              >
                <option value="">-- Select Department --</option>
                {departments.map((dept: any) => (
                  <option key={dept.departmentCode} value={dept.departmentCode}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={employee.address}
                onChange={(e) =>
                  setEmployee({ ...employee, address: e.target.value })
                }
                placeholder="Address (optional)"
                className="border-2 border-gray-400 p-2 rounded focus:outline-none focus:border-gray-900"
              />

              <input
                type="text"
                value={employee.position}
                onChange={(e) =>
                  setEmployee({ ...employee, position: e.target.value })
                }
                placeholder="Position"
                className="border-2 border-gray-400 p-2 rounded focus:outline-none focus:border-gray-900"
              />

              <button
                type="submit"
                className="bg-gray-900 text-white rounded p-2 font-bold hover:bg-gray-800 transition-colors"
              >
                + Create Employee
              </button>
            </form>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-gray-800 text-2xl font-bold mb-4">Employee List ({employees.length})</h2>
          {loading ? (
            <div className="text-center py-8 text-gray-600">Loading employees...</div>
          ) : employees.length === 0 ? (
            <div className="text-center py-8 text-gray-600 bg-gray-50 rounded-lg border-2 border-gray-200">
              No employees found. Create one to get started!
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg border-2 border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="p-4 text-left font-bold">ID</th>
                    <th className="p-4 text-left font-bold">First Name</th>
                    <th className="p-4 text-left font-bold">Last Name</th>
                    <th className="p-4 text-left font-bold">Gender</th>
                    <th className="p-4 text-left font-bold">Position</th>
                    <th className="p-4 text-left font-bold">Address</th>
                    <th className="p-4 text-left font-bold">Department</th>
                    <th className="p-4 text-left font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp: any) => (
                    <tr key={emp.employeeNumber} className="border-b hover:bg-blue-50 transition-colors">
                      <td className="p-4 font-bold text-gray-900">{emp.employeeNumber}</td>
                      <td className="p-4">{emp.firstName}</td>
                      <td className="p-4">{emp.lastName}</td>
                      <td className="p-4 capitalize">{emp.gender}</td>
                      <td className="p-4">{emp.position}</td>
                      <td className="p-4">{emp.address || "-"}</td>
                      <td className="p-4 font-semibold">{emp.departmentCode}</td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDelete(emp.employeeNumber)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 font-bold transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Employee;
