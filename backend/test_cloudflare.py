import os
import base64
import httpx
from dotenv import load_dotenv

load_dotenv()

ACCOUNT_ID = os.getenv("CLOUDFLARE_ACCOUNT_ID")
API_TOKEN = os.getenv("CLOUDFLARE_API_TOKEN")

if not ACCOUNT_ID:
    raise RuntimeError("CLOUDFLARE_ACCOUNT_ID is missing")

if not API_TOKEN:
    raise RuntimeError("CLOUDFLARE_API_TOKEN is missing")


url = (
    f"https://api.cloudflare.com/client/v4/accounts/"
    f"{ACCOUNT_ID}/ai/run/@cf/black-forest-labs/flux-1-schnell"
)


prompt = """
A realistic upcycled product made from a clear plastic water bottle,
transformed into a modern small plant holder, clean white background,
realistic product photography, useful student home project.
"""


headers = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json",
}


payload = {
    "prompt": prompt,
}


print("Testing Cloudflare Workers AI...")
print("Generating image...")


response = httpx.post(
    url,
    headers=headers,
    json=payload,
    timeout=120,
)


print("Status:", response.status_code)


if response.status_code != 200:
    print("Cloudflare error:")
    print(response.text)
    raise SystemExit(1)


result = response.json()


if not result.get("success"):
    print("Cloudflare returned an error:")
    print(result)
    raise SystemExit(1)


image_data = result["result"]["image"]

image_bytes = base64.b64decode(image_data)

output_file = "cloudflare_test.png"

with open(output_file, "wb") as f:
    f.write(image_bytes)


print()
print("SUCCESS!")
print(f"Image saved as: {output_file}")