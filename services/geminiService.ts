import { GoogleGenAI, Type, Schema } from "@google/genai";
import { WorksheetData, SectionType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const worksheetSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Creative title for the worksheet" },
    gradeLevel: { type: Type.STRING },
    subject: { type: Type.STRING },
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          type: { 
            type: Type.STRING, 
            enum: [SectionType.Text, SectionType.Question, SectionType.Image, SectionType.Activity],
            description: "The type of section. Use 'image' for places where an illustration would be helpful." 
          },
          title: { type: Type.STRING, description: "Section heading" },
          content: { type: Type.STRING, description: "Main text content or instruction" },
          items: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of questions or options if applicable"
          },
          imageDescription: { 
            type: Type.STRING, 
            description: "A detailed visual description for generating a black and white line-art coloring image suitable for a worksheet. Only required if type is 'image'." 
          }
        },
        required: ["id", "type", "title"],
      },
    },
  },
  required: ["title", "gradeLevel", "subject", "sections"],
};

export const generateWorksheetStructure = async (
  grade: string,
  subject: string,
  topic: string,
  details: string
): Promise<WorksheetData> => {
  const prompt = `
    Create a fun, educational worksheet for Grade ${grade} students.
    Subject: ${subject}
    Topic: ${topic}
    Additional Details: ${details}

    The worksheet should be engaging and structured. 
    Include at least 2 requests for images (type: 'image') where illustrations would help (e.g., a diagram, a character, or a scene to color).
    The image descriptions must be optimized for generating "black and white line art suitable for coloring by children".
    Ensure the content is age-appropriate.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: worksheetSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as WorksheetData;
  } catch (error) {
    console.error("Error generating worksheet structure:", error);
    throw error;
  }
};

export const generateIllustration = async (description: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: `Generate a black and white line art illustration suitable for a children's worksheet coloring page. No complex shading, clean lines, white background. Description: ${description}`,
    });

    // Extract image from response
    // The response structure for image generation often contains inlineData in parts
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Error generating illustration:", error);
    // Return a placeholder if generation fails to avoid breaking the UI
    return "https://picsum.photos/400/300?grayscale&blur=2"; 
  }
};
