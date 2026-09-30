import {
  ArrowRight,
  Leaf,
  Sparkles,
} from "lucide-react";

interface RecommendationCardProps {
  title: string;
  description: string;
  category: string;
  difficulty: string;
  impact: string;
  icon: string;
  onSelect: () => void;
}

function RecommendationCard({
  title,
  description,
  category,
  difficulty,
  impact,
  icon,
  onSelect,
}: RecommendationCardProps) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      {/* Icon Area */}
      <div className="flex h-40 items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">

        <div className="text-7xl transition duration-300 group-hover:scale-110">
          {icon}
        </div>

      </div>

      {/* Content */}
      <div className="p-6">

        <div className="flex items-center justify-between">

          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            {category}
          </span>

          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Sparkles className="h-3.5 w-3.5 text-green-500" />
            AI Suggestion
          </span>

        </div>

        <h3 className="mt-4 text-xl font-bold text-gray-900">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          {description}
        </p>

        {/* Details */}
        <div className="mt-5 grid grid-cols-2 gap-3">

          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-xs text-gray-400">
              Difficulty
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              {difficulty}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-xs text-gray-400">
              Impact
            </p>

            <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-green-600">
              <Leaf className="h-3.5 w-3.5" />
              {impact}
            </p>
          </div>

        </div>

        {/* Button */}
        <button
          type="button"
          onClick={onSelect}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
        >
          Explore This Idea

          <ArrowRight className="h-4 w-4" />
        </button>

      </div>

    </div>
  );
}

export default RecommendationCard;