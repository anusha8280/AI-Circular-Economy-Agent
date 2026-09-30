from fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import shutil
import uuid

from app.services.vision_service import analyze_image
from app.services.recommendation_service import (
    generate_recommendations,
)

from app.models.database import SessionLocal
from app.models.analysis import Analysis


router = APIRouter(
    prefix="/api/analysis",
    tags=["Analysis"],
)


# ==========================================
# UPLOAD DIRECTORY
# ==========================================

UPLOAD_DIR = Path("uploads")

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True,
)


# ==========================================
# ALLOWED IMAGE TYPES
# ==========================================

ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}


# ==========================================
# UPLOAD + AI + RECOMMENDATIONS
# ==========================================

@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...)
):

    # --------------------------------------
    # CHECK FILE
    # --------------------------------------

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No file selected.",
        )


    # --------------------------------------
    # CHECK EXTENSION
    # --------------------------------------

    extension = Path(
        file.filename
    ).suffix.lower()


    if extension not in ALLOWED_EXTENSIONS:

        raise HTTPException(
            status_code=400,
            detail=(
                "Only JPG, JPEG, PNG and WEBP "
                "images are allowed."
            ),
        )


    # --------------------------------------
    # CREATE UNIQUE FILE NAME
    # --------------------------------------

    unique_filename = (
        f"{uuid.uuid4()}{extension}"
    )


    file_path = (
        UPLOAD_DIR / unique_filename
    )


    db = SessionLocal()


    try:

        # ==================================
        # SAVE IMAGE
        # ==================================

        with file_path.open("wb") as buffer:

            shutil.copyfileobj(
                file.file,
                buffer,
            )


        # ==================================
        # STEP 1
        # GEMINI IMAGE ANALYSIS
        # ==================================

        ai_result = analyze_image(
            str(file_path)
        )


        # ==================================
        # EXTRACT AI INFORMATION
        # ==================================

        object_name = ai_result.get(
            "object_name",
            "Unknown",
        )

        material = ai_result.get(
            "material",
            "Unknown",
        )

        condition = ai_result.get(
            "condition",
            "Unknown",
        )

        confidence = float(
            ai_result.get(
                "confidence",
                0,
            )
        )

        description = ai_result.get(
            "description",
            "",
        )


        # ==================================
        # STEP 2
        # GENERATE RECOMMENDATIONS
        # ==================================

        recommendations = (
            generate_recommendations(

                object_name=object_name,

                material=material,

                condition=condition,

                description=description,
            )
        )


        # ==================================
        # SAVE BASIC ANALYSIS TO DATABASE
        # ==================================

        analysis_record = Analysis(

            image_path=str(
                file_path
            ),

            object_name=object_name,

            material=material,

            condition=condition,

            confidence=confidence,

            status="completed",
        )


        db.add(
            analysis_record
        )

        db.commit()

        db.refresh(
            analysis_record
        )


        # ==================================
        # FINAL RESPONSE
        # ==================================

        return {

            "status": "success",

            "message": (
                "Image analyzed and "
                "recommendations generated."
            ),

            "analysis_id": (
                analysis_record.id
            ),

            "filename": unique_filename,

            "original_filename": (
                file.filename
            ),

            "file_path": str(
                file_path
            ),

            "analysis": ai_result,

            "recommendations": (
                recommendations
            ),
        }


    except Exception as error:

        # ----------------------------------
        # ROLLBACK DATABASE
        # ----------------------------------

        db.rollback()


        # ----------------------------------
        # DELETE IMAGE IF FAILED
        # ----------------------------------

        if file_path.exists():

            file_path.unlink()


        raise HTTPException(
            status_code=500,
            detail=str(error),
        )


    finally:

        db.close()

        await file.close()