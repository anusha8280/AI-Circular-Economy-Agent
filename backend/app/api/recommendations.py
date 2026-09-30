from fastapi import APIRouter, HTTPException

from app.services.recommendation_service import (
    generate_recommendations,
)


router = APIRouter(
    prefix="/api/recommendations",
    tags=["Recommendations"],
)


@router.get("/test")
def recommendation_test():

    try:

        result = generate_recommendations(
            object_name="Clear plastic water bottle",
            material="Plastic (PET)",
            condition="Excellent",
            description=(
                "A clean empty transparent PET "
                "water bottle."
            ),
        )

        return {
            "status": "success",
            "recommendations": result,
        }

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error),
        )