import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export interface AnalysisResult {
  object_name: string;
  material: string;
  condition: string;
  confidence: number;
  description: string;

  reuse_ideas: string[];
  recycle_ideas: string[];
  upcycle_ideas: string[];
  home_decor_ideas: string[];

  repair_possible: boolean;
  recommended_action: string;
}

export interface RecommendationItem {
  title: string;
  category: string;
  description: string;
  difficulty: string;
  estimated_cost: string;
  environmental_benefit: string;
  required_materials: string[];
  steps: string[];
}

export interface RecommendationsResult {
  best_option: RecommendationItem;
  recommendations: RecommendationItem[];
  circular_priority: string[];
}

export interface AnalysisResponse {
  status: string;
  message: string;
  analysis_id: number;
  filename: string;
  original_filename: string;
  file_path: string;

  analysis: AnalysisResult;

  recommendations: RecommendationsResult;
}

export const analyzeWasteImage = async (
  file: File
): Promise<AnalysisResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await axios.post<AnalysisResponse>(
    `${API_BASE_URL}/api/analysis/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};