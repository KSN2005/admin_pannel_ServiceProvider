import React, { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import { getSubmissions } from "../api/submissionsApi";

const Dashboard = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSubmissions()
      .then((data) => setSubmissions(data))
      .finally(() => setLoading(false));
  }, []);

  const totalInquiries = submissions.length;
  const costManagement = submissions.filter((c) => c.service === "Cost Management").length;
  const taxCompliance = submissions.filter((c) => c.service === "Tax Compliance").length;
  const accounting = submissions.filter((c) => c.service === "Financial Accounting").length;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <DashboardCard title="Total Inquiries" value={loading ? "..." : totalInquiries} className="bg-blue-600 text-white" />
        <DashboardCard title="Cost Management" value={loading ? "..." : costManagement} className="bg-green-600 text-white" />
        <DashboardCard title="Tax Compliance" value={loading ? "..." : taxCompliance} className="bg-purple-600 text-white" />
        <DashboardCard title="Accounting" value={loading ? "..." : accounting} className="bg-orange-600 text-white" />
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Client Inquiries</h2>

        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Service</th>
              <th className="p-3 text-left">Message</th>
            </tr>
          </thead>

          <tbody>
            {submissions.slice(0, 5).map((item) => (
              <tr key={item._id} className="border-b">
                <td className="p-3">{item.name}</td>
                <td className="p-3">{item.email}</td>
                <td className="p-3">{item.service}</td>
                <td className="p-3">{item.message}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {submissions.length === 0 && !loading && (
          <p className="text-gray-500 mt-4">No submissions yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
