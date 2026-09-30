import os
import base64
import json
import httpx
from dotenv import load_dotenv

load_dotenv()

ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")

if not ACCOUNT_ID:
    raise RuntimeError("CLOUDFLARE_ACCOUNT_ID is missing")

if not API_TOKEN:
    raise RuntimeError("CLOUDFLARE_API_TOKEN is missing")


# --------------------------------------------------
# CHANGE THIS TO YOUR IMAGE
# --------------------------------------------------

IMAGE_PATH = "uploads/test.png"

if not os.path.exists(IMAGE_PATH):
    raise RuntimeError(
        f"Image not found: {IMAGE_PATH}"
    )


# --------------------------------------------------
# READ IMAGE
# --------------------------------------------------

with open(IMAGE_PATH, "rb") as f:
    image_bytes = f.read()

image_base64 = base64.b64encode(
    image_bytes
).decode("utf-8")


# --------------------------------------------------
# CLOUDFLARE VISION
# --------------------------------------------------

model = "@cf/meta/llama-3.2-11b-vision-instruct"

url = (
    f"https://api.cloudflare.com/client/v4/"
    f"accounts/{ACCOUNT_ID}/ai/run/{model}"
)


# --------------------------------------------------
# PROMPT
# --------------------------------------------------

prompt = """
Analyze this image carefully.

Identify the visible waste object.

Return ONLY valid JSON.

Use exactly this structure:

{
  "object_name": "name of object",
  "material": "main material",
  "condition": "Good",
  "confidence": 95,
  "description": "short description",
  "upcycle_ideas": [
    "idea 1",
    "idea 2",
    "idea 3"
  ],
  "recommended_action": "best upcycling idea"
}

Rules:

- Identify the actual object visible in the image.
- Do not return generic values like "string".
- confidence must be between 0 and 100.
- condition must be Poor, Fair, Good, or Excellent.
- Give practical upcycling ideas.
- Return JSON only.
"""


# --------------------------------------------------
# REQUEST
# --------------------------------------------------

headers = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json",
}


payload = {
    "prompt": prompt,
    "image": image_base64,
}


print()
print("====================================")
print("Cloudflare Vision AI Test")
print("====================================")
print("Model:", model)
print("Image:", IMAGE_PATH)
print()


try:

    response = httpx.post(
        url,
        headers=headers,
        json=payload,
        timeout=120,
    )

except Exception as error:

    print("Connection error:")
    print(error)
    raise SystemExit(1)


print("Status:", response.status_code)
print()


# --------------------------------------------------
# ERROR
# --------------------------------------------------

if response.status_code != 200:

    print("Cloudflare error:")
    print(response.text)

    raise SystemExit(1)


# --------------------------------------------------
# RESPONSE
# --------------------------------------------------

result = response.json()

print("Cloudflare response:")
print(
    json.dumps(
        result,
        indent=2
    )
)

print()


if not result.get("success"):

    print("Cloudflare request failed.")
    raise SystemExit(1)


# --------------------------------------------------
# EXTRACT RESPONSE
# --------------------------------------------------

result_data = result.get(
    "result",
    {}
)

model_output = (
    result_data.get("response")
    or result_data.get("text")
    or ""
)


print("AI Response:")
print(model_output)
print()


# --------------------------------------------------
# PARSE JSON
# --------------------------------------------------

try:

    cleaned = (
        model_output
        .replace("```json", "")
        .replace("```", "")
        .strip()
    )

    analysis = json.loads(
        cleaned
    )

except Exception:

    print(
        "The model response was not valid JSON."
    )

    raise SystemExit(1)


# --------------------------------------------------
# DISPLAY
# --------------------------------------------------

print("====================================")
print("VISION ANALYSIS SUCCESS")
print("====================================")

print(
    "Object:",
    analysis.get("object_name")
)

print(
    "Material:",
    analysis.get("material")
)

print(
    "Condition:",
    analysis.get("condition")
)

print(
    "Confidence:",
    analysis.get("confidence")
)

print()

print("Upcycling Ideas:")

for idea in analysis.get(
    "upcycle_ideas",
    []
):

    print("-", idea)

print()

print(
    "Recommended:",
    analysis.get(
        "recommended_action"
    )
)

print()
print("TEST COMPLETED SUCCESSFULLY!")