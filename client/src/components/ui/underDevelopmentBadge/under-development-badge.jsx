import { TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function UnderDevelopmentBadge() {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full">
      <div className="flex justify-center">
        <Badge
          variant="destructive"
          className="w-full rounded-none py-2 text-xs justify-center gap-2"
        >
          <TriangleAlert className="h-4 w-4" />
          ACo₂ is currently in development. Feedback is welcome.
        </Badge>
      </div>
    </div>
  );
}