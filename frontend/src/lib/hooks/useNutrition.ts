import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from "sonner";

export interface MacroData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DailySummary {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
}

export function useNutrition() {
  const [nutritionData, setNutritionData] = useState<DailySummary>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    date: new Date().toISOString().split("T")[0],
  });
  const [meals, setMeals] = useState<Meal[]>([]);
  const [goals, setGoals] = useState<NutritionGoals>({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 70,
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  // Fetch today's nutrition data
  const fetchTodayNutrition = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];

      // Fetch daily summary
      const { data: summaryData, error: summaryError } = await supabase
        .from("daily_nutrition_summary")
        .select("*")
        .eq("date", today)
        .single();

      if (summaryError && summaryError.code !== "PGRST116") {
        throw summaryError;
      }

      if (summaryData) {
        setNutritionData({
          calories: summaryData.calories,
          protein: summaryData.protein,
          carbs: summaryData.carbs,
          fat: summaryData.fat,
          date: summaryData.date,
        });
      }

      // Fetch today's meals
      const { data: mealsData, error: mealsError } = await supabase
        .from("meals")
        .select("*")
        .gte("time", today)
        .lt(
          "time",
          new Date(new Date(today).getTime() + 86400000).toISOString()
        )
        .order("time", { ascending: false });

      if (mealsError) throw mealsError;
      setMeals(mealsData || []);

      // Fetch nutrition goals
      const { data: goalsData, error: goalsError } = await supabase
        .from("nutrition_goals")
        .select("*")
        .single();

      if (goalsError && goalsError.code !== "PGRST116") {
        throw goalsError;
      }

      if (goalsData) {
        setGoals({
          calories: goalsData.calories,
          protein: goalsData.protein,
          carbs: goalsData.carbs,
          fat: goalsData.fat,
        });
      }
    } catch (error) {
      console.error("Error fetching nutrition data:", error);
      toast.error("Failed to load nutrition data");
    } finally {
      setIsLoading(false);
    }
  };

  // Update nutrition goals
  const updateGoals = async (newGoals: NutritionGoals) => {
    try {
      const { error } = await supabase.from("nutrition_goals").upsert({
        calories: newGoals.calories,
        protein: newGoals.protein,
        carbs: newGoals.carbs,
        fat: newGoals.fat,
      });

      if (error) throw error;
      setGoals(newGoals);
      toast.success("Nutrition goals updated successfully");
    } catch (error) {
      console.error("Error updating goals:", error);
      toast.error("Failed to update nutrition goals");
    }
  };

  // Add a meal
  const addMeal = async (meal: Omit<Meal, "id" | "time">, userId: string) => {
    try {
      const payload = {
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        user_id: userId,
        time: new Date().toISOString(),
      };
      const { data, error } = await supabase
        .from("meals")
        .insert([payload])
        .select()
        .single();

      if (error) throw { error, payload, userId };

      setMeals((prev) => [data, ...prev]);
      toast.success("Meal added successfully");
    } catch (err) {
      console.error("Error adding meal:", err);
      toast.error("Failed to add meal");
    }
  };

  // Log macros
  const logMacros = async (macros: MacroData, userId: string) => {
    try {
      const payload = {
        calories: macros.calories,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
        user_id: userId,
        timestamp: new Date().toISOString(),
      };
      const { error } = await supabase.from("nutrition_logs").insert([payload]);

      if (error) throw { error, payload, userId };

      // Refresh today's nutrition data
      await fetchTodayNutrition();
      toast.success("Macros logged successfully");
    } catch (err) {
      console.error("Error logging macros:", err);
      toast.error("Failed to log macros");
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchTodayNutrition();
  }, []);

  return {
    nutritionData,
    meals,
    goals,
    isLoading,
    updateGoals,
    addMeal,
    logMacros,
    refreshData: fetchTodayNutrition,
  };
}
