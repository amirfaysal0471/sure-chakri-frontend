import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

import { COLORS } from "./constants";

interface CategorySettingsProps {
  priority: number;
  isActive: boolean;
  selectedColor: string;
  setPriority: (value: number) => void;
  setIsActive: (value: boolean) => void;
  setSelectedColor: (value: string) => void;
}

export function CategorySettings({
  priority,
  isActive,
  selectedColor,
  setPriority,
  setIsActive,
  setSelectedColor,
}: CategorySettingsProps) {
  return (
    <div className="space-y-6">
      {/* Appearance Section */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Appearance</CardTitle>
          <CardDescription>Select a theme color</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 gap-3">
            {COLORS.map((color) => (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(color.name)}
                title={color.name}
                aria-pressed={selectedColor === color.name}
                className={cn(
                  "size-8 rounded-full transition-transform hover:scale-110",
                  color.class,
                  selectedColor === color.name &&
                    "scale-110 shadow-sm ring-2 ring-black ring-offset-2"
                )}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Settings Section */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="priority" className="text-sm font-medium">
              Priority Order
            </label>
            <Input
              id="priority"
              type="number"
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              Higher number shows first.
            </p>
          </div>
          <div className="flex items-center justify-between rounded-lg border bg-muted/10 p-3">
            <label
              htmlFor="status-switch"
              className="cursor-pointer text-sm font-medium"
            >
              Active Status
            </label>
            <Switch
              id="status-switch"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
