import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error("Missing Gemini API key");
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export async function generateResponse(prompt: string, context?: string) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      safetySettings,
    });

    const fullPrompt = context
      ? `Context: ${context}\n\nQuestion: ${prompt}`
      : prompt;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;

    if (!response.text()) {
      throw new Error("Empty response from Gemini API");
    }

    return response.text();
  } catch (error: any) {
    console.error("Error generating response:", error);
    throw new Error(error.message || "Failed to generate response");
  }
}

export async function analyzeDocument(content: string) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      safetySettings,
    });

    const prompt = `Please analyze this document and provide a comprehensive summary with key points:

${content}

Please format the response with:
1. Main Topic
2. Key Points (bullet points)
3. Summary (2-3 paragraphs)`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    if (!response.text()) {
      throw new Error("Empty response from Gemini API");
    }

    return response.text();
  } catch (error: any) {
    console.error("Error analyzing document:", error);
    throw new Error(error.message || "Failed to analyze document");
  }
}
