import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export type AnalysisType = "pros_cons" | "comparison" | "swot";

export interface ProsConsResult {
  items: {
    optionName: string;
    pros: string[];
    cons: string[];
  }[];
  conclusion: string;
}

export interface ComparisonResult {
  criteria: string[];
  options: {
    optionName: string;
    evaluations: {
      criterion: string;
      value: string;
    }[];
  }[];
  conclusion: string;
}

export interface SwotResult {
  items: {
    optionName: string;
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  }[];
  conclusion: string;
}

const prosConsSchema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          optionName: {
            type: Type.STRING,
            description: "Name of the option being evaluated",
          },
          pros: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of pros/advantages",
          },
          cons: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of cons/disadvantages",
          },
        },
        required: ["optionName", "pros", "cons"],
      },
    },
    conclusion: {
      type: Type.STRING,
      description: "A brief summary and recommendation",
    },
  },
  required: ["items", "conclusion"],
};

const comparisonSchema = {
  type: Type.OBJECT,
  properties: {
    criteria: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of criteria used for comparison",
    },
    options: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          optionName: {
            type: Type.STRING,
            description: "Name of the option being evaluated",
          },
          evaluations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                criterion: {
                  type: Type.STRING,
                  description:
                    "The criterion being evaluated, must exactly match one from the criteria array",
                },
                value: {
                  type: Type.STRING,
                  description: "The evaluation or value for this criterion",
                },
              },
              required: ["criterion", "value"],
            },
          },
        },
        required: ["optionName", "evaluations"],
      },
    },
    conclusion: {
      type: Type.STRING,
      description: "A brief summary and recommendation",
    },
  },
  required: ["criteria", "options", "conclusion"],
};

const swotSchema = {
  type: Type.OBJECT,
  properties: {
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          optionName: {
            type: Type.STRING,
            description: "Name of the option being evaluated",
          },
          strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
          weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
          opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
          threats: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: [
          "optionName",
          "strengths",
          "weaknesses",
          "opportunities",
          "threats",
        ],
      },
    },
    conclusion: {
      type: Type.STRING,
      description: "A brief summary and recommendation",
    },
  },
  required: ["items", "conclusion"],
};

export interface ImageInput {
  data: string;
  mimeType: string;
}

export async function analyzeDecision(
  decision: string,
  type: AnalysisType,
  images: ImageInput[] = []
): Promise<ProsConsResult | ComparisonResult | SwotResult> {
  let schema;
  let systemInstruction =
    "You are an expert decision-making assistant. Analyze the user's decision and provide a structured breakdown.";

  switch (type) {
    case "pros_cons":
      schema = prosConsSchema;
      systemInstruction +=
        " Provide a comprehensive list of pros and cons for each option.";
      break;
    case "comparison":
      schema = comparisonSchema;
      systemInstruction +=
        " Provide a detailed comparison table evaluating options against specific criteria.";
      break;
    case "swot":
      schema = swotSchema;
      systemInstruction +=
        " Provide a SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis for each option.";
      break;
  }

  const parts: any[] = [];
  
  if (images && images.length > 0) {
    for (const img of images) {
      parts.push({
        inlineData: {
          data: img.data,
          mimeType: img.mimeType
        }
      });
    }
  }
  
  parts.push({ text: decision || "Please analyze the provided images and compare them." });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: schema,
      temperature: 0.7,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No response from AI");
  }

  return JSON.parse(text);
}
