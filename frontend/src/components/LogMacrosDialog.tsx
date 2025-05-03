import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { MacroData } from "@/lib/hooks/useNutrition";

interface LogMacrosDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (macros: MacroData, autoLog: boolean) => void;
  macros: MacroData;
}

export function LogMacrosDialog({
  isOpen,
  onClose,
  onConfirm,
  macros,
}: LogMacrosDialogProps) {
  const [autoLog, setAutoLog] = useState(false);

  const handleConfirm = () => {
    onConfirm(macros, autoLog);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Log Macros</DialogTitle>
          <DialogDescription>
            Would you like to log these macros to your nutrition tracker?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Calories</Label>
              <div className="text-2xl font-bold">{macros.calories}</div>
            </div>
            <div className="space-y-1">
              <Label>Protein</Label>
              <div className="text-2xl font-bold">{macros.protein}g</div>
            </div>
            <div className="space-y-1">
              <Label>Carbs</Label>
              <div className="text-2xl font-bold">{macros.carbs}g</div>
            </div>
            <div className="space-y-1">
              <Label>Fat</Label>
              <div className="text-2xl font-bold">{macros.fat}g</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="auto-log"
              checked={autoLog}
              onCheckedChange={(checked) => setAutoLog(checked as boolean)}
            />
            <Label htmlFor="auto-log">
              Automatically log macros from chat in the future
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Log Macros</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
