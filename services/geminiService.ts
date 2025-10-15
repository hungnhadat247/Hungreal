
import { GoogleGenAI, Modality } from "@google/genai";
import { ADVERTISING_STYLES } from '../constants';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface ImagePart {
    inlineData: {
        data: string;
        mimeType: string;
    };
}

const fileToGenerativePart = async (file: File): Promise<ImagePart> => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: {
            data: await base64EncodedDataPromise,
            mimeType: file.type,
        },
    };
};

async function generateSingleImage(modelPart: ImagePart, productPart: ImagePart, stylePrompt: string): Promise<string> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    modelPart,
                    productPart,
                    { text: stylePrompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const imagePart = response.candidates?.[0]?.content?.parts?.[0];
        if (imagePart && imagePart.inlineData) {
            return imagePart.inlineData.data;
        } else {
            throw new Error('Image generation failed for one style. No image data received.');
        }
    } catch (error) {
        console.error("Error generating single image:", error);
        throw new Error("An error occurred while communicating with the AI model.");
    }
}

export const generateStyledImages = async (modelFile: File, productFile: File): Promise<string[]> => {
    const modelPart = await fileToGenerativePart(modelFile);
    const productPart = await fileToGenerativePart(productFile);
    
    const imagePromises = ADVERTISING_STYLES.map(style => 
        generateSingleImage(modelPart, productPart, style)
    );

    const results = await Promise.allSettled(imagePromises);

    const successfulImages = results
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<string>).value);
    
    if (successfulImages.length === 0) {
        throw new Error("Could not generate any images. Please check the input files and try again.");
    }
    
    return successfulImages;
};
