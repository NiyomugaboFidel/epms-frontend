import { useEffect, useState } from "react";
import api from "../../../utils/axios";
import { toast } from "sonner";

const Report = () => {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    employeeNumber: "",
    month: "",
    departmentCode: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [salRes, empRes, deptRes] = await Promise.all([
        api.get("/salary"),
        api.get("/employee"),
        api.get("/department")
      ]);
      
      setSalaries(salRes.data.salary || []);
      setEmployees(empRes.data.employee || []);
      setDepartments(deptRes.data.departments || []);
      toast.success("Report data loaded successfully!");
    } catch (error: any) {
      console.error("Report data fetch error details:", {
        status: error.response?.status,
        message: error.response?.data?.message,
        fullError: error.response?.data
      });
      
      const message = error.response?.data?.message || "Failed to load report data. Please try again.";
      console.log("Displaying error message to user:", message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredSalaries = () => {
    let filtered = salaries;

    if (filters.employeeNumber) {
      filtered = filtered.filter(
        (s: any) => s.employeeNumber === parseInt(filters.employeeNumber)
      );
    }

    if (filters.month) {
      filtered = filtered.filter((s: any) => s.month === filters.month);
    }

    if (filters.departmentCode) {
      const deptEmployees = employees
        .filter((e: any) => e.departmentCode === filters.departmentCode)
        .map((e: any) => e.employeeNumber);
      
      filtered = filtered.filter((s: any) =>
        deptEmployees.includes(s.employeeNumber)
      );
    }

    return filtered;
  };

  const calculateTotals = (data: any[]) => {
    return {
      totalGross: data.reduce((sum, s) => sum + parseFloat(s.grossSalary || 0), 0),
      totalDeductions: data.reduce((sum, s) => sum + parseFloat(s.deductions || 0), 0),
      totalNet: data.reduce((sum, s) => sum + parseFloat(s.netSalary || 0), 0),
      count: data.length
    };
  };

  const filteredData = getFilteredSalaries();
  const totals = calculateTotals(filteredData);

  const months = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, "0");
    const names = [
      "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December"
    ];
    return { value: month, name: names[i] };
  });

  return (
    <main className="flex justify-center items-center p-5 flex-col min-h-screen">
      <div className="w-full max-w-7xl">
        <h1 className="text-gray-800 text-3xl font-bold mb-6">Salary Report</h1>

        {/* Filters Form */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 mb-6 border-2 border-gray-300">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Filter Report</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Employee</label>
              <select
                value={filters.employeeNumber}
                onChange={(e) =>
                  setFilters({ ...filters, employeeNumber: e.target.value })
                }
                className="w-full border-2 border-gray-400 p-2 rounded focus:outline-none focus:border-gray-900"
              >
                <option value="">All Employees</option>
                {employees.map((emp: any) => (
                  <option key={emp.employeeNumber} value={emp.employeeNumber}>
                    {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Month</label>
              <select
                value={filters.month}
                onChange={(e) =>
                  setFilters({ ...filters, month: e.target.value })
                }
                className="w-full border-2 border-gray-400 p-2 rounded focus:outline-none focus:border-gray-900"
              >
                <option value="">All Months</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Department</label>
              <select
                value={filters.departmentCode}
                onChange={(e) =>
                  setFilters({ ...filters, departmentCode: e.target.value })
                }
                className="w-full border-2 border-gray-400 p-2 rounded focus:outline-none focus:border-gray-900"
              >
                <option value="">All Departments</option>
                {departments.map((dept: any) => (
                  <option key={dept.departmentCode} value={dept.departmentCode}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                onClick={() => setFilters({ employeeNumber: "", month: "", departmentCode: "" })}
                className="flex-1 bg-gray-500 text-white rounded p-2 hover:bg-gray-600 font-bold"
              >
                Clear
              </button>
              <button
                onClick={fetchData}
                className="flex-1 bg-gray-900 text-white rounded p-2 hover:bg-gray-800 font-bold"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {filteredData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded-lg">
              <div className="text-sm text-gray-600 font-bold">Total Records</div>
              <div className="text-3xl font-bold text-blue-600">{totals.count}</div>
            </div>
            <div className="bg-green-50 border-2 border-green-300 p-4 rounded-lg">
              <div className="text-sm text-gray-600 font-bold">Total Gross</div>
              <div className="text-3xl font-bold text-green-600">
                ${totals.totalGross.toFixed(2)}
              </div>
            </div>
            <div className="bg-red-50 border-2 border-red-300 p-4 rounded-lg">
              <div className="text-sm text-gray-600 font-bold">Total Deductions</div>
              <div className="text-3xl font-bold text-red-600">
                ${totals.totalDeductions.toFixed(2)}
              </div>
            </div>
            <div className="bg-purple-50 border-2 border-purple-300 p-4 rounded-lg">
              <div className="text-sm text-gray-600 font-bold">Total Net</div>
              <div className="text-3xl font-bold text-purple-600">
                ${totals.totalNet.toFixed(2)}
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        {loading ? (
          <div className="text-center py-8 text-gray-600">Loading report...</div>
        ) : filteredData.length === 0 ? (
          <div className="text-center py-8 text-gray-600 bg-gray-50 rounded-lg border-2 border-gray-200">
            No records found
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow-lg border-2 border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="p-4 text-left font-bold">Employee</th>
                  <th className="p-4 text-left font-bold">Position</th>
                  <th className="p-4 text-left font-bold">Department</th>
                  <th className="p-4 text-left font-bold">Month</th>
                  <th className="p-4 text-right font-bold">Gross Salary</th>
                  <th className="p-4 text-right font-bold">Deductions</th>
                  <th className="p-4 text-right font-bold">Net Salary</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((sal: any, idx: number) => {
                  const employee: any = employees.find(
                    (e: any) => e.employeeNumber === sal.employeeNumber
                  );
                  const dept: any = departments.find(
                    (d: any) => d.departmentCode === employee?.departmentCode
                  );
                  
                  const grossVal = parseFloat(sal.grossSalary || 0);
                  const dedVal = parseFloat(sal.deductions || 0);
                  const netVal = parseFloat(sal.netSalary || 0);

                  return (
                    <tr key={idx} className="border-b hover:bg-blue-50 transition-colors">
                      <td className="p-4 font-semibold">
                        {sal.firstName && sal.lastName
                          ? `${sal.firstName} ${sal.lastName}`
                          : `Employee ${sal.employeeNumber}`}
                      </td>
                      <td className="p-4">{sal.position || "-"}</td>
                      <td className="p-4">{dept?.departmentName || "-"}</td>
                      <td className="p-4 font-semibold">{sal.month}</td>
                      <td className="p-4 text-right font-semibold text-green-700">
                        ${grossVal.toFixed(2)}
                      </td>
                      <td className="p-4 text-right font-semibold text-red-700">
                        ${dedVal.toFixed(2)}
                      </td>
                      <td className="p-4 text-right font-bold text-blue-700">
                        ${netVal.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-200 font-bold border-t-2 border-gray-900">
                <tr>
                  <td colSpan={4} className="p-4 text-right">
                    TOTALS:
                  </td>
                  <td className="p-4 text-right text-green-700">
                    ${totals.totalGross.toFixed(2)}
                  </td>
                  <td className="p-4 text-right text-red-700">
                    ${totals.totalDeductions.toFixed(2)}
                  </td>
                  <td className="p-4 text-right text-blue-700">
                    ${totals.totalNet.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </main>
  );
};

export default Report;
