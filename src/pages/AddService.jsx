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

  useEffect(() => {
    if (!serviceId) return;

    setLoading(true);
    getServices()
      .then((services) => {
        const found = services.find((s) => s._id === serviceId);
        if (found) {
          setForm({
            title: found.title,
            description: found.description,
            imageUrl: found.imageUrl,
          });
        }
      })
      .finally(() => setLoading(false));
  }, [serviceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSaving(true);
    try {
      const { url } = await uploadImage(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (serviceId) {
        await updateService(serviceId, form);
      } else {
        await createService(form);
      }

      alert("Service saved successfully");
      navigate("/services");
    } catch (err) {
      console.error(err);
      alert("Unable to save service. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{serviceId ? "Edit Service" : "Add Service"}</h1>
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
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              rows={5}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Image</label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-slate-600"
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
              disabled={saving}
              className="inline-flex justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Service"}
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              onClick={() => navigate("/services")}
            >
              Cancel
            </button>
          </div>
        </form>

        {loading && <p className="mt-4 text-sm text-slate-500">Loading service...</p>}
      </div>
    </div>
  );
};

export default AddService;
