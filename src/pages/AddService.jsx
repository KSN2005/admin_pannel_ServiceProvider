import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createService, updateService, getServices } from "../api/servicesApi";
import { uploadImage } from "../api/api";

const AddService = () => {
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get("id");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);

  // ✅ Validation helper
  const validateForm = () => {
    const newErrors = [];
    if (!form.title || form.title.trim() === "") {
      newErrors.push("Title is required");
    } else if (form.title.trim().length < 2) {
      newErrors.push("Title must be at least 2 characters");
    } else if (form.title.trim().length > 100) {
      newErrors.push("Title must not exceed 100 characters");
    }

    if (form.description && form.description.trim().length > 500) {
      newErrors.push("Description must not exceed 500 characters");
    }

    return newErrors;
  };

  useEffect(() => {
    if (!serviceId) return;

    setLoading(true);
    getServices()
      .then((services) => {
        const found = services.find((s) => s._id === serviceId);
        if (found) {
          setForm({
            title: found.title || "",
            description: found.description || "",
            imageUrl: found.imageUrl || "",
          });
        } else {
          setMessage("❌ Service not found");
        }
      })
      .catch(err => {
        console.error("❌ Error loading service:", err);
        setMessage("❌ Failed to load service");
      })
      .finally(() => setLoading(false));
  }, [serviceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors([]); // Clear errors on input change
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSaving(true);
    try {
      const { url } = await uploadImage(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
      setMessage("✅ Image uploaded successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("❌ Image upload error:", err);
      setMessage("❌ Image upload failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setErrors([]);

    // ✅ Validate form
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setSaving(false);
      return;
    }

    try {
      if (serviceId) {
        await updateService(serviceId, form);
        setMessage("✅ Service updated successfully");
      } else {
        await createService(form);
        setMessage("✅ Service created successfully");
      }

      setTimeout(() => {
        navigate("/services");
      }, 1500);
    } catch (err) {
      console.error("❌ Submit error:", err);
      const errorMsg = err?.response?.data?.error || "Unable to save service. Please try again.";
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {loading ? "Loading..." : serviceId ? "Edit Service" : "Add Service"}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Create or update a service listing for your website.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          onClick={() => navigate("/services")}
        >
          ← Back to services
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-2xl p-8 max-w-2xl">
        {/* ✅ Status Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("✅")
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* ✅ Errors Display */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="font-semibold text-red-700 mb-2">Please fix the following errors:</p>
            <ul className="list-disc list-inside text-red-600 text-sm space-y-1">
              {errors.map((error, idx) => (
                <li key={idx}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter service title"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              required
              disabled={saving}
            />
            <p className="text-xs text-slate-500 mt-1">
              {form.title.length}/100 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your service (optional)"
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              rows={5}
              disabled={saving}
            />
            <p className="text-xs text-slate-500 mt-1">
              {form.description.length}/500 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Service Image
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-slate-600"
                disabled={saving}
              />

              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="Service"
                  className="h-24 w-24 rounded-xl object-cover border border-slate-200"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={saving || loading}
              className="inline-flex justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : serviceId ? "Update Service" : "Create Service"}
            </button>
            <button
              type="button"
              disabled={saving}
              className="inline-flex justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
              onClick={() => navigate("/services")}
            >
              Cancel
            </button>
          </div>
        </form>

        {loading && (
          <p className="mt-4 text-sm text-slate-500">Loading service details...</p>
        )}
      </div>
    </div>
  );
};

export default AddService;
