import { Layers } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CategoryGeneralInfoProps {
  name: string;
  slug: string;
  description: string;
  setName: (value: string) => void;
  setSlug: (value: string) => void;
  setDescription: (value: string) => void;
}

export function CategoryGeneralInfo({
  name,
  slug,
  description,
  setName,
  setSlug,
  setDescription,
}: CategoryGeneralInfoProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Layers className="size-5 text-primary" />
          <CardTitle className="text-base">General Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. BCS Preliminary"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="slug" className="text-sm font-medium">
              Slug (Optional)
            </label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="custom-slug-url"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description..."
            className="resize-none"
          />
        </div>
      </CardContent>
    </Card>
  );
}
