import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
from groq import Groq

load_dotenv()

app = Flask(__name__)
CORS(app)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def build_prompt(product_name, description, platform, tone):
    """Master Instruction Template — Dynamic prompt compilation."""

    platform_rules = {
        "LinkedIn": "Professional tone, max 3 short paragraphs, end with a call-to-action, no hashtags spam (max 3).",
        "Instagram": "Catchy, engaging, use emojis naturally, short punchy sentences, include 5-8 relevant hashtags at the end.",
        "Email": "Formal subject line + body, persuasive marketing email structure, clear CTA button text suggestion.",
        "Twitter": "Extremely concise, max 280 characters total, punchy hook in first line, 1-2 relevant hashtags max.",
        "Facebook": "Conversational and friendly tone, 2-4 sentences, ask a question or encourage engagement, 1-2 emojis.",
        "TikTok": "Fun, trendy, Gen-Z friendly tone, hook in the first line, short and snappy, include 3-5 trending-style hashtags.",
        "GitHub": "Clear, technical, and concise, written like a README or release note, no marketing fluff, focus on features/benefits in bullet-point style language."
    }

    rules = platform_rules.get(platform, "Write clear, professional marketing copy.")

    prompt = f"""
You are an expert marketing copywriter.

Product Name: {product_name}
Product Description: {description}
Target Platform: {platform}
Tone: {tone}

Platform-specific rules: {rules}

Task: Write high-converting marketing copy for the above product,
strictly following the platform rules and tone requested.
Only output the final copy, no explanations.
"""
    return prompt.strip()


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()

    product_name = data.get("product_name", "")
    description = data.get("description", "")
    platform = data.get("platform", "LinkedIn")
    tone = data.get("tone", "Professional")
    temperature = float(data.get("temperature", 0.7))
    top_p = float(data.get("top_p", 0.9))

    prompt = build_prompt(product_name, description, platform, tone)

    try:
        response = client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {"role": "user", "content": prompt}
            ],
            temperature=temperature,
            top_p=top_p,
        )
        result_text = response.choices[0].message.content
        return jsonify({"success": True, "copy": result_text})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)