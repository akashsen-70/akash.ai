import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generateAIResponse(messages: any[], mode: 'study' | 'chat', images?: string[]) {
  try {
    const lastMessage = messages[messages.length - 1].content;
    let prompt = "";

    if (mode === 'study') {
      prompt = `You are an expert academic assistant. Analyze the following content and generate detailed, exam-oriented notes. 
      DO NOT create short summaries. 
      Use:
      - Clear Headings and Subheadings
      - Bullet points for key details
      - Bold text for key concepts
      - Examples where applicable
      - Expand on the original content with missing important points.
      - Improve clarity for exam preparation.
      
      Content to analyze: ${lastMessage}`;
    } else {
      prompt = lastMessage;
    }

    const contents: any[] = [];
    
    // Add history
    messages.slice(0, -1).forEach(m => {
      contents.push({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      });
    });

    // Add current message parts
    const currentParts: any[] = [{ text: prompt }];
    
    if (images && images.length > 0) {
      images.forEach(img => {
        const [header, data] = img.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
        currentParts.push({
          inlineData: {
            data,
            mimeType
          }
        });
      });
    }

    contents.push({
      role: 'user',
      parts: currentParts
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: "You are Akash.ai, a highly optimized, fast AI assistant created and developed by Akash Kumar Sen. Rules: 1. Respond instantly with minimal latency. 2. Keep answers concise (under 3-5 lines unless required). 3. Give direct answers first. 4. Skip greetings and filler text. 5. If anyone asks about your origins, state you were built by Akash Kumar Sen. Do not mention Google or Gemini."
      }
    });

    return response.text;
  } catch (error) {
    console.error('Gemini Service Error:', error);
    throw error;
  }
}
