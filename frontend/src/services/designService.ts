import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

export interface GenerateDesignRequest {
  file: File;
  object_name: string;
  material: string;
  idea: string;
  style?: string;
}

export interface GeneratedDesign {
  title: string;
  object_name: string;
  material: string;
  idea: string;
  style: string;
  image: string;
  ai_description: string;
}

export interface GenerateDesignResponse {
  status: string;
  message: string;
  design: GeneratedDesign;
}

export const generateDesign = async (
  request: GenerateDesignRequest
): Promise<GenerateDesignResponse> => {
  const formData = new FormData();

  formData.append("file", request.file);
  formData.append("object_name", request.object_name);
  formData.append("material", request.material);
  formData.append("idea", request.idea);

  if (request.style) {
    formData.append("style", request.style);
  }

  try {
    const response = await axios.post<GenerateDesignResponse>(
      `${API_BASE_URL}/api/design/generate`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const detail = error.response?.data?.detail;
      if (typeof detail === "string" && detail) {
        throw new Error(detail);
      }
    }

    throw error;
  }
};


// Alias for compatibility with existing components
export const generateAI_design = generateDesign;