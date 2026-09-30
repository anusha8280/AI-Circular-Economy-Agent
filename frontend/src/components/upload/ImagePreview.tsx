import { X, Image as ImageIcon } from "lucide-react";

interface ImagePreviewProps {
  imageUrl: string;
  fileName: string;
  onRemove: () => void;
}

function ImagePreview({
  imageUrl,
  fileName,
  onRemove,
}: ImagePreviewProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      
      <div className="relative aspect-video w-full bg-gray-100">
        <img
          src={imageUrl}
          alt="Waste preview"
          className="h-full w-full object-contain"
        />

        <button
          type="button"
          onClick={onRemove}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-md transition hover:bg-red-50 hover:text-red-600"
          aria-label="Remove image"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-3 border-t border-gray-100 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
          <ImageIcon className="h-5 w-5 text-green-600" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-800">
            {fileName}
          </p>

          <p className="text-xs text-gray-500">
            Ready for AI analysis
          </p>
        </div>
      </div>
    </div>
  );
}

export default ImagePreview;