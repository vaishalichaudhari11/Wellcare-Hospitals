import { GoogleGenAI, Type } from "@google/genai";
import { DOCTORS, DEPARTMENTS } from "../data";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AIDiagnosisResult {
  condition: string;
  symptoms: string[];
  precautions: string[];
  confidence: "Low" | "Medium" | "High";
  departmentId: string;
  suggestedDoctors: string[]; // doctor IDs
  disclaimer: string;
}

export async function analyzeSymptomImage(base64Image: string, mimeType: string): Promise<AIDiagnosisResult> {
  const prompt = `Analyze this medical image accurately for educational and informational purposes. 
  Your primary goal is to identify the most relevant medical department for the symptoms or image type shown.

  CRITICAL DEPARTMENT SELECTION RULES:
  1. orthopedics (Bones/Joints): 
     - Select for ANY X-ray or CT scan showing bones/joints.
     - Select for photos showing swelling, redness, or deformity of limbs (hands, feet, ankles, knees, elbows).
     - Select for sports injuries or joint pain.
  2. neurology (Brain/Nerves):
     - Select for MRI or CT scans of the Brain or Spine.
     - Select for reports of tremors or neurological deficits.
  3. cardiology (Heart):
     - Select for ECG/EKG strips (graphs of heart rhythms).
     - Select for cardiac ultrasound or chest-related heart concerns.
  4. dermatology (Skin):
     - Select ONLY for surface skin issues: rashes, infections, acne, moles, burns, or hair/nail issues.
     - Do NOT select for joint swelling (use orthopedics instead).
  5. oncology (Cancer):
     - Select for suspicious tumors, lumps, or biopsy-related scans.
  6. pediatrics (Children):
     - Only if the subject is clearly an infant or child.

  Map the result to one of these valid IDs: ${DEPARTMENTS.map(d => d.id).join(", ")}.

  Return the result as a valid JSON object.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { inlineData: { data: base64Image, mimeType } },
            { text: prompt }
          ]
        }
      ],
      config: {
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
        ] as any,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            condition: { type: Type.STRING },
            symptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
            precautions: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidence: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
            department: { type: Type.STRING }
          },
          required: ["condition", "symptoms", "precautions", "confidence", "department"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    
    // Safety check for department using keywords to override or refine AI classification
    let matchedDept = data.department && DEPARTMENTS.some(d => d.id === data.department) 
      ? data.department 
      : "orthopedics";

    const textToSearch = (data.condition + " " + (data.symptoms?.join(" ") || "") + " " + data.department).toLowerCase();
    
    // Priority 1: Specialist Scans & Critical Organs (Higher confidence signatures)
    if (textToSearch.includes("ecg") || textToSearch.includes("ekg") || textToSearch.includes("heart") || textToSearch.includes("cardiac")) {
      matchedDept = "cardiology";
    } else if (textToSearch.includes("mri") || textToSearch.includes("brain") || textToSearch.includes("neuro") || textToSearch.includes("spine")) {
      matchedDept = "neurology";
    } 
    // Priority 2: Surface / Skin (Dermatology)
    // We check this before general limb mentions to avoid misclassifying rashes on limbs
    else if (textToSearch.includes("rash") || textToSearch.includes("allergy") || textToSearch.includes("skin") || textToSearch.includes("dermatology") || textToSearch.includes("mole") || textToSearch.includes("acne") || textToSearch.includes("infection")) {
      // But if it specifically mentions bones/joints/x-rays, it might be an orthopedic issue with a skin symptom
      if (textToSearch.includes("x-ray") || textToSearch.includes("bone") || textToSearch.includes("fracture")) {
        matchedDept = "orthopedics";
      } else {
        matchedDept = "dermatology";
      }
    }
    // Priority 3: Structural / Physical Injury (X-rays, Swelling, Joints)
    else if (
      textToSearch.includes("bone") || 
      textToSearch.includes("fracture") || 
      textToSearch.includes("joint") || 
      textToSearch.includes("x-ray") || 
      textToSearch.includes("swelling") ||
      textToSearch.includes("ortho") ||
      textToSearch.includes("dislocation") ||
      textToSearch.includes("sprain")
    ) {
      matchedDept = "orthopedics";
    }
    // Priority 4: Body Parts (fallback for physical injuries if AI is vague about joints/bones)
    else if (
      textToSearch.includes("hand") || 
      textToSearch.includes("knee") || 
      textToSearch.includes("ankle") || 
      textToSearch.includes("foot") ||
      textToSearch.includes("elbow") ||
      textToSearch.includes("limb")
    ) {
      matchedDept = "orthopedics";
    }
    // Priority 4: Specialist Conditions (Cancer/Pediatrics)
    else if (textToSearch.includes("cancer") || textToSearch.includes("tumor") || textToSearch.includes("oncology")) {
      matchedDept = "oncology";
    }
    else if (textToSearch.includes("child") || textToSearch.includes("pediatric") || textToSearch.includes("infant")) {
      matchedDept = "pediatrics";
    }
    
    const suggestedDoctors = DOCTORS
      .filter(dr => dr.departmentId === matchedDept)
      .map(dr => dr.id);

    return {
      condition: data.condition || "Medical Analysis Result",
      symptoms: data.symptoms || ["Observation required by specialist"],
      precautions: data.precautions || ["Avoid self-medicating", "Consult a certified doctor"],
      confidence: (data.confidence as any) || "Medium",
      departmentId: matchedDept,
      suggestedDoctors: suggestedDoctors.length > 0 ? suggestedDoctors : [DOCTORS[0].id],
      disclaimer: "This AI-generated analysis is for informational purposes and not a professional medical diagnosis."
    };
  } catch (error) {
    console.error("AI Diagnosis Error:", error);
    return {
      condition: "Analysis Incomplete",
      symptoms: ["We were unable to fully analyze the symptoms in this image."],
      precautions: ["Seek professional medical advice immediately", "Do not rely on AI for critical health decisions"],
      confidence: "Low",
      departmentId: "orthopedics", 
      suggestedDoctors: DOCTORS.filter(dr => dr.departmentId === "orthopedics").map(dr => dr.id),
      disclaimer: "General recommendation based on common image types. Please consult a specialist."
    };
  }
}
