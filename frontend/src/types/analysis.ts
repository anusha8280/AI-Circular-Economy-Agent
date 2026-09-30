// ============================================================
// WASTE ANALYSIS
// ============================================================

export interface AnalysisResult {
  id?: number | string;

  objectName: string;
  material: string;
  condition: string;
  confidence: number;

  description?: string;

  reuseIdeas?: string[];
  recycleIdeas?: string[];
  upcycleIdeas?: string[];
  homeDecorIdeas?: string[];

  recommendedAction?: string;
}


// ============================================================
// RECOMMENDATIONS
// ============================================================

export interface RecommendationResult {
  objectName: string;
  material: string;
  recommendations: string[];
}


// ============================================================
// ANALYSIS API RESPONSE
// ============================================================

export interface AnalysisResponse {
  status: string;
  message: string;
  analysis: AnalysisResult;
}


// ============================================================
// DESIGN REQUEST
// ============================================================

export interface GenerateDesignRequest {
  file: File;
  object_name: string;
  material: string;
  idea: string;
  style?: string;
}


// ============================================================
// GENERATED DESIGN
// ============================================================

export interface GeneratedDesign {
  title: string;
  object_name: string;
  material: string;
  idea: string;
  style: string;
  image: string;
  ai_description: string;
}


// ============================================================
// DESIGN API RESPONSE
// ============================================================

export interface GenerateDesignResponse {
  status: string;
  message: string;
  design: GeneratedDesign;
}