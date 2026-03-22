import { useEffect, useState } from "react";
import { getPageContent, updatePageContent } from "../api/contentApi";
import { getSettings, updateSetting } from "../api/settingsApi";
import { uploadImage } from "../api/api";

const Settings = () => {
  const [home, setHome] = useState({ title: "", description: "", bannerImage: "" });
  const [about, setAbout] = useState({ title: "", description: "", bannerImage: "" });
  const [logo, setLogo] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContent();
    loadSettings();
  }, []);

  const loadContent = async () => {
    try {
      const homeData = await getPageContent("home");
      const aboutData = await getPageContent("about");
      setHome(homeData);
      setAbout(aboutData);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await getSettings();
      setLogo(settings.logo || "");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (setter, key) => {
    const file = key.files[0];
    if (!file) return;

    setSaving(true);
    try {
      const { url } = await uploadImage(file);
      setter((prev) => ({ ...prev, bannerImage: url }));
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSaving(true);
    try {
      const { url } = await uploadImage(file);
      setLogo(url);
      await updateSetting("logo", url);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (page, data) => {
    setSaving(true);
    try {
      await updatePageContent(page, data);
      alert("Saved successfully.");
    } catch (err) {
      console.error(err);
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Save failed.";
      alert(`Save failed: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Website Settings</h1>

      <div className="space-y-10">
        <section className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Logo</h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4">
              {logo ? (
                <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
              ) : (
                <div className="w-24 h-24 bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                  No logo
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleLogoUpload} />
            </div>
            <p className="text-sm text-gray-500">Upload a new logo to update across the website.</p>
          </div>
        </section>

        <section className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Home Page</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input
                  value={home.title}
                  onChange={(e) => setHome((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  value={home.description}
                  onChange={(e) => setHome((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full border px-3 py-2 rounded"
                  rows={4}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Banner Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUpload(setHome, e.target)}
                />
              </div>
            </div>
            <div className="space-y-4">
              {home.bannerImage && (
                <img
                  src={home.bannerImage}
                  alt="Home Banner"
                  className="w-full h-44 object-cover rounded"
                />
              )}
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded"
                onClick={() => handleSave("home", home)}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Home Content"}
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">About Page</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block font-semibold mb-1">Title</label>
                <input
                  value={about.title}
                  onChange={(e) => setAbout((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Description</label>
                <textarea
                  value={about.description}
                  onChange={(e) => setAbout((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full border px-3 py-2 rounded"
                  rows={4}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Banner Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleUpload(setAbout, e.target)}
                />
              </div>
            </div>
            <div className="space-y-4">
              {about.bannerImage && (
                <img
                  src={about.bannerImage}
                  alt="About Banner"
                  className="w-full h-44 object-cover rounded"
                />
              )}
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded"
                onClick={() => handleSave("about", about)}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save About Content"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
