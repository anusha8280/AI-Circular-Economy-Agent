import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Image as ImageIcon,
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  analyzeWasteImage,
  type AnalysisResult,
  type RecommendationsResult,
} from "../services/analysisService";


const UploadPage = () => {
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);

  const [preview, setPreview] = useState<string | null>(null);

  const [analysisResult, setAnalysisResult] =
    useState<AnalysisResult | null>(null);

  const [recommendations, setRecommendations] =
    useState<RecommendationsResult | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);


  // ============================================================
  // FILE SELECT
  // ============================================================

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);

    setAnalysisResult(null);

    setRecommendations(null);

    setError(null);

    const previewUrl = URL.createObjectURL(
      selectedFile
    );

    setPreview(previewUrl);
  };


  // ============================================================
  // ANALYZE IMAGE
  // ============================================================

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please select an image first.");
      return;
    }

    try {
      setLoading(true);

      setError(null);

      const result = await analyzeWasteImage(file);


      // ========================================================
      // IMPORTANT FIX
      // ========================================================

      setAnalysisResult(
        result.analysis
      );


      // ========================================================
      // SAVE RECOMMENDATIONS
      // ========================================================

      setRecommendations(
        result.recommendations
      );


    } catch (err: unknown) {

      console.error(
        "Image analysis failed:",
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Image analysis failed. Please try again."
        );
      }

    } finally {

      setLoading(false);

    }
  };


  // ============================================================
  // CONTINUE TO RECOMMENDATIONS
  // ============================================================

  const handleContinue = () => {

    if (!analysisResult) {
      return;
    }

    navigate(
      "/recommendations",
      {
        state: {
          file,
          analysis: analysisResult,
          recommendations,
        },
      }
    );
  };


  // ============================================================
  // RESET
  // ============================================================

  const handleReset = () => {

    setFile(null);

    setPreview(null);

    setAnalysisResult(null);

    setRecommendations(null);

    setError(null);
  };


  return (
    <div className="min-h-screen bg-gray-50">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="border-b bg-white">

        <div className="mx-auto max-w-7xl px-6 py-5">

          <h1 className="text-2xl font-bold text-gray-900">
            CircularAI
          </h1>

          <p className="text-sm text-gray-500">
            AI Circular Economy Agent
          </p>

        </div>

      </header>


      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-5xl px-6 py-10">

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-gray-900">
            Analyze Your Waste
          </h2>

          <p className="mt-2 text-gray-600">
            Upload an image and let AI identify the
            object, material and possible reuse options.
          </p>

        </div>


        {/* ====================================================
            ERROR
        ==================================================== */}

        {error && (

          <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

            <AlertCircle
              className="mt-0.5 text-red-600"
              size={20}
            />

            <div>

              <p className="font-medium text-red-800">
                Analysis failed
              </p>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>

            </div>

          </div>

        )}


        {/* ====================================================
            UPLOAD CARD
        ==================================================== */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          {!preview ? (

            <label
              htmlFor="waste-image"
              className="flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-green-500 hover:bg-green-50"
            >

              <div className="mb-4 rounded-full bg-green-100 p-4">

                <Upload
                  size={32}
                  className="text-green-600"
                />

              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                Upload Waste Image
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                JPG, JPEG, PNG or WEBP
              </p>

              <input
                id="waste-image"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />

            </label>

          ) : (

            <div>

              {/* =================================================
                  IMAGE PREVIEW
              ================================================= */}

              <div className="overflow-hidden rounded-xl border bg-gray-100">

                <img
                  src={preview}
                  alt="Selected waste"
                  className="mx-auto max-h-[450px] w-full object-contain"
                />

              </div>


              {/* =================================================
                  FILE NAME
              ================================================= */}

              <div className="mt-4 flex items-center gap-3">

                <ImageIcon
                  size={20}
                  className="text-gray-500"
                />

                <span className="truncate text-sm text-gray-700">
                  {file?.name}
                </span>

              </div>


              {/* =================================================
                  BUTTONS
              ================================================= */}

              <div className="mt-6 flex flex-wrap gap-3">

                {!analysisResult && (

                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >

                    {loading ? (
                      <>
                        <Loader2
                          size={20}
                          className="animate-spin"
                        />

                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze Image

                        <ArrowRight
                          size={20}
                        />
                      </>
                    )}

                  </button>

                )}


                <button
                  type="button"
                  onClick={handleReset}
                  className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Choose Another
                </button>

              </div>

            </div>

          )}

        </div>


        {/* ====================================================
            ANALYSIS RESULT
        ==================================================== */}

        {analysisResult && (

          <div className="mt-8">

            <div className="mb-5 flex items-center gap-2">

              <CheckCircle2
                size={24}
                className="text-green-600"
              />

              <h2 className="text-2xl font-bold text-gray-900">
                AI Analysis Complete
              </h2>

            </div>


            {/* =================================================
                BASIC INFORMATION
            ================================================= */}

            <div className="grid gap-4 sm:grid-cols-2">

              {/* OBJECT */}

              <div className="rounded-xl border bg-white p-5 shadow-sm">

                <p className="text-sm text-gray-500">
                  Detected Object
                </p>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  {analysisResult.object_name}
                </p>

              </div>


              {/* MATERIAL */}

              <div className="rounded-xl border bg-white p-5 shadow-sm">

                <p className="text-sm text-gray-500">
                  Material
                </p>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  {analysisResult.material}
                </p>

              </div>


              {/* CONDITION */}

              <div className="rounded-xl border bg-white p-5 shadow-sm">

                <p className="text-sm text-gray-500">
                  Condition
                </p>

                <p className="mt-2 text-xl font-bold text-gray-900">
                  {analysisResult.condition}
                </p>

              </div>


              {/* CONFIDENCE */}

              <div className="rounded-xl border bg-white p-5 shadow-sm">

                <p className="text-sm text-gray-500">
                  AI Confidence
                </p>

                <p className="mt-2 text-xl font-bold text-green-600">
                  {analysisResult.confidence}%
                </p>

              </div>

            </div>


            {/* =================================================
                DESCRIPTION
            ================================================= */}

            {analysisResult.description && (

              <div className="mt-4 rounded-xl border bg-white p-5 shadow-sm">

                <p className="text-sm font-medium text-gray-500">
                  Description
                </p>

                <p className="mt-2 text-gray-700">
                  {analysisResult.description}
                </p>

              </div>

            )}


            {/* =================================================
                RECOMMENDED ACTION
            ================================================= */}

            {analysisResult.recommended_action && (

              <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-5">

                <p className="text-sm font-semibold text-green-700">
                  Recommended Circular Action
                </p>

                <p className="mt-2 text-lg font-semibold text-green-900">
                  {analysisResult.recommended_action}
                </p>

              </div>

            )}


            {/* =================================================
                IDEAS
            ================================================= */}

            <div className="mt-8 grid gap-5 md:grid-cols-2">


              {/* REUSE */}

              <IdeaCard
                title="Reuse Ideas"
                ideas={
                  analysisResult.reuse_ideas
                }
              />


              {/* UPCYCLE */}

              <IdeaCard
                title="Upcycling Ideas"
                ideas={
                  analysisResult.upcycle_ideas
                }
              />


              {/* HOME DECOR */}

              <IdeaCard
                title="Home Decoration"
                ideas={
                  analysisResult.home_decor_ideas
                }
              />


              {/* RECYCLE */}

              <IdeaCard
                title="Recycling Ideas"
                ideas={
                  analysisResult.recycle_ideas
                }
              />

            </div>


            {/* =================================================
                CONTINUE
            ================================================= */}

            <div className="mt-8 flex justify-end">

              <button
                type="button"
                onClick={handleContinue}
                className="flex items-center gap-2 rounded-xl bg-green-600 px-7 py-3 font-semibold text-white hover:bg-green-700"
              >

                View Recommendations

                <ArrowRight
                  size={20}
                />

              </button>

            </div>

          </div>

        )}

      </main>

    </div>
  );
};


// ============================================================
// IDEA CARD
// ============================================================

interface IdeaCardProps {
  title: string;
  ideas: string[];
}


const IdeaCard = ({
  title,
  ideas,
}: IdeaCardProps) => {

  return (

    <div className="rounded-xl border bg-white p-5 shadow-sm">

      <h3 className="text-lg font-bold text-gray-900">
        {title}
      </h3>

      {ideas && ideas.length > 0 ? (

        <ul className="mt-4 space-y-2">

          {ideas.map(
            (idea, index) => (

              <li
                key={index}
                className="flex gap-2 text-sm text-gray-700"
              >

                <span className="text-green-600">
                  •
                </span>

                <span>
                  {idea}
                </span>

              </li>

            )
          )}

        </ul>

      ) : (

        <p className="mt-3 text-sm text-gray-500">
          No ideas available.
        </p>

      )}

    </div>

  );
};


export default UploadPage;