import { useState, useEffect } from "react";
import api from "../../../utils/axios";
import { toast } from "sonner";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState({
    departmentCode: "",
    departmentName: "",
    grossSalary: ""
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/department");
      setDepartments(res.data.departments);
    } catch (error: any) {
      console.error("Failed to fetch departments", error);
      const message = error.response?.data?.message || "Failed to fetch departments. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (departmentCode: string) => {
    if (!window.confirm("Are you sure you want to delete this department?")) {
      return;
    }

    try {
      await api.delete(`/department/${departmentCode}`);
      toast.success("Department deleted successfully!");
      fetchDepartments();
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to delete department. Please try again.";
      toast.error(message);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!department.departmentCode || !department.departmentName || !department.grossSalary) {
      toast.error("Please fill in all required fields: Code, Name, and Base Gross Salary.");
      return;
    }

    try {
      const payload = {
        ...department,
        grossSalary: parseFloat(department.grossSalary)
      };
      
      console.log("Submitting department payload:", payload);
      await api.post("/department", payload);
      toast.success("Department created successfully!");
      setDepartment({
        departmentCode: "",
        departmentName: "",
        grossSalary: ""
      });
      fetchDepartments();
    } catch (error: any) {
      console.error("Department creation error details:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        fullError: error.response?.data
      });
      
      const message = error.response?.data?.message || "Failed to create department. Please try again.";
      console.log("Displaying error message to user:", message);
      toast.error(message);
    }
  };

  return (
    <main className="flex justify-center items-center p-5 flex-col min-h-screen">
      <div className="w-full max-w-7xl">
        <div className="mb-8">
          <h1 className="text-gray-800 text-3xl font-bold mb-6">Departments</h1>
          <div className="flex justify-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-8 border-2 border-gray-300">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
              <input
                type="text"
                value={department.departmentCode}
                onChange={(e) =>
                  setDepartment({ ...department, departmentCode: e.target.value })
                }
                placeholder="Department Code (e.g., IT, HR, FIN)"
                className="border-2 border-gray-400 p-2 rounded focus:outline-none focus:border-gray-900"
              />

              <input
                type="text"
                value={department.departmentName}
                onChange={(e) =>
                  setDepartment({ ...department, departmentName: e.target.value })
                }
                placeholder="Department Name"
                className="border-2 border-gray-400 p-2 rounded focus:outline-none focus:border-gray-900"
              />

              <input
                type="number"
                step="0.01"
                value={department.grossSalary}
                onChange={(e) =>
                  setDepartment({ ...department, grossSalary: e.target.value })
                }
                placeholder="Base Gross Salary"
                className="border-2 border-gray-400 p-2 rounded focus:outline-none focus:border-gray-900"
              />

              <button
                type="submit"
                className="bg-gray-900 text-white rounded p-2 font-bold hover:bg-gray-800 transition-colors"
              >
                + Create Department
              </button>
            </form>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-gray-800 text-2xl font-bold mb-4">Department List ({departments.length})</h2>
          {loading ? (
            <div className="text-center py-8 text-gray-600">Loading departments...</div>
          ) : departments.length === 0 ? (
            <div className="text-center py-8 text-gray-600 bg-gray-50 rounded-lg border-2 border-gray-200">
              No departments found. Create one to get started!
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg border-2 border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="p-4 text-left font-bold">Code</th>
                    <th className="p-4 text-left font-bold">Department Name</th>
                    <th className="p-4 text-right font-bold">Base Gross Salary</th>
                    <th className="p-4 text-left font-bold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map((dept: any, idx: number) => (
                    <tr key={idx} className="border-b hover:bg-blue-50 transition-colors">
                      <td className="p-4 font-bold text-gray-900">{dept.departmentCode}</td>
                      <td className="p-4">{dept.departmentName}</td>
                      <td className="p-4 text-right font-semibold text-green-700">
                        ${parseFloat(dept.grossSalary).toFixed(2)}
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDelete(dept.departmentCode)}
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

export default Department;
