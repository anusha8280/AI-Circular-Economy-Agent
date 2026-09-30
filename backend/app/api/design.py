from fastapi import APIRouter, UploadFile, File, Form, HTTPException

from app.services.design_service import generate_design as generate_ai_design

router = APIRouter(
    prefix="/api/design",
    tags=["Design"]
)


@router.post("/generate")
async def generate_design(
    file: UploadFile = File(...),
    object_name: str = Form(...),
    material: str = Form(...),
    idea: str = Form(...),
    style: str = Form("modern"),
):
    try:
        # -------------------------------------------------------
        # Validate image
        # -------------------------------------------------------

        if not file.content_type:
            raise HTTPException(
                status_code=400,
                detail="Invalid file type."
            )

        if not file.content_type.startswith("image/"):
            raise HTTPException(
                status_code=400,
                detail="Please upload an image file."
            )

        # -------------------------------------------------------
        # Read uploaded image
        # -------------------------------------------------------

        image_bytes = await file.read()

        if not image_bytes:
            raise HTTPException(
                status_code=400,
                detail="Uploaded image is empty."
            )

        design = generate_ai_design(
            image_bytes=image_bytes,
            image_mime_type=file.content_type,
            object_name=object_name,
            material=material,
            idea=idea,
            style=style,
        )

        return {
            "status": "success",
            "message": "Design generated successfully.",
            "design": design,
        }

    except HTTPException:
        raise

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    except RuntimeError as e:
        raise HTTPException(
            status_code=502,
            detail=str(e),
        )

    except Exception as e:
        print("Design generation error:", e)

        raise HTTPException(
            status_code=500,
            detail=f"Design generation failed: {str(e)}"
        )