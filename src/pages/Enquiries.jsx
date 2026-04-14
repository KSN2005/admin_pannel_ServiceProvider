import { useEffect, useState } from "react";
import { getSubmissions, deleteSubmission } from "../api/submissionsApi";

const Enquiries = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSubmissions = () => {
    setLoading(true);
    getSubmissions()
      .then((data) => setSubmissions(data))
      .catch((err) => {
        console.error("Failed to load submissions:", err);
        setSubmissions([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this submission?")) return;
    await deleteSubmission(id);
    loadSubmissions();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Client Submissions</h1>

      <div className="bg-white shadow rounded-xl p-6">
        {loading ? (
          <p>Loading...</p>
        ) : submissions.length === 0 ? (
          <p className="text-gray-600">No submissions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Service</th>
                  <th className="p-3 text-left">Message</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((item) => (
                  <tr key={item._id} className="border-b">
                    <td className="p-3">{item.name}</td>
                    <td className="p-3">{item.email}</td>
                    <td className="p-3">{item.phone || "–"}</td>
                    <td className="p-3">{item.service}</td>
                    <td className="p-3">{item.message}</td>
                    <td className="p-3">
                      <button
                        className="text-sm text-red-600 hover:underline"
                        onClick={() => handleDelete(item._id)}
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
  );
};

export default Enquiries;
