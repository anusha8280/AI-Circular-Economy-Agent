from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.analysis import router as analysis_router
from app.api.design import router as design_router


# ============================================================
# CREATE FASTAPI APP
# ============================================================

app = FastAPI(
    title="AI Circular Economy Agent",
    description=(
        "AI-powered waste analysis, circular economy "
        "recommendations and AI design generation."
    ),
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],

    allow_credentials=True,

    allow_methods=[
        "*"
    ],

    allow_headers=[
        "*"
    ],
)


# ============================================================
# REGISTER API ROUTES
# ============================================================

# Waste image analysis
app.include_router(
    analysis_router
)

# AI design generation
app.include_router(
    design_router
)


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "status": "success",
        "message": "AI Circular Economy Agent API is running.",
        "docs": "/docs",
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():

    return {
        "status": "healthy",
        "service": "AI Circular Economy Agent",
    }