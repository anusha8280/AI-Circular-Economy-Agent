import axios from "axios";

// ==========================================
// BACKEND URL
// ==========================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

// ==========================================
// AXIOS INSTANCE
// ==========================================

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

// ==========================================
// TYPES
// ==========================================

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

export interface Recommendation {
  title: string;
  category: string;
  description: string;
  difficulty: string;
  estimated_cost: string;
  environmental_benefit: string;
  required_materials: string[];
  steps: string[];
}

export interface RecommendationResult {
  best_option: Recommendation;
  recommendations: Recommendation[];
  circular_priority: string[];
}

export interface UploadResponse {
  status: string;
  message: string;

  analysis_id: number;

  filename: string;
  original_filename: string;
  file_path: string;

  analysis: AnalysisResult;

  recommendations: RecommendationResult;
}

// ==========================================
// UPLOAD IMAGE
// ==========================================

export const uploadImage = async (
  file: File
): Promise<UploadResponse> => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post<UploadResponse>(
    "/api/analysis/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// ==========================================
// HEALTH CHECK
// ==========================================

export const checkBackendHealth = async () => {
  const response = await api.get("/api/health");

  return response.data;
};

export default api;