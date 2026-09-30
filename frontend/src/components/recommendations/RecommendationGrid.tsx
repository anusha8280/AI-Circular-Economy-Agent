import RecommendationCard from "./RecommendationCard";

export interface Recommendation {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  impact: string;
  icon: string;
}

interface RecommendationGridProps {
  recommendations: Recommendation[];
  onSelect: (recommendation: Recommendation) => void;
}

function RecommendationGrid({
  recommendations,
  onSelect,
}: RecommendationGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

      {recommendations.map((recommendation) => (
        <RecommendationCard
          key={recommendation.id}
          title={recommendation.title}
          description={recommendation.description}
          category={recommendation.category}
          difficulty={recommendation.difficulty}
          impact={recommendation.impact}
          icon={recommendation.icon}
          onSelect={() => onSelect(recommendation)}
        />
      ))}

    </div>
  );
}

export default RecommendationGrid;