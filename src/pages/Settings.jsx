import { useEffect, useState } from "react";
import { getPageContent, updatePageContent } from "../api/contentApi";
import { getSettings, updateSetting } from "../api/settingsApi";
import { uploadImage } from "../api/api";

const Settings = () => {
  const [home, setHome] = useState({ title: "", description: "", bannerImage: "" });
  const [about, setAbout] = useState({ title: "", description: "", bannerImage: "" });
  
  // ✅ Website Settings
  const [websiteSettings, setWebsiteSettings] = useState({
    siteName: "",
    logo: "",
    email: "",
    phone: "",
    address: "",
    description: "",
  });
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadContent();
    loadSettings();
  }, []);

  const loadContent = async () => {
    try {
      const homeData = await getPageContent("home");
      const aboutData = await getPageContent("about");
      setHome(homeData || { title: "", description: "", bannerImage: "" });
      setAbout(aboutData || { title: "", description: "", bannerImage: "" });
    } catch (err) {
      console.error("❌ Error loading content:", err);
      setMessage("Failed to load page content");
    }
  };

  const loadSettings = async () => {
    try {
      const settings = await getSettings();
      setWebsiteSettings(prev => ({
        ...prev,
        siteName: settings.siteName || "",
        logo: settings.logo || "",
        email: settings.email || "",
        phone: settings.phone || "",
        address: settings.address || "",
        description: settings.description || "",
      }));
    } catch (err) {
      console.error("❌ Error loading settings:", err);
      setMessage("Failed to load website settings");
    }
  };

  const handleUpload = async (setter, key) => {
    const file = key.files[0];
    if (!file) return;

    setSaving(true);
    try {
      const { url } = await uploadImage(file);
      setter((prev) => ({ ...prev, bannerImage: url }));
      setMessage("✅ Image uploaded successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("❌ Upload error:", err);
      setMessage("❌ Upload failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Handle logo upload
  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSaving(true);
    try {
      const { url } = await uploadImage(file);
      setWebsiteSettings(prev => ({ ...prev, logo: url }));
      await updateSetting("logo", url);
      setMessage("✅ Logo updated successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("❌ Logo upload error:", err);
      setMessage("❌ Logo upload failed");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Handle website settings save
  const handleSaveWebsiteSettings = async () => {
    setSaving(true);
    try {
      // Save each setting
      await Promise.all([
        updateSetting("siteName", websiteSettings.siteName),
        updateSetting("email", websiteSettings.email),
        updateSetting("phone", websiteSettings.phone),
        updateSetting("address", websiteSettings.address),
        updateSetting("description", websiteSettings.description),
      ]);
      setMessage("✅ Website settings saved successfully");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("❌ Save error:", err);
      const errorMsg = err?.response?.data?.error || "Save failed";
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePageContent = async (page, data) => {
    setSaving(true);
    try {
      await updatePageContent(page, data);
      setMessage(`✅ ${page} content saved successfully`);
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error("❌ Save error:", err);
      const errorMsg = err?.response?.data?.error || "Save failed";
      setMessage(`❌ ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Website Settings</h1>

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

      <div className="space-y-10">

        {/* ✅ Logo Section */}
        <section className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Website Logo</h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {websiteSettings.logo ? (
              <img src={websiteSettings.logo} alt="Logo" className="w-24 h-24 object-contain" />
            ) : (
              <div className="w-24 h-24 bg-gray-100 flex items-center justify-center text-sm text-gray-500">
                No logo
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={saving}
                className="mb-2"
              />
              <p className="text-sm text-gray-500">
                Upload a new logo (will appear in navbar and footer)
              </p>
            </div>
          </div>
        </section>

        {/* ✅ Basic Website Settings */}
        <section className="bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block font-semibold mb-2">Website Name</label>
              <input
                type="text"
                value={websiteSettings.siteName}
                onChange={(e) =>
                  setWebsiteSettings(prev => ({ ...prev, siteName: e.target.value }))
                }
                placeholder="e.g., CMA Himanshu Sharma"
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Email</label>
              <input
                type="email"
                value={websiteSettings.email}
                onChange={(e) =>
                  setWebsiteSettings(prev => ({ ...prev, email: e.target.value }))
                }
                placeholder="contact@example.com"
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Phone</label>
              <input
                type="tel"
                value={websiteSettings.phone}
                onChange={(e) =>
                  setWebsiteSettings(prev => ({ ...prev, phone: e.target.value }))
                }
                placeholder="+91 12345 67890"
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Address</label>
              <input
                type="text"
                value={websiteSettings.address}
                onChange={(e) =>
                  setWebsiteSettings(prev => ({ ...prev, address: e.target.value }))
                }
                placeholder="e.g., Delhi, India"
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-semibold mb-2">Description</label>
              <textarea
                value={websiteSettings.description}
                onChange={(e) =>
                  setWebsiteSettings(prev => ({ ...prev, description: e.target.value }))
                }
                placeholder="Describe your business..."
                className="w-full border px-3 py-2 rounded"
                rows={3}
              />
            </div>
          </div>

          <button
            onClick={handleSaveWebsiteSettings}
            disabled={saving}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Website Settings"}
          </button>
        </section>

        {/* Home Page Section */}
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
                className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={() => handleSavePageContent("home", home)}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Home Content"}
              </button>
            </div>
          </div>
        </section>

        {/* About Page Section */}
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
                className="w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                onClick={() => handleSavePageContent("about", about)}
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
