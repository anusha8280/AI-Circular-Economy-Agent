import os
import json
import base64
import httpx

from pathlib import Path
from dotenv import load_dotenv


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()

CLOUDFLARE_ACCOUNT_ID = os.getenv(
    "CLOUDFLARE_ACCOUNT_ID"
)

CLOUDFLARE_API_TOKEN = os.getenv(
    "CLOUDFLARE_API_TOKEN"
)


if not CLOUDFLARE_ACCOUNT_ID:
    raise RuntimeError(
        "CLOUDFLARE_ACCOUNT_ID is missing in backend/.env"
    )


if not CLOUDFLARE_API_TOKEN:
    raise RuntimeError(
        "CLOUDFLARE_API_TOKEN is missing in backend/.env"
    )


# ============================================================
# CLOUDFLARE VISION MODEL
# ============================================================

MODEL_NAME = "@cf/meta/llama-3.2-11b-vision-instruct"


# ============================================================
# CLOUDFLARE URL
# ============================================================

CLOUDFLARE_URL = (
    "https://api.cloudflare.com/client/v4/accounts/"
    f"{CLOUDFLARE_ACCOUNT_ID}"
    f"/ai/run/{MODEL_NAME}"
)


# ============================================================
# ANALYZE IMAGE
# ============================================================

def analyze_image(image_path: str) -> dict:

    path = Path(image_path)

    if not path.exists():
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )


    # ========================================================
    # READ IMAGE
    # ========================================================

    image_bytes = path.read_bytes()

    image_base64 = base64.b64encode(
        image_bytes
    ).decode("utf-8")


    # ========================================================
    # MIME TYPE
    # ========================================================

    extension = path.suffix.lower()

    mime_types = {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
    }

    mime_type = mime_types.get(
        extension,
        "image/jpeg"
    )


    # ========================================================
    # PROMPT
    # ========================================================

    prompt = """
You are CircularAI, an AI Circular Economy Agent.

Analyze the uploaded image carefully.

Identify:

1. Object name
2. Main material
3. Current condition
4. AI confidence from 0 to 100
5. Short description
6. Reuse opportunities
7. Recycling opportunities
8. Upcycling opportunities
9. Home decoration possibilities
10. Whether repair is possible
11. Best circular economy action

IMPORTANT:

Return ONLY a JSON object.

Do NOT use markdown.
Do NOT use ```json.
Do NOT write explanations before or after JSON.

Use exactly this structure:

{
    "object_name": "Plastic Bottle",
    "material": "PET Plastic",
    "condition": "Good",
    "confidence": 95,
    "description": "Short description of the object",

    "reuse_ideas": [
        "Storage container",
        "Plant holder",
        "Desk organizer"
    ],

    "recycle_ideas": [
        "PET recycling",
        "Plastic recycling"
    ],

    "upcycle_ideas": [
        "Plant pot",
        "Bird feeder",
        "Desk organizer"
    ],

    "home_decor_ideas": [
        "Vase",
        "Centerpiece",
        "Decorative item"
    ],

    "repair_possible": false,

    "recommended_action": "Upcycle into a useful product."
}

Rules:

- confidence must be a number between 0 and 100.
- Identify the actual object visible in the image.
- Do not always call everything a plastic bottle.
- Material must match the detected object.
- Condition must describe visible condition.
- Recommendations must be specific to the detected object.
- Prioritize reuse and upcycling where practical.
- Do not invent details that cannot be seen.
"""


    # ========================================================
    # PAYLOAD
    # ========================================================

    payload = {
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are CircularAI. "
                    "Analyze images and return ONLY valid JSON."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        "image": image_base64,
    }


    # ========================================================
    # HEADERS
    # ========================================================

    headers = {
        "Authorization": (
            f"Bearer {CLOUDFLARE_API_TOKEN}"
        ),
        "Content-Type": "application/json",
    }


    # ========================================================
    # DEBUG INFORMATION
    # ========================================================

    print()
    print("=" * 60)
    print("Cloudflare Vision AI")
    print("=" * 60)

    print(
        f"Image: {path.name}"
    )

    print(
        f"Type: {mime_type}"
    )

    print(
        f"Model: {MODEL_NAME}"
    )

    print(
        "Sending image to Cloudflare..."
    )


    # ========================================================
    # API REQUEST
    # ========================================================

    try:

        response = httpx.post(
            CLOUDFLARE_URL,
            headers=headers,
            json=payload,
            timeout=120,
        )

    except httpx.RequestError as error:

        raise RuntimeError(
            f"Cloudflare Vision connection failed: {error}"
        ) from error


    print(
        "Cloudflare status:",
        response.status_code,
    )


    # ========================================================
    # HTTP ERROR
    # ========================================================

    if response.status_code != 200:

        print()
        print("Cloudflare error:")
        print(response.text)

        raise RuntimeError(
            "Cloudflare Vision API failed."
        )


    # ========================================================
    # PARSE CLOUDFLARE RESPONSE
    # ========================================================

    try:

        cloudflare_data = response.json()

    except json.JSONDecodeError as error:

        print()
        print("Invalid Cloudflare JSON:")
        print(response.text)

        raise RuntimeError(
            "Cloudflare returned invalid JSON."
        ) from error


    # ========================================================
    # PRINT COMPLETE RESPONSE
    # ========================================================

    print()
    print("Complete Cloudflare response:")

    print(
        json.dumps(
            cloudflare_data,
            indent=2
        )
    )


    # ========================================================
    # CHECK SUCCESS
    # ========================================================

    if not cloudflare_data.get(
        "success",
        False
    ):

        raise RuntimeError(
            "Cloudflare returned unsuccessful response: "
            f"{cloudflare_data}"
        )


    # ========================================================
    # GET RESULT
    # ========================================================

    result = cloudflare_data.get(
        "result",
        {}
    )


    if not isinstance(
        result,
        dict
    ):

        raise RuntimeError(
            "Cloudflare result has unexpected format."
        )


    print()
    print("Cloudflare result:")
    print(
        json.dumps(
            result,
            indent=2
        )
    )


    # ========================================================
    # IMPORTANT FIX
    #
    # Cloudflare response is:
    #
    # result
    #   └── response
    #        ├── object_name
    #        ├── material
    #        └── ...
    #
    # Therefore response_value can already be a dictionary.
    # ========================================================

    response_value = result.get(
        "response"
    )


    # ========================================================
    # CASE 1
    # RESPONSE IS DICTIONARY
    # ========================================================

    if isinstance(
        response_value,
        dict
    ):

        print()
        print(
            "Cloudflare returned structured Vision JSON."
        )

        analysis = response_value


    # ========================================================
    # CASE 2
    # RESPONSE IS STRING
    # ========================================================

    elif isinstance(
        response_value,
        str
    ):

        response_text = response_value.strip()

        if not response_text:

            raise RuntimeError(
                "Cloudflare returned empty Vision response."
            )

        print()
        print(
            "Cloudflare returned text response."
        )

        analysis = parse_json_response(
            response_text
        )


    # ========================================================
    # CASE 3
    # RESULT ITSELF CONTAINS ANALYSIS
    # ========================================================

    elif (
        "object_name" in result
        or "material" in result
        or "reuse_ideas" in result
    ):

        print()
        print(
            "Using Cloudflare result directly."
        )

        analysis = result


    # ========================================================
    # INVALID RESPONSE
    # ========================================================

    else:

        print()
        print(
            "WARNING: Cloudflare Vision response "
            "format is unknown."
        )

        print(
            json.dumps(
                result,
                indent=2
            )
        )

        raise RuntimeError(
            "Cloudflare returned empty Vision response."
        )


    # ========================================================
    # NORMALIZE ANALYSIS
    # ========================================================

    analysis = normalize_analysis(
        analysis
    )


    # ========================================================
    # FINAL DEBUG
    # ========================================================

    print()
    print("=" * 60)
    print("FINAL VISION ANALYSIS")
    print("=" * 60)

    print(
        json.dumps(
            analysis,
            indent=2
        )
    )

    print("=" * 60)


    return analysis


# ============================================================
# PARSE JSON RESPONSE
# ============================================================

def parse_json_response(
    response_text: str
) -> dict:

    if not isinstance(
        response_text,
        str
    ):

        response_text = json.dumps(
            response_text
        )


    cleaned = response_text.strip()


    # --------------------------------------------------------
    # Remove markdown
    # --------------------------------------------------------

    cleaned = cleaned.replace(
        "```json",
        ""
    )

    cleaned = cleaned.replace(
        "```JSON",
        ""
    )

    cleaned = cleaned.replace(
        "```",
        ""
    )

    cleaned = cleaned.strip()


    # --------------------------------------------------------
    # Find first JSON object
    # --------------------------------------------------------

    start = cleaned.find(
        "{"
    )


    if start == -1:

        raise RuntimeError(
            "Cloudflare Vision did not return JSON."
        )


    cleaned = cleaned[start:]


    # --------------------------------------------------------
    # Direct JSON parse
    # --------------------------------------------------------

    try:

        parsed = json.loads(
            cleaned
        )

        if isinstance(
            parsed,
            dict
        ):

            return parsed

    except json.JSONDecodeError:
        pass


    # --------------------------------------------------------
    # Balanced JSON extraction
    # --------------------------------------------------------

    extracted = extract_balanced_json(
        cleaned
    )


    if extracted:

        try:

            parsed = json.loads(
                extracted
            )

            if isinstance(
                parsed,
                dict
            ):

                return parsed

        except json.JSONDecodeError:
            pass


    # --------------------------------------------------------
    # Last attempt
    # --------------------------------------------------------

    end = cleaned.rfind(
        "}"
    )


    if end != -1:

        possible_json = cleaned[
            :end + 1
        ]

        try:

            parsed = json.loads(
                possible_json
            )

            if isinstance(
                parsed,
                dict
            ):

                return parsed

        except json.JSONDecodeError:
            pass


    print()
    print(
        "INVALID VISION RESPONSE:"
    )

    print(
        response_text
    )


    raise RuntimeError(
        "Cloudflare Vision returned invalid JSON."
    )


# ============================================================
# BALANCED JSON EXTRACTION
# ============================================================

def extract_balanced_json(
    text: str
) -> str | None:

    start = text.find(
        "{"
    )


    if start == -1:

        return None


    depth = 0
    inside_string = False
    escape = False


    for index in range(
        start,
        len(text)
    ):

        char = text[index]


        if escape:

            escape = False

            continue


        if char == "\\" and inside_string:

            escape = True

            continue


        if char == '"':

            inside_string = not inside_string

            continue


        if inside_string:

            continue


        if char == "{":

            depth += 1


        elif char == "}":

            depth -= 1


            if depth == 0:

                return text[
                    start:index + 1
                ]


    return None


# ============================================================
# NORMALIZE ANALYSIS
# ============================================================

def normalize_analysis(
    data: dict
) -> dict:

    if not isinstance(
        data,
        dict
    ):

        raise RuntimeError(
            "Vision analysis is not a dictionary."
        )


    # --------------------------------------------------------
    # Object name
    # --------------------------------------------------------

    object_name = data.get(
        "object_name",
        "Unknown object"
    )


    if not isinstance(
        object_name,
        str
    ):

        object_name = str(
            object_name
        )


    object_name = clean_text(
        object_name
    )


    # --------------------------------------------------------
    # Material
    # --------------------------------------------------------

    material = data.get(
        "material",
        "Unknown"
    )


    if not isinstance(
        material,
        str
    ):

        material = str(
            material
        )


    material = clean_text(
        material
    )


    # --------------------------------------------------------
    # Condition
    # --------------------------------------------------------

    condition = data.get(
        "condition",
        "Unknown"
    )


    if not isinstance(
        condition,
        str
    ):

        condition = str(
            condition
        )


    condition = clean_text(
        condition
    )


    # --------------------------------------------------------
    # Confidence
    # --------------------------------------------------------

    confidence = data.get(
        "confidence",
        0
    )


    try:

        confidence = float(
            confidence
        )

    except (
        ValueError,
        TypeError
    ):

        confidence = 0


    confidence = max(
        0,
        min(
            100,
            confidence
        )
    )


    # Convert integer-looking float
    if confidence.is_integer():

        confidence = int(
            confidence
        )


    # --------------------------------------------------------
    # Description
    # --------------------------------------------------------

    description = data.get(
        "description",
        ""
    )


    if not isinstance(
        description,
        str
    ):

        description = str(
            description
        )


    description = clean_text(
        description
    )


    # --------------------------------------------------------
    # Idea lists
    # --------------------------------------------------------

    reuse_ideas = normalize_list(
        data.get(
            "reuse_ideas",
            []
        )
    )


    recycle_ideas = normalize_list(
        data.get(
            "recycle_ideas",
            []
        )
    )


    upcycle_ideas = normalize_list(
        data.get(
            "upcycle_ideas",
            []
        )
    )


    home_decor_ideas = normalize_list(
        data.get(
            "home_decor_ideas",
            []
        )
    )


    # --------------------------------------------------------
    # Repair
    # --------------------------------------------------------

    repair_possible = data.get(
        "repair_possible",
        False
    )


    if isinstance(
        repair_possible,
        str
    ):

        repair_possible = (
            repair_possible.lower()
            in [
                "true",
                "yes",
                "possible"
            ]
        )

    else:

        repair_possible = bool(
            repair_possible
        )


    # --------------------------------------------------------
    # Recommended action
    # --------------------------------------------------------

    recommended_action = data.get(
        "recommended_action",
        ""
    )


    if not isinstance(
        recommended_action,
        str
    ):

        recommended_action = str(
            recommended_action
        )


    recommended_action = clean_text(
        recommended_action
    )


    # --------------------------------------------------------
    # FINAL CLEAN OBJECT
    # --------------------------------------------------------

    return {
        "object_name": object_name,
        "material": material,
        "condition": condition,
        "confidence": confidence,
        "description": description,

        "reuse_ideas": reuse_ideas,

        "recycle_ideas": recycle_ideas,

        "upcycle_ideas": upcycle_ideas,

        "home_decor_ideas": home_decor_ideas,

        "repair_possible": repair_possible,

        "recommended_action": recommended_action,
    }


# ============================================================
# NORMALIZE LIST
# ============================================================

def normalize_list(
    value
) -> list:

    if value is None:

        return []


    if isinstance(
        value,
        list
    ):

        cleaned = []

        for item in value:

            if isinstance(
                item,
                str
            ):

                text = clean_text(
                    item
                )

                if text:

                    cleaned.append(
                        text
                    )

        return cleaned


    if isinstance(
        value,
        str
    ):

        text = clean_text(
            value
        )

        if text:

            return [
                text
            ]


    return []


# ============================================================
# CLEAN TEXT
# ============================================================

def clean_text(
    text: str
) -> str:

    if not isinstance(
        text,
        str
    ):

        return str(
            text
        )


    text = text.strip()


    # Remove markdown bullets
    while text.startswith("*"):

        text = text[1:].strip()


    while text.startswith("-"):

        text = text[1:].strip()


    # Remove markdown heading remnants
    text = text.replace(
        "**",
        ""
    )


    return text.strip()