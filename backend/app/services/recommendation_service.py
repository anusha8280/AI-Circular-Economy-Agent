import os
import json
import httpx

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
# MODEL
# ============================================================

MODEL_NAME = "@cf/meta/llama-3.1-8b-instruct"


# ============================================================
# CLOUDFLARE URL
# ============================================================

CLOUDFLARE_URL = (
    "https://api.cloudflare.com/client/v4/accounts/"
    f"{CLOUDFLARE_ACCOUNT_ID}"
    f"/ai/run/{MODEL_NAME}"
)


# ============================================================
# GENERATE RECOMMENDATIONS
# ============================================================

def generate_recommendations(
    object_name: str,
    material: str,
    condition: str,
    description: str = "",
) -> dict:

    # ========================================================
    # PROMPT
    # ========================================================

    prompt = f"""
You are CircularAI, an expert circular economy assistant.

Detected object:
{object_name}

Material:
{material}

Condition:
{condition}

Description:
{description}

Create practical second-life ideas specifically for this object.

Prioritize:

1. Direct Reuse
2. Repair
3. Upcycling
4. Home Decoration
5. Recycling

IMPORTANT RULES:

- Return ONLY one valid JSON object.
- Do NOT write explanations before the JSON.
- Do NOT write explanations after the JSON.
- Do NOT use markdown.
- Do NOT use ```json.
- Do NOT repeat the JSON.
- Make sure the JSON is complete.
- Give realistic ideas for the detected object.
- Prefer low-cost and student-friendly projects.
- Do not suggest unsafe transformations.
- Do not suggest using plastic bottles as drinking bottles again.
- Give exactly 4 recommendations.
- Include one best option.

Use EXACTLY this structure:

{{
    "best_option": {{
        "title": "Best transformation idea",
        "category": "Upcycling",
        "description": "Detailed explanation",
        "difficulty": "Easy",
        "estimated_cost": "Low",
        "environmental_benefit": "Environmental benefit",
        "required_materials": [
            "Material 1",
            "Material 2"
        ],
        "steps": [
            "Step 1",
            "Step 2",
            "Step 3"
        ]
    }},

    "recommendations": [
        {{
            "title": "Idea 1",
            "category": "Reuse",
            "description": "Description",
            "difficulty": "Easy",
            "estimated_cost": "Low",
            "environmental_benefit": "Benefit",
            "required_materials": [],
            "steps": []
        }},

        {{
            "title": "Idea 2",
            "category": "Upcycling",
            "description": "Description",
            "difficulty": "Easy",
            "estimated_cost": "Low",
            "environmental_benefit": "Benefit",
            "required_materials": [],
            "steps": []
        }},

        {{
            "title": "Idea 3",
            "category": "Home Decoration",
            "description": "Description",
            "difficulty": "Easy",
            "estimated_cost": "Low",
            "environmental_benefit": "Benefit",
            "required_materials": [],
            "steps": []
        }},

        {{
            "title": "Idea 4",
            "category": "Recycling",
            "description": "Description",
            "difficulty": "Easy",
            "estimated_cost": "Low",
            "environmental_benefit": "Benefit",
            "required_materials": [],
            "steps": []
        }}
    ],

    "circular_priority": [
        "Reuse",
        "Repair",
        "Upcycle",
        "Recycle"
    ]
}}
"""


    # ========================================================
    # CLOUDFLARE PAYLOAD
    # ========================================================

    payload = {
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are CircularAI. "
                    "Return only valid JSON. "
                    "Never add explanations."
                ),
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        "max_tokens": 2500,
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
    # DEBUG
    # ========================================================

    print()
    print("=" * 60)
    print("Cloudflare Recommendation AI")
    print("=" * 60)

    print(
        f"Object     : {object_name}"
    )

    print(
        f"Material   : {material}"
    )

    print(
        f"Condition  : {condition}"
    )

    print(
        f"Model      : {MODEL_NAME}"
    )

    print(
        "Generating recommendations..."
    )


    # ========================================================
    # CALL CLOUDFLARE
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
            f"Cloudflare connection failed: {error}"
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
            "Cloudflare recommendation API failed."
        )


    # ========================================================
    # PARSE CLOUDFLARE RESPONSE
    # ========================================================

    try:

        cloudflare_data = response.json()

    except json.JSONDecodeError as error:

        print()
        print("Invalid Cloudflare response:")
        print(response.text)

        raise RuntimeError(
            "Cloudflare returned invalid JSON."
        ) from error


    # ========================================================
    # CHECK CLOUDFLARE SUCCESS
    # ========================================================

    if not cloudflare_data.get(
        "success",
        False,
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
        {},
    )


    print()
    print(
        "Cloudflare result type:",
        type(result).__name__,
    )


    # ========================================================
    # EXTRACT MODEL TEXT
    # ========================================================

    response_text = extract_model_text(
        result
    )


    if not response_text:

        print()
        print("Empty Cloudflare response:")
        print(result)

        raise RuntimeError(
            "Cloudflare returned an empty recommendation response."
        )


    print()
    print("=" * 60)
    print("RAW RECOMMENDATION RESPONSE")
    print("=" * 60)

    print(response_text)


    # ========================================================
    # PARSE MODEL JSON
    # ========================================================

    recommendations = parse_json_response(
        response_text
    )


    # ========================================================
    # NORMALIZE
    # ========================================================

    recommendations = normalize_recommendations(
        recommendations,
        object_name,
    )


    # ========================================================
    # FINAL DEBUG
    # ========================================================

    print()
    print("=" * 60)
    print("RECOMMENDATIONS GENERATED SUCCESSFULLY")
    print("=" * 60)

    print(
        "Number of recommendations:",
        len(
            recommendations["recommendations"]
        ),
    )

    print("=" * 60)


    return recommendations


# ============================================================
# EXTRACT MODEL TEXT
# ============================================================

def extract_model_text(
    result,
) -> str:

    # --------------------------------------------------------
    # RESULT IS STRING
    # --------------------------------------------------------

    if isinstance(
        result,
        str,
    ):

        return result.strip()


    # --------------------------------------------------------
    # RESULT IS DICT
    # --------------------------------------------------------

    if isinstance(
        result,
        dict,
    ):

        # Cloudflare commonly returns:
        #
        # {
        #     "response": "..."
        # }

        response_value = result.get(
            "response"
        )


        # response = string
        if isinstance(
            response_value,
            str,
        ):

            return response_value.strip()


        # response = dictionary
        if isinstance(
            response_value,
            dict,
        ):

            for key in [
                "response",
                "text",
                "content",
                "output",
            ]:

                value = response_value.get(
                    key
                )

                if isinstance(
                    value,
                    str,
                ):

                    return value.strip()


            return json.dumps(
                response_value
            )


        # Other possible fields
        for key in [
            "text",
            "content",
            "output",
        ]:

            value = result.get(
                key
            )

            if isinstance(
                value,
                str,
            ):

                return value.strip()


        # Result itself may already be
        # recommendation JSON

        if (
            "best_option" in result
            or "recommendations" in result
        ):

            return json.dumps(
                result
            )


    return ""


# ============================================================
# PARSE JSON RESPONSE
# ============================================================

def parse_json_response(
    response_text: str,
) -> dict:

    # --------------------------------------------------------
    # SAFETY CHECK
    # --------------------------------------------------------

    if not isinstance(
        response_text,
        str,
    ):

        response_text = json.dumps(
            response_text
        )


    cleaned = response_text.strip()


    # --------------------------------------------------------
    # REMOVE MARKDOWN
    # --------------------------------------------------------

    cleaned = cleaned.replace(
        "```json",
        "",
    )

    cleaned = cleaned.replace(
        "```JSON",
        "",
    )

    cleaned = cleaned.replace(
        "```",
        "",
    )

    cleaned = cleaned.strip()


    # --------------------------------------------------------
    # FIND FIRST JSON OBJECT
    # --------------------------------------------------------

    start = cleaned.find(
        "{"
    )


    if start == -1:

        raise RuntimeError(
            "Cloudflare did not return a JSON object."
        )


    # Remove text before JSON

    cleaned = cleaned[
        start:
    ]


    # --------------------------------------------------------
    # DIRECT PARSE
    # --------------------------------------------------------

    try:

        result = json.loads(
            cleaned
        )

        if isinstance(
            result,
            dict,
        ):

            return result

    except json.JSONDecodeError:
        pass


    # --------------------------------------------------------
    # BALANCED JSON EXTRACTION
    # --------------------------------------------------------

    extracted = extract_balanced_json(
        cleaned
    )


    if extracted:

        try:

            result = json.loads(
                extracted
            )

            if isinstance(
                result,
                dict,
            ):

                return result

        except json.JSONDecodeError:
            pass


    # --------------------------------------------------------
    # LAST ATTEMPT
    # --------------------------------------------------------

    end = cleaned.rfind(
        "}"
    )


    if end != -1:

        possible_json = cleaned[
            :end + 1
        ]

        try:

            result = json.loads(
                possible_json
            )

            if isinstance(
                result,
                dict,
            ):

                return result

        except json.JSONDecodeError:
            pass


    # --------------------------------------------------------
    # FAILED
    # --------------------------------------------------------

    print()
    print("=" * 60)
    print("INVALID RECOMMENDATION RESPONSE")
    print("=" * 60)

    print(cleaned)

    raise RuntimeError(
        "Cloudflare returned invalid recommendation JSON."
    )


# ============================================================
# BALANCED JSON EXTRACTION
# ============================================================

def extract_balanced_json(
    text: str,
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
        len(text),
    ):

        char = text[index]


        # Handle escape character

        if escape:

            escape = False
            continue


        if (
            char == "\\"
            and inside_string
        ):

            escape = True
            continue


        # Handle quotes

        if char == '"':

            inside_string = not inside_string
            continue


        if inside_string:
            continue


        # Object starts

        if char == "{":

            depth += 1


        # Object ends

        elif char == "}":

            depth -= 1


            if depth == 0:

                return text[
                    start:index + 1
                ]


    return None


# ============================================================
# NORMALIZE RECOMMENDATIONS
# ============================================================

def normalize_recommendations(
    data: dict,
    object_name: str,
) -> dict:

    # --------------------------------------------------------
    # SAFETY
    # --------------------------------------------------------

    if not isinstance(
        data,
        dict,
    ):

        data = {}


    # --------------------------------------------------------
    # BEST OPTION
    # --------------------------------------------------------

    if not isinstance(
        data.get("best_option"),
        dict,
    ):

        data["best_option"] = {
            "title": (
                f"Upcycled {object_name}"
            ),
            "category": "Upcycling",
            "description": (
                f"Transform the {object_name} "
                "into a useful new product."
            ),
            "difficulty": "Easy",
            "estimated_cost": "Low",
            "environmental_benefit": (
                "Extends the life of the item "
                "and reduces waste."
            ),
            "required_materials": [],
            "steps": [
                "Clean the item.",
                "Prepare the item safely.",
                "Transform it into a useful product.",
            ],
        }


    # --------------------------------------------------------
    # RECOMMENDATIONS
    # --------------------------------------------------------

    if not isinstance(
        data.get("recommendations"),
        list,
    ):

        data["recommendations"] = []


    # --------------------------------------------------------
    # CLEAN INVALID ITEMS
    # --------------------------------------------------------

    valid_recommendations = []


    for item in data["recommendations"]:

        if not isinstance(
            item,
            dict,
        ):
            continue


        # Make sure required fields exist

        item.setdefault(
            "title",
            "Circular Reuse Idea",
        )

        item.setdefault(
            "category",
            "Upcycling",
        )

        item.setdefault(
            "description",
            "A practical way to reuse this item.",
        )

        item.setdefault(
            "difficulty",
            "Easy",
        )

        item.setdefault(
            "estimated_cost",
            "Low",
        )

        item.setdefault(
            "environmental_benefit",
            "Reduces waste and extends product life.",
        )

        item.setdefault(
            "required_materials",
            [],
        )

        item.setdefault(
            "steps",
            [],
        )


        valid_recommendations.append(
            item
        )


    data["recommendations"] = (
        valid_recommendations
    )


    # --------------------------------------------------------
    # CIRCULAR PRIORITY
    # --------------------------------------------------------

    if not isinstance(
        data.get("circular_priority"),
        list,
    ):

        data["circular_priority"] = [
            "Reuse",
            "Repair",
            "Upcycle",
            "Recycle",
        ]


    # --------------------------------------------------------
    # RETURN
    # --------------------------------------------------------

    return data