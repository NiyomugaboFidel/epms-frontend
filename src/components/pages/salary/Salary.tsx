import { useEffect, useState } from "react";
import api from "../../../utils/axios";
import { toast } from "sonner";

const Salary = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0");

  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(false);

  const [salary, setSalary] = useState({
    employeeNumber: "",
    month: `${currentYear}-${currentMonth}`,
    deductions: ""
  });

  useEffect(() => {
    fetchEmployees();
    fetchSalaries();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employee");
      setEmployees(res.data.employee);
    } catch (error: any) {
      console.error("Failed to fetch employees", error);
      const message = error.response?.data?.message || "Failed to fetch employees. Please try again.";
      toast.error(message);
    }
  };

  const fetchSalaries = async () => {
    try {
      setLoading(true);
      const res = await api.get("/salary");
      setSalaries(res.data.salary || []);
    } catch (error: any) {
      console.error("Failed to fetch salaries", error);
      const message = error.response?.data?.message || "Failed to fetch salary records. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!salary.employeeNumber) {
      toast.error("Please select an employee to create a salary record.");
      return;
    }

    try {
      const payload = {
        employeeNumber: parseInt(salary.employeeNumber),
        month: salary.month,
        deductions: salary.deductions ? parseFloat(salary.deductions) : 0
      };

      console.log("Submitting salary payload:", payload);
      await api.post("/salary", payload);
      toast.success("Salary record created successfully!");
      
      setSalary({
        employeeNumber: "",
        month: `${currentYear}-${currentMonth}`,
        deductions: ""
      });
      
      fetchSalaries();
    } catch (error: any) {
      console.error("Salary creation error details:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        fullError: error.response?.data,
        errorMessage: error.message
      });
      
      const message = error.response?.data?.message || "Failed to create salary record. Please try again.";
      console.log("Displaying error message to user:", message);
      toast.error(message);
    }
  };

  const handleDelete = async (salaryId: string) => {
    if (!window.confirm("Are you sure you want to delete this salary record?")) return;

    try {
      await api.delete(`/salary/${salaryId}`);
      toast.success("Salary record deleted successfully!");
      fetchSalaries();
    } catch (error: any) {
      const errMsg = error.response?.data?.message || "Failed to delete salary record";
      console.error("Salary deletion error:", {
        status: error.response?.status,
        message: errMsg,
        fullError: error.response?.data
      });
      toast.error(errMsg);
    }
  };

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  return (
    <main className="flex justify-center items-center p-5 flex-col min-h-screen">
      <div className="w-full max-w-7xl">
        <div className="mb-8">
          <h1 className="text-gray-800 text-3xl font-bold mb-6">Salary Form</h1>
          <div className="flex justify-center bg-gray-100 rounded-lg p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
              <select
                value={salary.employeeNumber}
                onChange={(e) =>
                  setSalary({ ...salary, employeeNumber: e.target.value })
                }
                className="border-2 p-2 rounded"
              >
                <option value="">Select Employee</option>
                {employees.map((emp: any) => (
                  <option key={emp.employeeNumber} value={emp.employeeNumber}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>

              <select
                value={salary.month}
                onChange={(e) =>
                  setSalary({ ...salary, month: e.target.value })
                }
                className="border-2 p-2 rounded"
              >
                {months.map((name, index) => {
                  const monthNumber = String(index + 1).padStart(2, "0");
                  const value = `${currentYear}-${monthNumber}`;
                  return (
                    <option key={value} value={value}>
                      {name} {currentYear}
                    </option>
                  );
                })}
              </select>

              <input
                type="number"
                step="0.01"
                value={salary.deductions}
                onChange={(e) =>
                  setSalary({ ...salary, deductions: e.target.value })
                }
                placeholder="Deductions (optional)"
                className="border-2 p-2 rounded"
              />

              <button
                type="submit"
                className="bg-gray-900 text-white rounded p-2 font-bold hover:bg-gray-800"
              >
                Create Salary Record
              </button>
            </form>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-gray-800 text-2xl font-bold mb-4">Salary Records</h2>
          {loading ? (
            <div className="text-center py-8">Loading salary records...</div>
          ) : salaries.length === 0 ? (
            <div className="text-center py-8 text-gray-600">No salary records found</div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="w-full text-sm">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="p-3 text-left">Employee Name</th>
                    <th className="p-3 text-left">Position</th>
                    <th className="p-3 text-left">Month</th>
                    <th className="p-3 text-right">Gross Salary</th>
                    <th className="p-3 text-right">Deductions</th>
                    <th className="p-3 text-right">Net Salary</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {salaries.map((sal: any, idx: number) => {
                    const deductionsVal = parseFloat(sal.deductions || 0);
                    const grossVal = parseFloat(sal.grossSalary || 0);
                    const netVal = parseFloat(sal.netSalary || 0);
                    
                    return (
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-3 font-semibold">
                          {sal.firstName && sal.lastName 
                            ? `${sal.firstName} ${sal.lastName}` 
                            : `Employee ${sal.employeeNumber}`}
                        </td>
                        <td className="p-3">{sal.position || "-"}</td>
                        <td className="p-3">{sal.month}</td>
                        <td className="p-3 text-right font-semibold">
                          ${grossVal.toFixed(2)}
                        </td>
                        <td className="p-3 text-right text-red-600 font-semibold">
                          ${deductionsVal.toFixed(2)}
                        </td>
                        <td className="p-3 text-right text-green-600 font-bold">
                          ${netVal.toFixed(2)}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDelete(sal.salaryId)}
                            className="bg-red-600 text-white rounded px-3 py-1 hover:bg-red-700 font-bold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Salary;
