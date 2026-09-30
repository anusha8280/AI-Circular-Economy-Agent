import { useRef, useState } from "react";
import {
  ImagePlus,
  Upload,
  Camera,
  AlertCircle,
} from "lucide-react";

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
}

function ImageUploader({
  onImageSelected,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const validateFile = (file: File) => {
    setError("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please upload a JPG, PNG, or WEBP image."
      );
      return false;
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "Image size must be less than 10 MB."
      );
      return false;
    }

    return true;
  };

  const handleFile = (file: File | undefined) => {
    if (!file) {
      return;
    }

    if (!validateFile(file)) {
      return;
    }

    onImageSelected(file);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    handleFile(file);

    event.target.value = "";
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];

    handleFile(file);
  };

  return (
    <div className="w-full">

      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => {
          setIsDragging(false);
        }}
        onDrop={handleDrop}
        className={`rounded-3xl border-2 border-dashed p-10 text-center transition ${
          isDragging
            ? "border-green-500 bg-green-50"
            : "border-gray-200 bg-white hover:border-green-300 hover:bg-green-50/30"
        }`}
      >

        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">
          <ImagePlus className="h-8 w-8 text-green-600" />
        </div>

        <h3 className="mt-6 text-xl font-bold text-gray-900">
          Upload your waste item
        </h3>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
          Upload a clear image of the product or material you
          want to analyze. Our AI will identify it and discover
          circular possibilities.
        </p>

        {/* Buttons */}
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
          >
            <Upload className="h-5 w-5" />
            Choose Image
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-green-300 hover:text-green-600"
          >
            <Camera className="h-5 w-5" />
            Take Photo
          </button>

        </div>

        <p className="mt-5 text-xs text-gray-400">
          JPG, PNG or WEBP • Maximum 10 MB
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      <p className="mt-4 text-center text-xs text-gray-400">
        For best results, use a well-lit image where the item is clearly visible.
      </p>

    </div>
  );
}

export default ImageUploader;