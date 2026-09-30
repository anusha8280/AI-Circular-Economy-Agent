import { LoaderCircle } from "lucide-react";

interface UploadProgressProps {
  progress: number;
  message?: string;
}

function UploadProgress({
  progress,
  message = "Preparing image...",
}: UploadProgressProps) {
  return (
    <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LoaderCircle className="h-5 w-5 animate-spin text-green-600" />

          <span className="text-sm font-medium text-green-800">
            {message}
          </span>
        </div>

        <span className="text-sm font-bold text-green-700">
          {progress}%
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-green-100">
        <div
          className="h-full rounded-full bg-green-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default UploadProgress;