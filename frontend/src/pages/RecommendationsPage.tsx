import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Recycle,
  RotateCcw,
  Sparkles,
  Wand2,
} from "lucide-react";

import type {
  AnalysisResult,
  RecommendationsResult,
} from "../services/analysisService";


// ============================================================
// ROUTER STATE
// ============================================================

interface RecommendationsLocationState {
  file?: File | null;
  analysis?: AnalysisResult | null;
  recommendations?: RecommendationsResult | null;
}


// ============================================================
// COMPONENT
// ============================================================

const RecommendationsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state =
    location.state as RecommendationsLocationState | null;

  const file = state?.file ?? null;

  const analysis =
    state?.analysis ?? null;

  const recommendations =
    state?.recommendations ?? null;


  // ============================================================
  // BACK
  // ============================================================

  const handleBack = () => {
    navigate("/upload");
  };


  // ============================================================
  // OPEN DESIGN STUDIO
  // ============================================================

  const handleOpenDesignStudio = (
    idea?: string
  ) => {

    if (!file) {
      alert(
        "Original image is missing. Please upload the image again."
      );

      navigate("/upload");

      return;
    }

    if (!analysis) {
      alert(
        "Analysis information is missing. Please analyze the image again."
      );

      navigate("/upload");

      return;
    }


    const selectedIdea =
      idea ||
      analysis.recommended_action ||
      "Create a useful upcycled product";


    navigate(
      "/design-studio",
      {
        state: {
          file: file,

          objectName:
            analysis.object_name ||
            "Unknown object",

          material:
            analysis.material ||
            "Unknown material",

          idea: selectedIdea,

          style: "modern",
        },
      }
    );
  };


  // ============================================================
  // NO DATA STATE
  // ============================================================

  if (!analysis) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-8">

        <div className="mx-auto max-w-3xl">

          <button
            type="button"
            onClick={() => navigate("/upload")}
            className="mb-6 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft size={18} />

            Back to Upload
          </button>


          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">

              <RotateCcw
                size={28}
                className="text-red-600"
              />

            </div>


            <h2 className="mt-5 text-xl font-bold text-red-800">
              No Analysis Found
            </h2>


            <p className="mt-2 text-sm text-red-700">
              Please upload and analyze a waste image
              before viewing recommendations.
            </p>


            <button
              type="button"
              onClick={() => navigate("/upload")}
              className="mt-6 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              Go to Upload
            </button>

          </div>

        </div>

      </div>
    );
  }


  // ============================================================
  // SAFE VALUES
  // ============================================================

  const reuseIdeas =
    analysis.reuse_ideas || [];

  const recycleIdeas =
    analysis.recycle_ideas || [];

  const upcycleIdeas =
    analysis.upcycle_ideas || [];

  const homeDecorIdeas =
    analysis.home_decor_ideas || [];


  const bestOption =
    recommendations?.best_option;


  const recommendationList =
    recommendations?.recommendations || [];


  // ============================================================
  // MAIN UI
  // ============================================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-5">

          <div className="flex items-center justify-between">

            <div>

              <div className="flex items-center gap-2">

                <Recycle
                  size={24}
                  className="text-green-600"
                />

                <h1 className="text-2xl font-bold text-slate-900">
                  CircularAI
                </h1>

              </div>

              <p className="mt-1 text-sm text-slate-500">
                AI Circular Economy Agent
              </p>

            </div>


            <button
              type="button"
              onClick={handleBack}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft size={18} />

              Back
            </button>

          </div>

        </div>

      </header>


      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">


        {/* ====================================================
            TITLE
        ==================================================== */}

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">

              <Sparkles
                size={25}
                className="text-green-600"
              />

            </div>


            <div>

              <h2 className="text-3xl font-bold text-slate-900">
                Circular Recommendations
              </h2>

              <p className="mt-1 text-slate-500">
                AI-generated ways to reuse, repair,
                upcycle, and recycle your waste item.
              </p>

            </div>

          </div>

        </div>


        {/* ====================================================
            ANALYSIS SUMMARY
        ==================================================== */}

        <div className="mb-8 grid gap-4 md:grid-cols-4">


          {/* OBJECT */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Detected Object
            </p>

            <p className="mt-2 text-lg font-bold text-slate-900">
              {analysis.object_name}
            </p>

          </div>


          {/* MATERIAL */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Material
            </p>

            <p className="mt-2 text-lg font-bold text-slate-900">
              {analysis.material}
            </p>

          </div>


          {/* CONDITION */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Condition
            </p>

            <p className="mt-2 text-lg font-bold text-slate-900">
              {analysis.condition}
            </p>

          </div>


          {/* CONFIDENCE */}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              AI Confidence
            </p>

            <p className="mt-2 text-lg font-bold text-green-600">
              {analysis.confidence}%
            </p>

          </div>

        </div>


        {/* ====================================================
            RECOMMENDED ACTION
        ==================================================== */}

        {analysis.recommended_action && (

          <div className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-6">

            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100">

                <CheckCircle2
                  size={24}
                  className="text-green-600"
                />

              </div>


              <div className="flex-1">

                <p className="text-sm font-semibold uppercase tracking-wide text-green-700">
                  Recommended Circular Action
                </p>

                <p className="mt-1 text-xl font-bold text-green-900">
                  {analysis.recommended_action}
                </p>

              </div>

            </div>

          </div>

        )}


        {/* ====================================================
            BEST OPTION
        ==================================================== */}

        {bestOption && (

          <section className="mb-10">

            <div className="mb-4 flex items-center gap-2">

              <Sparkles
                size={22}
                className="text-green-600"
              />

              <h2 className="text-2xl font-bold text-slate-900">
                Best Upcycling Option
              </h2>

            </div>


            <div className="overflow-hidden rounded-2xl border border-green-200 bg-white shadow-sm">

              <div className="bg-green-600 px-6 py-4">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm font-medium text-green-100">
                      AI Recommended
                    </p>

                    <h3 className="mt-1 text-2xl font-bold text-white">
                      {bestOption.title}
                    </h3>

                  </div>


                  <div className="rounded-full bg-white/20 px-4 py-2">

                    <span className="text-sm font-semibold text-white">
                      {bestOption.category}
                    </span>

                  </div>

                </div>

              </div>


              <div className="p-6">

                <p className="text-base leading-7 text-slate-600">
                  {bestOption.description}
                </p>


                {/* DETAILS */}

                <div className="mt-6 grid gap-4 sm:grid-cols-3">

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Difficulty
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {bestOption.difficulty}
                    </p>

                  </div>


                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Estimated Cost
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {bestOption.estimated_cost}
                    </p>

                  </div>


                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Environmental Benefit
                    </p>

                    <p className="mt-1 font-semibold text-slate-800">
                      {bestOption.environmental_benefit}
                    </p>

                  </div>

                </div>


                {/* MATERIALS */}

                {bestOption.required_materials &&
                  bestOption.required_materials.length > 0 && (

                    <div className="mt-6">

                      <h4 className="font-semibold text-slate-900">
                        Required Materials
                      </h4>

                      <div className="mt-3 flex flex-wrap gap-2">

                        {bestOption.required_materials.map(
                          (materialItem, index) => (

                            <span
                              key={index}
                              className="rounded-full bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700"
                            >
                              {materialItem}
                            </span>

                          )
                        )}

                      </div>

                    </div>

                  )}


                {/* STEPS */}

                {bestOption.steps &&
                  bestOption.steps.length > 0 && (

                    <div className="mt-6">

                      <h4 className="font-semibold text-slate-900">
                        Steps
                      </h4>

                      <ol className="mt-3 space-y-3">

                        {bestOption.steps.map(
                          (step, index) => (

                            <li
                              key={index}
                              className="flex items-start gap-3"
                            >

                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                                {index + 1}
                              </span>

                              <span className="pt-1 text-sm leading-6 text-slate-600">
                                {step}
                              </span>

                            </li>

                          )
                        )}

                      </ol>

                    </div>

                  )}


                {/* DESIGN BUTTON */}

                <button
                  type="button"
                  onClick={() =>
                    handleOpenDesignStudio(
                      bestOption.title
                    )
                  }
                  className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-green-600 px-6 py-4 font-semibold text-white shadow-lg transition hover:bg-green-700"
                >

                  <Sparkles size={21} />

                  Create AI Design for This Idea

                  <ArrowRight size={21} />

                </button>

              </div>

            </div>

          </section>

        )}


        {/* ====================================================
            CIRCULAR PRIORITY
        ==================================================== */}

        {recommendations?.circular_priority &&
          recommendations.circular_priority.length > 0 && (

            <section className="mb-10">

              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                Circular Economy Priority
              </h2>


              <div className="grid gap-3 sm:grid-cols-4">

                {recommendations.circular_priority.map(
                  (priority, index) => (

                    <div
                      key={index}
                      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                    >

                      <div className="flex items-center gap-3">

                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                          {index + 1}
                        </span>

                        <span className="font-semibold text-slate-800">
                          {priority}
                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>

            </section>

          )}


        {/* ====================================================
            IDEAS
        ==================================================== */}

        <section className="mb-10">

          <h2 className="mb-5 text-2xl font-bold text-slate-900">
            Available Ideas
          </h2>


          <div className="grid gap-5 md:grid-cols-2">


            {/* REUSE */}

            <IdeaCard
              title="Reuse Ideas"
              icon={
                <RotateCcw
                  size={21}
                  className="text-blue-600"
                />
              }
              iconBg="bg-blue-100"
              ideas={reuseIdeas}
            />


            {/* UPCYCLE */}

            <IdeaCard
              title="Upcycling Ideas"
              icon={
                <Lightbulb
                  size={21}
                  className="text-green-600"
                />
              }
              iconBg="bg-green-100"
              ideas={upcycleIdeas}
              onSelect={handleOpenDesignStudio}
            />


            {/* HOME DECOR */}

            <IdeaCard
              title="Home Decoration"
              icon={
                <Sparkles
                  size={21}
                  className="text-purple-600"
                />
              }
              iconBg="bg-purple-100"
              ideas={homeDecorIdeas}
              onSelect={handleOpenDesignStudio}
            />


            {/* RECYCLE */}

            <IdeaCard
              title="Recycling Ideas"
              icon={
                <Recycle
                  size={21}
                  className="text-orange-600"
                />
              }
              iconBg="bg-orange-100"
              ideas={recycleIdeas}
            />

          </div>

        </section>


        {/* ====================================================
            ALL RECOMMENDATIONS
        ==================================================== */}

        {recommendationList.length > 0 && (

          <section className="mb-10">

            <h2 className="mb-5 text-2xl font-bold text-slate-900">
              AI Recommendations
            </h2>


            <div className="grid gap-5 md:grid-cols-2">

              {recommendationList.map(
                (item, index) => (

                  <div
                    key={index}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <span className="text-xs font-semibold uppercase tracking-wide text-green-600">
                          {item.category}
                        </span>

                        <h3 className="mt-1 text-lg font-bold text-slate-900">
                          {item.title}
                        </h3>

                      </div>

                      <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                        {item.difficulty}
                      </span>

                    </div>


                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      {item.description}
                    </p>


                    <p className="mt-4 text-xs font-medium uppercase tracking-wide text-slate-400">
                      Environmental Benefit
                    </p>

                    <p className="mt-1 text-sm text-slate-700">
                      {item.environmental_benefit}
                    </p>


                    {(item.category.toLowerCase() ===
                      "upcycling" ||
                      item.category.toLowerCase() ===
                        "home decoration") && (

                      <button
                        type="button"
                        onClick={() =>
                          handleOpenDesignStudio(
                            item.title
                          )
                        }
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-green-600 px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50"
                      >

                        <Sparkles size={18} />

                        Create AI Design

                        <ArrowRight size={18} />

                      </button>

                    )}

                  </div>

                )
              )}

            </div>

          </section>

        )}


        {/* ====================================================
            BOTTOM DESIGN CTA
        ==================================================== */}

        <div className="rounded-2xl bg-slate-900 p-7 text-white">

          <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">

            <div>

              <div className="flex items-center gap-2">

                <Wand2
                  size={22}
                  className="text-green-400"
                />

                <h2 className="text-xl font-bold">
                  Turn Your Idea Into a Design
                </h2>

              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Use AI Design Studio to visualize how
                your waste item can become a useful
                upcycled product.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                handleOpenDesignStudio(
                  bestOption?.title ||
                    analysis.recommended_action
                )
              }
              className="flex shrink-0 items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-semibold text-white transition hover:bg-green-600"
            >

              Open Design Studio

              <ArrowRight size={19} />

            </button>

          </div>

        </div>

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
  icon: React.ReactNode;
  iconBg: string;
  onSelect?: (idea: string) => void;
}


const IdeaCard = ({
  title,
  ideas,
  icon,
  iconBg,
  onSelect,
}: IdeaCardProps) => {

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center gap-3">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}
        >
          {icon}
        </div>

        <h3 className="text-lg font-bold text-slate-900">
          {title}
        </h3>

      </div>


      {ideas && ideas.length > 0 ? (

        <div className="mt-4 space-y-3">

          {ideas.map(
            (idea, index) => (

              <div
                key={index}
                className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3"
              >

                <div className="flex items-start gap-2">

                  <span className="mt-1 text-green-600">
                    •
                  </span>

                  <span className="text-sm text-slate-700">
                    {idea}
                  </span>

                </div>


                {onSelect && (

                  <button
                    type="button"
                    onClick={() =>
                      onSelect(idea)
                    }
                    className="shrink-0 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-green-700"
                  >
                    Design
                  </button>

                )}

              </div>

            )
          )}

        </div>

      ) : (

        <p className="mt-4 text-sm text-slate-500">
          No ideas available.
        </p>

      )}

    </div>
  );
};


export default RecommendationsPage;