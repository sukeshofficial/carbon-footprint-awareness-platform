import { AlertCircle } from "lucide-react";

export function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1.5 text-[11px] text-destructive mt-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
      <AlertCircle className="h-3 w-3 shrink-0" />
      {message}
    </p>
  );
}

export function SectionHeading({ label, hint = null }) {
  return (
    <div className="mb-3">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
        {label}
      </p>
      {hint && (
        <p className="text-[12px] text-muted-foreground/80 mt-0.5">{hint}</p>
      )}
    </div>
  );
}
