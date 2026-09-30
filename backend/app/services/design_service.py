import base64
import hashlib
import os
from pathlib import Path

import httpx
from dotenv import load_dotenv


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

ENV_FILE = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(ENV_FILE)

CLOUDFLARE_ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
CLOUDFLARE_API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")
MODEL_NAME = "@cf/black-forest-labs/flux-2-klein-9b"


# ============================================================
# GENERATE AI DESIGN
# ============================================================

def generate_design(
    image_bytes: bytes,
    image_mime_type: str,
    object_name: str,
    material: str,
    idea: str,
    style: str = "modern",
) -> dict:

    # ========================================================
    # VALIDATE INPUT
    # ========================================================

    if not image_bytes:
        raise ValueError("Uploaded image is required.")

    if not image_mime_type.startswith("image/"):
        raise ValueError("Uploaded file must be an image.")

    if not object_name:
        raise ValueError(
            "Object name is required."
        )

    if not material:
        raise ValueError(
            "Material is required."
        )

    if not idea:
        raise ValueError(
            "Design idea is required."
        )

    # ========================================================
    # LOAD CLOUD FLARE ENVIRONMENT VARIABLES
    # ========================================================

    if not CLOUDFLARE_ACCOUNT_ID or not CLOUDFLARE_API_TOKEN:
        raise RuntimeError(
            "CLOUDFLARE_ACCOUNT_ID or CLOUDFLARE_API_TOKEN is missing in backend/.env"
        )

    prompt = f"""
Create a realistic product visualization of an upcycled {object_name} made from
{material}, transformed into {idea}. The uploaded image is the source waste
item and reference material, but the final image must show the completed
transformed product after upcycling, not the original unmodified object and not
a before-and-after composition.

Apply a {style} design aesthetic. Show the finished product clearly in a clean
realistic environment with natural lighting, realistic materials, accurate
proportions, and visible functional details. The result should look like a
newly designed usable product created through circular-economy upcycling.
Do not show people, hands, text, logos, or watermarks.
""".strip()

    url = (
        "https://api.cloudflare.com/client/v4/accounts/"
        f"{CLOUDFLARE_ACCOUNT_ID}/ai/run/{MODEL_NAME}"
    )
    headers = {
        "Authorization": f"Bearer {CLOUDFLARE_API_TOKEN}",
    }

    try:
        response = httpx.post(
            url,
            headers=headers,
            data={"prompt": prompt},
            files={
                "image": (
                    "source-image",
                    image_bytes,
                    image_mime_type,
                )
            },
            timeout=120,
        )
    except httpx.RequestError as error:
        raise RuntimeError(
            f"Cloudflare connection failed: {error}"
        ) from error

    if response.status_code != 200:
        raise RuntimeError(
            f"Cloudflare image generation failed ({response.status_code}): "
            f"{response.text}"
        )

    content_type = response.headers.get("content-type", "").split(";", 1)[0].lower()
    generated_bytes = None

    if content_type.startswith("image/"):
        generated_bytes = response.content
    else:
        try:
            cloudflare_data = response.json()
        except ValueError as error:
            raise RuntimeError(
                "Cloudflare returned an invalid image response."
            ) from error

        if cloudflare_data.get("success") is False:
            raise RuntimeError(
                f"Cloudflare image generation failed: {cloudflare_data.get('errors')}"
            )

        result = cloudflare_data.get("result")
        image_base64 = result.get("image") if isinstance(result, dict) else result

        if isinstance(image_base64, str):
            if image_base64.startswith("data:image"):
                image_base64 = image_base64.split(",", 1)[1]
            try:
                generated_bytes = base64.b64decode(image_base64, validate=True)
            except (ValueError, TypeError) as error:
                raise RuntimeError(
                    "Cloudflare returned invalid generated image data."
                ) from error

    if not generated_bytes:
        raise RuntimeError("Cloudflare returned no generated image.")

    if hashlib.sha256(generated_bytes).digest() == hashlib.sha256(image_bytes).digest():
        raise RuntimeError(
            "Cloudflare returned the original uploaded image instead of a new design."
        )

    generated_mime_type = _detect_image_mime_type(generated_bytes)
    if not generated_mime_type:
        raise RuntimeError("Cloudflare returned invalid generated image bytes.")

    image_data_url = (
        f"data:{generated_mime_type};base64,"
        f"{base64.b64encode(generated_bytes).decode('utf-8')}"
    )

    return {
        "title": f"AI Generated {idea}",
        "object_name": object_name,
        "material": material,
        "idea": idea,
        "style": style,
        "image": image_data_url,
        "ai_description": (
            f"A {style} {idea} created by transforming a {material} "
            f"{object_name} with Cloudflare image-to-image generation."
        ),
    }


def _detect_image_mime_type(image_bytes: bytes) -> str | None:
    if image_bytes.startswith(b"\x89PNG\r\n\x1a\n"):
        return "image/png"
    if image_bytes.startswith(b"\xff\xd8\xff"):
        return "image/jpeg"
    if image_bytes.startswith((b"GIF87a", b"GIF89a")):
        return "image/gif"
    if image_bytes.startswith(b"RIFF") and image_bytes[8:12] == b"WEBP":
        return "image/webp"
    return None