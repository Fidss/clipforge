const { GoogleGenAI, Type, Schema } = require('@google/genai');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../../.env') });

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyzeTranscript(transcriptSegments) {
    const transcriptText = transcriptSegments.map(s => `[${s.start_time} - ${s.end_time}] ${s.text}`).join('\n');
    
    const responseSchema = {
        type: Type.OBJECT,
        properties: {
            clips: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        start: { type: Type.NUMBER },
                        end: { type: Type.NUMBER },
                        score: { type: Type.NUMBER },
                        title: { type: Type.STRING },
                        reason: { type: Type.STRING },
                        hook: { type: Type.STRING }
                    },
                    required: ["start", "end", "score", "title", "reason", "hook"]
                }
            }
        },
        required: ["clips"]
    };

    const prompt = `You are an expert short-form video editor. 
Analyze the following video transcript with timestamps.
Find the best, most engaging clips (30-90 seconds long) suitable for TikTok/Reels/Shorts.
Look for strong hooks, surprising insights, emotional moments, or funny moments.
Ensure the start and end timestamps make natural sense (do not cut off sentences).
Score each clip from 0 to 100 based on its virality potential.

Transcript:
${transcriptText}`;

    const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        }
    });

    return JSON.parse(response.text).clips;
}

module.exports = { analyzeTranscript };
