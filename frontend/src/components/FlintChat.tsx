"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Brain, Send } from "lucide-react";
import { getChatCompletion } from "@/lib/openai";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { LogMacrosDialog } from "./LogMacrosDialog";
import { useNutrition, MacroData, Meal } from "@/lib/hooks/useNutrition";

interface Suggestion {
  name: string;
  description: string;
  macros: MacroData;
}

interface FlintMessage {
  role: "user" | "assistant";
  content: string;
  macros?: MacroData;
  suggestions?: Suggestion[];
  tips?: string[];
}

interface FlintChatProps {
  onUpdateMacros?: (macros: MacroData) => void;
  onAddMeal?: (meal: Meal) => void;
  nutritionData?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number;
    meals: Meal[];
  };
  nutritionGoals?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export default function FlintChat({
  onUpdateMacros,
  onAddMeal,
  nutritionData,
  nutritionGoals,
}: FlintChatProps) {
  const [messages, setMessages] = useState<FlintMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Flint, your AI nutrition assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastResponse, setLastResponse] = useState<FlintMessage | null>(null);
  const [showMacrosDialog, setShowMacrosDialog] = useState(false);
  const [pendingMacros, setPendingMacros] = useState<MacroData | null>(null);

  const {
    nutritionData: existingNutritionData,
    goals,
    logMacros,
    addMeal,
  } = useNutrition();

  const processJsonResponse = (content: string) => {
    const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) return content;

    try {
      const jsonData = JSON.parse(jsonMatch[1]);

      // Handle macros
      if (jsonData.macros) {
        const autoLog = localStorage.getItem("autoLogMacros") === "true";
        if (autoLog) {
          // Directly log macros without showing dialog
          handleMacrosConfirm(jsonData.macros, true);
        } else {
          setPendingMacros(jsonData.macros);
          setShowMacrosDialog(true);
        }
      }

      // Handle meal
      if (jsonData.meal) {
        addMeal(jsonData.meal);
        toast.success(`Added ${jsonData.meal.name} to your nutrition log`);
      }

      // Handle recommendations
      if (jsonData.recommendations && onUpdateMacros) {
        onUpdateMacros(jsonData.macros);
        toast.success("New food recommendations are available");
      }

      // Remove the JSON block from the displayed message
      return content.replace(/```json\n[\s\S]*?\n```/, "").trim();
    } catch (error) {
      console.error("Error processing JSON:", error);
      return content;
    }
  };

  const handleMacrosConfirm = async (macros: MacroData, autoLog: boolean) => {
    try {
      // Store auto-log preference in localStorage
      localStorage.setItem("autoLogMacros", String(autoLog));

      // Log macros to Supabase
      await logMacros(macros);
    } catch (error) {
      console.error("Error logging macros:", error);
      toast.error("Failed to log macros. Please try again.");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: FlintMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Convert messages to OpenAI format
      const openAIMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Add the new user message
      openAIMessages.push({
        role: "user",
        content: input,
      });

      // Add system message with context
      const systemMessage = {
        role: "system" as const,
        content: `You are Flint, an AI nutrition assistant. 
        ${
          nutritionData
            ? `The user's current nutrition data is:
        Calories: ${nutritionData.calories}
        Protein: ${nutritionData.protein}g
        Carbs: ${nutritionData.carbs}g
        Fat: ${nutritionData.fat}g`
            : ""
        }
        
        ${
          nutritionGoals
            ? `The user's nutrition goals are:
        Calories: ${nutritionGoals.calories}
        Protein: ${nutritionGoals.protein}g
        Carbs: ${nutritionGoals.carbs}g
        Fat: ${nutritionGoals.fat}g`
            : ""
        }
        
        When providing nutrition advice, include a JSON block with relevant data.
        For meal logging, include a JSON block with the meal details.
        For food recommendations, include a JSON block with DoorDash options.
        
        Format your JSON responses like this:
        \`\`\`json
        {
          "macros": { "calories": 500, "protein": 30, "carbs": 50, "fat": 20 },
          "meal": { "name": "Chicken Salad", "calories": 350, "protein": 25, "carbs": 15, "fat": 10 },
          "recommendations": [
            { "name": "Grilled Chicken Bowl", "restaurant": "Healthy Eats", "calories": 450, "protein": 40, "carbs": 45, "fat": 15, "price": 12.99, "image": "https://example.com/image.jpg", "description": "A healthy bowl with grilled chicken" }
          ]
        }
        \`\`\`
        
        Only include the JSON fields that are relevant to the user's request.`,
      };

      // Get response from OpenAI
      const response = await getChatCompletion([
        systemMessage,
        ...openAIMessages,
      ]);

      // Process the response to extract JSON data
      const processedContent = response
        ? processJsonResponse(response)
        : "I'm sorry, I couldn't process your request at this time.";

      // Create assistant message
      const assistantMessage: FlintMessage = {
        role: "assistant",
        content: processedContent,
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setLastResponse(assistantMessage);
    } catch (error) {
      console.error("Error getting response:", error);
      const errorMessage: FlintMessage = {
        role: "assistant",
        content: "I'm sorry, I encountered an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      setLastResponse(errorMessage);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Chat with Flint
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-[400px] overflow-y-auto pr-4">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <Spinner size="sm" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {lastResponse?.macros && (
            <div className="border rounded-lg p-4 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Macros:</h3>
                <div className="grid grid-cols-4 gap-4">
                  {Object.entries(lastResponse.macros).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="font-medium">{value}</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {key}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {lastResponse.suggestions &&
                lastResponse.suggestions.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Suggestions:</h3>
                    <div className="space-y-2">
                      {lastResponse.suggestions.map((suggestion, i) => (
                        <div key={i} className="border rounded-lg p-3">
                          <div className="font-medium">{suggestion.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {suggestion.description}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {suggestion.macros.calories} cal •{" "}
                            {suggestion.macros.protein}g protein
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {lastResponse.tips && lastResponse.tips.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Tips:</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {lastResponse.tips.map((tip, i) => (
                      <li key={i} className="text-sm text-muted-foreground">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about any food or nutrition topic..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Spinner size="sm" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      </CardContent>

      <LogMacrosDialog
        isOpen={showMacrosDialog}
        onClose={() => setShowMacrosDialog(false)}
        onConfirm={handleMacrosConfirm}
        macros={pendingMacros || { calories: 0, protein: 0, carbs: 0, fat: 0 }}
      />
    </Card>
  );
}
