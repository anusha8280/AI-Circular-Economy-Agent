import {
  ArrowRight,
  Palette,
  Sparkles,
} from "lucide-react";

interface DesignStudioCardProps {
  itemName: string;
  selectedIdea: string;
  onGenerate: () => void;
}

function DesignStudioCard({
  itemName,
  selectedIdea,
  onGenerate,
}: DesignStudioCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl">

      <div className="grid items-center gap-8 p-8 md:grid-cols-2">

        {/* Left */}
        <div>

          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            AI Design Studio
          </div>

          <h3 className="mt-5 text-2xl font-bold">
            Transform your {itemName}
          </h3>

          <p className="mt-3 leading-7 text-gray-300">
            Generate a visual concept showing how your waste item
            can become a useful and attractive product.
          </p>

          <div className="mt-5 rounded-2xl bg-white/10 p-4">

            <p className="text-xs text-gray-400">
              Selected idea
            </p>

            <p className="mt-1 font-semibold">
              {selectedIdea}
            </p>

          </div>

          <button
            type="button"
            onClick={onGenerate}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-semibold text-white transition hover:bg-green-600"
          >
            <Palette className="h-5 w-5" />

            Generate Design

            <ArrowRight className="h-5 w-5" />
          </button>

        </div>

        {/* Right Preview */}
        <div className="flex min-h-[280px] items-center justify-center rounded-3xl border border-white/10 bg-white/5">

          <div className="text-center">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 text-5xl">
              ♻️
            </div>

            <p className="mt-5 font-semibold">
              Your AI-generated design
            </p>

            <p className="mt-2 text-sm text-gray-400">
              Design preview will appear here
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default DesignStudioCard;