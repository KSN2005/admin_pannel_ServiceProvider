import { useState } from "react";

const ImageUploader = ({ label, onUpload, initialUrl }) => {
  const [preview, setPreview] = useState(initialUrl || "");
  const [loading, setLoading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const result = await onUpload(file);
      if (result?.url) {
        setPreview(result.url);
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold">{label}</label>
      <div className="flex items-center gap-4">
        <input type="file" accept="image/*" onChange={handleFile} />
        {loading && <span className="text-sm text-gray-500">Uploading...</span>}
      </div>
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-32 h-20 object-cover rounded border"
        />
      )}
    </div>
  );
};

export default ImageUploader;
