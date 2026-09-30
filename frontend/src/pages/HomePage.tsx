import {
  ArrowRight,
  Recycle,
  Sparkles,
  Leaf,
  Upload,
  RefreshCw,
} from "lucide-react";

import { Link } from "react-router-dom";

import heroImage from "../assets/hero.png";

function HomePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ================= NAVBAR ================= */}

      <nav className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {/* Logo */}

          <div className="flex items-center gap-2">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
              <Recycle className="h-6 w-6 text-green-600" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-gray-900">
                CircularAI
              </h1>

              <p className="text-xs text-gray-500">
                Circular Economy Agent
              </p>
            </div>

          </div>


          {/* Navigation */}

          <div className="hidden items-center gap-8 md:flex">

            <a
              href="#"
              className="text-sm text-gray-600 hover:text-green-600"
            >
              Home
            </a>

            <a
              href="#how-it-works"
              className="text-sm text-gray-600 hover:text-green-600"
            >
              How It Works
            </a>

            <a
              href="#features"
              className="text-sm text-gray-600 hover:text-green-600"
            >
              Features
            </a>

          </div>


          {/* START ANALYSIS */}

          <Link
            to="/upload"
            className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Start Analysis
          </Link>

        </div>
      </nav>


      {/* ================= HERO ================= */}

      <section className="bg-gradient-to-b from-green-50 to-white">

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2">

          {/* LEFT SIDE */}

          <div>

            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">

              <Sparkles className="h-4 w-4" />

              AI-Powered Circular Economy

            </div>


            <h2 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">

              Turn Waste Into

              <span className="block text-green-600">
                Something Valuable.
              </span>

            </h2>


            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">

              Upload an unwanted product or material. Our AI identifies it,
              discovers circular opportunities, and helps transform waste
              into something useful.

            </p>


            {/* HERO BUTTONS */}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">

              {/* ANALYZE MY WASTE */}

              <Link
                to="/upload"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-semibold text-white transition hover:bg-green-700"
              >

                <Upload className="h-5 w-5" />

                Analyze My Waste

                <ArrowRight className="h-5 w-5" />

              </Link>


              {/* EXPLORE IDEAS */}

              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 font-semibold text-gray-700 transition hover:border-green-300 hover:text-green-600"
              >

                <Leaf className="h-5 w-5" />

                Explore Ideas

              </a>

            </div>


            {/* STATISTICS */}

            <div className="mt-10 grid max-w-md grid-cols-3 gap-6">

              <div>

                <p className="text-2xl font-bold text-gray-900">
                  AI
                </p>

                <p className="text-sm text-gray-500">
                  Detection
                </p>

              </div>


              <div>

                <p className="text-2xl font-bold text-gray-900">
                  5+
                </p>

                <p className="text-sm text-gray-500">
                  Circular Options
                </p>

              </div>


              <div>

                <p className="text-2xl font-bold text-gray-900">
                  ∞
                </p>

                <p className="text-sm text-gray-500">
                  Ideas
                </p>

              </div>

            </div>

          </div>


          {/* RIGHT SIDE IMAGE */}

          <div className="relative">

            <div className="overflow-hidden rounded-3xl border border-green-100 bg-green-50 shadow-xl">

              <img
                src={heroImage}
                alt="AI Circular Economy"
                className="h-[450px] w-full object-cover"
              />

            </div>


            {/* FLOATING CARD */}

            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-lg">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">

                  <Recycle className="h-5 w-5 text-green-600" />

                </div>


                <div>

                  <p className="text-sm font-semibold">
                    Circular Opportunity
                  </p>

                  <p className="text-xs text-gray-500">
                    AI is ready to analyze
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}

      <section
        id="how-it-works"
        className="px-6 py-20"
      >

        <div className="mx-auto max-w-7xl">

          <div className="mx-auto max-w-2xl text-center">

            <p className="font-semibold text-green-600">
              HOW IT WORKS
            </p>

            <h3 className="mt-3 text-3xl font-bold md:text-4xl">
              From Waste to Possibility
            </h3>

            <p className="mt-4 text-gray-600">

              Our AI agent analyzes your item and finds the best circular
              pathway for it.

            </p>

          </div>


          {/* STEPS */}

          <div className="mt-14 grid gap-6 md:grid-cols-4">

            {[
              {
                number: "01",
                title: "Upload",
                description:
                  "Take a photo or upload an image of your item.",
                icon: Upload,
              },

              {
                number: "02",
                title: "Analyze",
                description:
                  "AI identifies the object, material and condition.",
                icon: Sparkles,
              },

              {
                number: "03",
                title: "Discover",
                description:
                  "Get reuse, repair, recycle and upcycle options.",
                icon: Recycle,
              },

              {
                number: "04",
                title: "Transform",
                description:
                  "Generate a new product design from your waste.",
                icon: RefreshCw,
              },

            ].map((step) => {

              const Icon = step.icon;

              return (

                <div
                  key={step.number}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >

                  <div className="flex items-center justify-between">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100">

                      <Icon className="h-5 w-5 text-green-600" />

                    </div>


                    <span className="text-sm font-bold text-gray-300">
                      {step.number}
                    </span>

                  </div>


                  <h4 className="mt-6 text-xl font-bold">
                    {step.title}
                  </h4>


                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    {step.description}
                  </p>

                </div>

              );

            })}

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section
        id="features"
        className="bg-gray-50 px-6 py-20"
      >

        <div className="mx-auto max-w-7xl">

          <div className="max-w-2xl">

            <p className="font-semibold text-green-600">
              SMART CIRCULARITY
            </p>


            <h3 className="mt-3 text-3xl font-bold md:text-4xl">

              One Item. Multiple Possibilities.

            </h3>


            <p className="mt-4 leading-7 text-gray-600">

              Instead of simply telling you how to recycle an item,
              CircularAI explores what else that item could become.

            </p>

          </div>


          {/* CIRCULAR OPTIONS */}

          <div className="mt-12 grid gap-6 md:grid-cols-5">

            {[
              [
                "Reuse",
                "Extend the item's original life.",
              ],

              [
                "Repair",
                "Restore damaged products.",
              ],

              [
                "Recycle",
                "Recover valuable materials.",
              ],

              [
                "Upcycle",
                "Create a higher-value product.",
              ],

              [
                "Remanufacture",
                "Give components a new life.",
              ],

            ].map(([title, description]) => (

              <div
                key={title}
                className="rounded-2xl bg-white p-6 shadow-sm"
              >

                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">

                  <Recycle className="h-5 w-5 text-green-600" />

                </div>


                <h4 className="font-bold">
                  {title}
                </h4>


                <p className="mt-2 text-sm leading-6 text-gray-500">
                  {description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* ================= CTA ================= */}

      <section className="px-6 py-20">

        <div className="mx-auto max-w-5xl rounded-3xl bg-green-600 px-8 py-14 text-center text-white">

          <Leaf className="mx-auto h-10 w-10" />


          <h3 className="mt-5 text-3xl font-bold md:text-4xl">

            Have something you want to throw away?

          </h3>


          <p className="mx-auto mt-4 max-w-2xl leading-7 text-green-50">

            Let AI find a better future for it. Upload your item and
            discover what it could become.

          </p>


          {/* CTA BUTTON */}

          <Link
            to="/upload"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-green-700 transition hover:bg-green-50"
          >

            Start Your Analysis

            <ArrowRight className="h-5 w-5" />

          </Link>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="border-t border-gray-100 bg-white px-6 py-8">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 md:flex-row">

          <div>

            <p className="font-bold">
              ♻️ CircularAI
            </p>

            <p className="mt-1 text-sm text-gray-500">
              AI for a circular future.
            </p>

          </div>


          <p className="text-sm text-gray-400">
            AI Circular Economy Agent
          </p>

        </div>

      </footer>

    </div>
  );
}

export default HomePage;