"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";

interface UpdateGoalsDialogProps {
  onUpdateGoals: (goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => void;
  currentGoals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export function UpdateGoalsDialog({
  onUpdateGoals,
  currentGoals,
}: UpdateGoalsDialogProps) {
  const [open, setOpen] = useState(false);
  const [calories, setCalories] = useState(currentGoals.calories);
  const [protein, setProtein] = useState(currentGoals.protein);
  const [carbs, setCarbs] = useState(currentGoals.carbs);
  const [fat, setFat] = useState(currentGoals.fat);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    onUpdateGoals({
      calories,
      protein,
      carbs,
      fat,
    });

    setIsSubmitting(false);

    // Close dialog
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Update Goals
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Nutrition Goals</DialogTitle>
          <DialogDescription>
            Adjust your daily nutrition targets using the sliders below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="space-y-4">
              <div className="flex justify-between">
                <Label htmlFor="calories">Daily Calories</Label>
                <span className="font-medium">{calories}</span>
              </div>
              <Slider
                id="calories"
                min={1200}
                max={4000}
                step={50}
                value={[calories]}
                onValueChange={(value: number[]) => setCalories(value[0])}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label htmlFor="protein">Protein (g)</Label>
                <span className="font-medium">{protein}</span>
              </div>
              <Slider
                id="protein"
                min={50}
                max={300}
                step={5}
                value={[protein]}
                onValueChange={(value: number[]) => setProtein(value[0])}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label htmlFor="carbs">Carbs (g)</Label>
                <span className="font-medium">{carbs}</span>
              </div>
              <Slider
                id="carbs"
                min={50}
                max={400}
                step={5}
                value={[carbs]}
                onValueChange={(value: number[]) => setCarbs(value[0])}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label htmlFor="fat">Fat (g)</Label>
                <span className="font-medium">{fat}</span>
              </div>
              <Slider
                id="fat"
                min={20}
                max={150}
                step={5}
                value={[fat]}
                onValueChange={(value: number[]) => setFat(value[0])}
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Saving...
                </>
              ) : (
                "Save Goals"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
