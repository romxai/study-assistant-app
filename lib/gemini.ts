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

const generationConfig = {
  temperature: 0.9,
  topK: 1,
  topP: 1,
  maxOutputTokens: 2048,
};

interface Message {
  role: "user" | "model";
  parts: string;
}

export async function generateResponse(
  prompt: string,
  history: Message[] = []
) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig,
      safetySettings,
    });

    const chat = model.startChat({
      history: history.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.parts }],
      })),
      generationConfig,
      safetySettings,
    });

    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    return text;
  } catch (error: any) {
    console.error("Error generating response:", error);
    throw error;
  }
}

export async function processFile(file: File, prompt?: string) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig,
      safetySettings,
    });

    // Convert file to base64
    const base64Data = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });

    // Create file data object
    const fileData = {
      inlineData: {
        data: base64Data.split(",")[1],
        mimeType: file.type,
      },
    };

    const defaultPrompt = `Please analyze this ${file.type} file and provide a detailed summary with the following structure:
1. Main Topic/Purpose
2. Key Points (as bullet points)
3. Summary (2-3 paragraphs)
4. Important Details or Findings
5. Recommendations (if applicable)`;

    const result = await model.generateContent([
      fileData,
      prompt || defaultPrompt,
    ]);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    return text;
  } catch (error: any) {
    console.error("Error processing file:", error);
    throw error;
  }
}

export async function analyzeDocument(content: string) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig,
      safetySettings,
    });

    const prompt = `Please analyze this document and provide a comprehensive analysis with the following structure:

1. Main Topic
2. Key Points (bullet points)
3. Summary (2-3 paragraphs)
4. Important Details
5. Recommendations or Next Steps

Content to analyze:
${content}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Empty response from Gemini API");
    }

    return text;
  } catch (error: any) {
    console.error("Error analyzing document:", error);
    throw error;
  }
}
