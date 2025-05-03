import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { createBrowserClient } from "@supabase/ssr";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OpenAI API Key");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key");
}
const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

export async function getChatCompletion(
  messages: ChatCompletionMessageParam[]
) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw error;
  }
}

export async function getNutritionAdvice(message: string, nutritionData: any) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: `You are Flint, an AI nutrition assistant. The user's current nutrition data is:
          Calories: ${nutritionData.calories}
          Protein: ${nutritionData.protein}g
          Carbs: ${nutritionData.carbs}g
          Fat: ${nutritionData.fat}g
          
          Provide specific, actionable nutrition advice based on their data and question.`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error getting nutrition advice:", error);
    throw error;
  }
}

export async function logMeal(description: string, goals: any) {
  try {
    const session = await supabase.auth.getSession();
    console.log("Supabase session", session);
    if (!session.data.session) {
      throw new Error(
        "No Supabase session: user is not authenticated. You will get 401 errors from RLS."
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: `You are a nutrition expert. Extract meal information from the description and format it as JSON with these fields:
          name (string)
          calories (number)
          protein (number in grams)
          carbs (number in grams)
          fat (number in grams)
          
          The user's nutrition goals are:
          Calories: ${goals.calories}
          Protein: ${goals.protein}g
          Carbs: ${goals.carbs}g
          Fat: ${goals.fat}g`,
        },
        {
          role: "user",
          content: description,
        },
      ],
      temperature: 0.3,
      max_tokens: 200,
    });

    if (!response.choices[0].message.content) {
      throw new Error("OpenAI did not return a message content");
    }
    const mealData = JSON.parse(response.choices[0].message.content);
    return mealData;
  } catch (error) {
    console.error("Error logging meal:", error);
    throw error;
  }
}

export async function recommendFood(nutritionData: any, goals: any) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: `You are a nutrition expert. Recommend 3 meals that would help the user meet their nutrition goals.
          Current nutrition:
          Calories: ${nutritionData.calories}/${goals.calories}
          Protein: ${nutritionData.protein}g/${goals.protein}g
          Carbs: ${nutritionData.carbs}g/${goals.carbs}g
          Fat: ${nutritionData.fat}g/${goals.fat}g
          
          Return the recommendations as a JSON array with these fields for each meal:
          name (string)
          restaurant (string)
          calories (number)
          protein (number in grams)
          carbs (number in grams)
          fat (number in grams)
          price (number)
          image (string - URL to a relevant image)
          description (string)`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    if (!response.choices[0].message.content) {
      throw new Error("OpenAI did not return a message content");
    }
    const recommendations = JSON.parse(response.choices[0].message.content);
    return recommendations;
  } catch (error) {
    console.error("Error getting food recommendations:", error);
    throw error;
  }
}
