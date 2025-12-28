
import { GoogleGenAI, Type } from "@google/genai";
import { MathProblem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateSimilarProblem(): Promise<MathProblem> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "请生成一个类似于‘班里有49人，30人会钢琴，28人会小提琴，13人都会，求都不会的人数’这样的小学数学集合题。确保数据合理（都不及格或都会的人数应为非负数，交集不大于任何一个集合）。输出JSON格式。",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          totalStudents: { type: Type.INTEGER },
          setAName: { type: Type.STRING },
          setBName: { type: Type.STRING },
          countA: { type: Type.INTEGER },
          countB: { type: Type.INTEGER },
          countBoth: { type: Type.INTEGER },
          description: { type: Type.STRING }
        },
        required: ["title", "totalStudents", "setAName", "setBName", "countA", "countB", "countBoth", "description"]
      }
    }
  });

  return JSON.parse(response.text);
}
