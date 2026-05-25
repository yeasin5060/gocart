import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

async function main(base64Image, mimeType) {
  const messages = [
    {
      role: "system",
      content: `
        You are a product listing assistant for an e-commerce store. 

        Your jobs is to analyze an image of a product and generate structured data. Respond ONLY with raw JSON (no code block, no markdown, no explanation)

        Return ONLY valid JSON.

        Format:
        {
        "name": "Product name",
        "description": "Marketing friendly description"
        }`,
    },
    {
      role: "user",
      content: [
        {
          type: "text",
          text: "Analyze this image and return product name and description.",
        },
        {
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${base64Image}`,
          },
        },
      ],
    },
  ];

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL,
    messages,
    max_tokens: 300,
  });

  const raw = response.choices[0].message.content;

  const cleaned = raw.replace(/```json|```/g, "").trim();

  return JSON.parse(cleaned);
}

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json(
        { message: "Not authorized" },
        { status: 401 }
      );
    }

    const { base64Image, mimeType } = await request.json();

    const result = await main(base64Image, mimeType);

    return NextResponse.json(result);

  } catch (error) {
    console.log("FULL ERROR:", error);

    return NextResponse.json(
      {
        message: error.message,
        status: error.status,
      },
      { status: 400 }
    );
  }
}