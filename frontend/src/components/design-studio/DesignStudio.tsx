import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  generateDesign,
  type GeneratedDesign,
} from "../../services/designService";

interface LocationState {
  file?: File;
  objectName?: string;
  material?: string;
  idea?: string;
  style?: string;
}

function DesignStudio() {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | null;

  const file = state?.file ?? null;

  const objectName =
    state?.objectName || "Unknown object";

  const material =
    state?.material || "Unknown material";

  const idea =
    state?.idea || "Create a useful upcycled product";

  const initialStyle =
    state?.style || "modern";

  const [selectedStyle, setSelectedStyle] =
    useState(initialStyle);

  const [design, setDesign] =
    useState<GeneratedDesign | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [preview, setPreview] =
    useState<string | null>(null);


  // =========================================================
  // CREATE IMAGE PREVIEW SAFELY
  // =========================================================

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);

    setPreview(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);


  // =========================================================
  // STYLE OPTIONS
  // =========================================================

  const styles = [
    {
      value: "modern",
      label: "Modern",
      description: "Clean and contemporary",
    },
    {
      value: "minimal",
      label: "Minimal",
      description: "Simple and elegant",
    },
    {
      value: "eco-friendly",
      label: "Eco Friendly",
      description: "Natural and sustainable",
    },
    {
      value: "creative",
      label: "Creative",
      description: "Unique and artistic",
    },
  ];


  // =========================================================
  // GENERATE DESIGN
  // =========================================================

  const handleGenerateDesign = async () => {
    if (!file) {
      setError(
        "Original image is missing. Please go back and upload the image again."
      );
      return;
    }

    setLoading(true);
    setError("");
    setDesign(null);

    try {
      const response = await generateDesign({
        file,
        object_name: objectName,
        material,
        idea,
        style: selectedStyle,
      });

      if (
        response.status !== "success" ||
        !response.design
      ) {
        throw new Error(
          response.message ||
            "Design generation failed."
        );
      }

      setDesign(response.design);

    } catch (err) {
      console.error(
        "Design generation error:",
        err
      );

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Unable to generate the design. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // BACK
  // =========================================================

  const handleBack = () => {
    navigate(-1);
  };


  // =========================================================
  // DOWNLOAD
  // =========================================================

  const handleDownload = () => {
    if (!design?.image) {
      return;
    }

    const link = document.createElement("a");

    link.href = design.image;
    link.download = "ai-upcycled-design.png";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };


  // =========================================================
  // NO FILE
  // =========================================================

  if (!file) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8">

        <div className="mx-auto max-w-3xl">

          <button
            type="button"
            onClick={() => navigate("/upload")}
            className="mb-6 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <ArrowLeft size={18} />
            Back to Upload
          </button>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

            <h2 className="text-xl font-bold text-red-800">
              Image Not Found
            </h2>

            <p className="mt-2 text-sm text-red-700">
              Please upload and analyze an image before
              opening the Design Studio.
            </p>

            <button
              type="button"
              onClick={() => navigate("/upload")}
              className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
            >
              Go to Upload
            </button>

          </div>

        </div>

      </div>
    );
  }


  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">

      <div className="mx-auto max-w-6xl">

        {/* HEADER */}

        <div className="mb-8 flex items-center gap-4">

          <button
            type="button"
            onClick={handleBack}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-100"
          >
            <ArrowLeft size={20} />
          </button>

          <div>

            <div className="flex items-center gap-2">

              <Sparkles
                size={22}
                className="text-emerald-600"
              />

              <h1 className="text-2xl font-bold text-slate-900">
                AI Design Studio
              </h1>

            </div>

            <p className="mt-1 text-sm text-slate-500">
              Transform your waste item into a useful
              upcycled product.
            </p>

          </div>

        </div>


        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">

            <strong>
              Design generation failed:
            </strong>

            <p className="mt-1">
              {error}
            </p>

          </div>
        )}


        {/* MAIN GRID */}

        <div className="grid gap-6 lg:grid-cols-2">


          {/* =================================================
              LEFT
          ================================================= */}

          <div className="space-y-6">


            {/* ORIGINAL IMAGE */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Original Waste Item
              </h2>

              <div className="overflow-hidden rounded-xl bg-slate-100">

                {preview ? (
                  <img
                    src={preview}
                    alt="Original waste item"
                    className="h-72 w-full object-contain"
                  />
                ) : (
                  <div className="flex h-72 items-center justify-center text-sm text-slate-400">
                    Image preview unavailable
                  </div>
                )}

              </div>

            </div>


            {/* DESIGN DETAILS */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Design Details
              </h2>

              <div className="space-y-4">

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Object
                  </p>

                  <p className="mt-1 font-medium text-slate-800">
                    {objectName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Material
                  </p>

                  <p className="mt-1 font-medium text-slate-800">
                    {material}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                    Upcycling Idea
                  </p>

                  <p className="mt-1 font-medium text-slate-800">
                    {idea}
                  </p>
                </div>

              </div>

            </div>


            {/* STYLE */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <h2 className="mb-4 text-lg font-semibold text-slate-900">
                Choose Design Style
              </h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                {styles.map((item) => {

                  const selected =
                    selectedStyle === item.value;

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() =>
                        setSelectedStyle(
                          item.value
                        )
                      }
                      className={`rounded-xl border p-4 text-left transition ${
                        selected
                          ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
                          : "border-slate-200 bg-white hover:border-emerald-300"
                      }`}
                    >

                      <div className="flex items-start justify-between">

                        <div>

                          <p className="font-semibold text-slate-900">
                            {item.label}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {item.description}
                          </p>

                        </div>

                        {selected && (
                          <CheckCircle2
                            size={20}
                            className="text-emerald-600"
                          />
                        )}

                      </div>

                    </button>
                  );
                })}

              </div>

            </div>


            {/* GENERATE */}

            <button
              type="button"
              onClick={handleGenerateDesign}
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-600 px-6 py-4 font-semibold text-white shadow-lg hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <>
                  <Loader2
                    size={22}
                    className="animate-spin"
                  />

                  Generating AI Design...
                </>
              ) : (
                <>
                  <Wand2 size={22} />

                  Generate AI Design
                </>
              )}

            </button>

          </div>


          {/* =================================================
              RIGHT
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-5 flex items-center justify-between">

              <div>

                <h2 className="text-lg font-semibold text-slate-900">
                  Generated Design
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your AI-powered upcycled product concept.
                </p>

              </div>

              {design && (
                <CheckCircle2
                  size={24}
                  className="text-emerald-600"
                />
              )}

            </div>


            {/* EMPTY */}

            {!design && !loading && (
              <div className="flex min-h-[550px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-8 text-center">

                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">

                  <Sparkles
                    size={30}
                    className="text-emerald-600"
                  />

                </div>

                <h3 className="text-lg font-semibold text-slate-800">
                  No design generated yet
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  Choose your preferred style and click
                  Generate AI Design to create an
                  upcycled product concept.
                </p>

              </div>
            )}


            {/* LOADING */}

            {loading && (
              <div className="flex min-h-[550px] flex-col items-center justify-center rounded-xl bg-slate-50">

                <Loader2
                  size={48}
                  className="animate-spin text-emerald-600"
                />

                <h3 className="mt-5 text-lg font-semibold text-slate-800">
                  Creating your design...
                </h3>

                <p className="mt-2 max-w-sm text-center text-sm text-slate-500">
                  AI is transforming your waste material
                  into a new product concept.
                </p>

              </div>
            )}


            {/* RESULT */}

            {design && !loading && (
              <div className="space-y-5">

                <div className="overflow-hidden rounded-xl bg-slate-100">

                  <img
                    src={design.image}
                    alt={
                      design.title ||
                      "Generated upcycled design"
                    }
                    className="max-h-[550px] w-full object-contain"
                  />

                </div>

                <div>

                  <h3 className="text-xl font-bold text-slate-900">
                    {design.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {design.ai_description}
                  </p>

                </div>


                <div className="grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-xs text-slate-400">
                      Object
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {design.object_name}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-xs text-slate-400">
                      Material
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {design.material}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-xs text-slate-400">
                      Idea
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {design.idea}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-xs text-slate-400">
                      Style
                    </p>

                    <p className="mt-1 text-sm font-semibold capitalize text-slate-800">
                      {design.style}
                    </p>

                  </div>

                </div>


                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full rounded-xl border border-emerald-600 px-5 py-3 font-semibold text-emerald-700 hover:bg-emerald-50"
                >
                  Download Generated Design
                </button>

              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default DesignStudio;