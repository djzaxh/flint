import { useState } from "react";

export interface MacroData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Suggestion {
  name: string;
  description: string;
  macros: MacroData;
}

export interface FlintResponse {
  response: {
    message: string;
    macros: MacroData;
    suggestions: Suggestion[];
    tips: string[];
  };
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export function useFlint() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const askFlint = async (
    message: string,
    userGoals?: string
  ): Promise<FlintResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      // Add user message to the conversation
      const newMessage: Message = { role: "user", content: message };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);

      const response = await fetch("/api/flint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
          userGoals,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from Flint");
      }

      const data: FlintResponse = await response.json();

      // Add Flint's response to the conversation
      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.response.message },
      ]);

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
  };

  return {
    askFlint,
    messages,
    clearConversation,
    isLoading,
    error,
  };
}
