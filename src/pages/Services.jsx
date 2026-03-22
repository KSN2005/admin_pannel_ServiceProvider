import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getServices, deleteService } from "../api/servicesApi";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadServices = () => {
    setLoading(true);
    getServices()
      .then((data) => setServices(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    await deleteService(id);
    loadServices();
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Services</h1>
        <button
          onClick={() => navigate("/add-service")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Add New Service
        </button>
      </div>

      <div className="bg-white shadow rounded-xl p-6">
        {loading ? (
          <p>Loading services...</p>
        ) : services.length === 0 ? (
          <p className="text-gray-600">No services yet. Add one to get started.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div key={service._id} className="border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}

                  <div className="flex-1">
                    <h2 className="text-lg font-semibold">{service.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => navigate(`/add-service?id=${service._id}`)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;