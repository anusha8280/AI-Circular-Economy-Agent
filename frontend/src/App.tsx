import { BrowserRouter, Routes, Route } from "react-router-dom";

import UploadPage from "./pages/UploadPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import DesignStudio from "./components/design-studio/DesignStudio";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={<UploadPage />}
        />

        {/* Upload */}
        <Route
          path="/upload"
          element={<UploadPage />}
        />

        {/* Recommendations */}
        <Route
          path="/recommendations"
          element={<RecommendationsPage />}
        />

        {/* AI Design Studio */}
        <Route
          path="/design-studio"
          element={<DesignStudio />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;