import { useState } from "react";
import { toast } from "sonner";
import {
  MessageSquarePlus,
  Send,
  Star,
  Sparkles,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { submitFeedback } from "@/services/api";

// Modular imports
import { MOODS, FEATURES, RATING_LABELS } from "./constants";
import { useFeedbackForm } from "./use-feedback-form";
import { FieldError, SectionHeading } from "./components";

// ─── Main Component ───────────────────────────────────────────────────────────

export function FeedbackSheet() {
  const [open, setOpen] = useState(false);
  const {
    form,
    errors,
    submitting,
    setSubmitting,
    mood,
    setMood,
    rating,
    setRating,
    hoverRating,
    setHoverRating,
    features,
    toggleFeature,
    anonymous,
    handleAnonymousToggle,
    handleChange,
    validate,
    buildMessage,
    resetAll,
  } = useFeedbackForm();

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleOpenChange = (val) => {
    if (!val) resetAll();
    setOpen(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Snapshot payload before reset
    const payload = {
      name: anonymous ? "" : form.name.trim(),
      email: anonymous ? "" : form.email.trim(),
      message: buildMessage(),
      anonymous,
    };

    setSubmitting(true);
    setOpen(false);
    resetAll();

    submitFeedback(payload)
      .then(() => {
        toast(
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-primary/10 ring-1 ring-primary/20 shrink-0 shadow-inner">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Feedback sent!
              </p>

              <p className="text-sm text-muted-foreground">
                We read every submission. Thanks for helping us improve.
              </p>
            </div>
          </div>
        );
      })
      .catch((err) => {
        toast(
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center h-8 w-8 rounded-xl bg-destructive/10 ring-1 ring-destructive/20 shrink-0 shadow-inner">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Couldn't send feedback
              </p>

              <p className="text-sm text-muted-foreground">
                {err?.message || "Something went wrong. Please try again."}
              </p>
            </div>
          </div>
        );
      });
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>

      {/* ── Trigger ───────────────────────────────────────────────────── */}
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="xs"
          className="fixed top-4 right-6 z-40 gap-2 transition-all duration-200"
        >
          <MessageSquarePlus className="h-4 w-4" />
          Send Feedback
        </Button>
      </SheetTrigger>

      {/* ── Sheet ─────────────────────────────────────────────────────── */}
      <SheetContent className="w-full sm:max-w-[520px] p-0 flex flex-col gap-0 overflow-hidden">

        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="px-6 pt-7 pb-5 border-b border-border/50 shrink-0 bg-gradient-to-br from-primary/[0.03] via-background/75 to-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
          <div className="flex items-start gap-3.5">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 ring-1 ring-primary/20 shrink-0 mt-0.5">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-foreground leading-tight">
                Share your feedback
              </h2>
              <p className="text-[13px] text-muted-foreground mt-1 leading-snug">
                Help us make ACo₂ better. Every response is read by our team.
              </p>
            </div>
          </div>
        </div>

        {/* ── Body ──────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <form
            id="feedback-form"
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col divide-y divide-border/40"
          >

            {/* ── Mood ────────────────────────────────────────────── */}
            <div className="px-6 py-5">
              <SectionHeading
                label="How would you describe your experience?"
                hint="Pick the one that fits best."
              />
              <div className="flex gap-2.5">
                {MOODS.map((m) => {
                  const Icon = m.icon;
                  const isSelected = mood === m.value;
                  return (
                    <button
                      key={m.value}
                      type="button"
                      onClick={() => setMood(isSelected ? null : m.value)}
                      className={[
                        "flex flex-col items-center gap-2 px-3 py-3.5 rounded-xl border-2 flex-1 cursor-pointer",
                        "transition-all duration-150 select-none",
                        isSelected
                          ? "border-primary bg-primary/8 shadow-sm scale-[1.03]"
                          : "border-border/50 hover:border-border hover:bg-muted/40 hover:scale-[1.02]",
                      ].join(" ")}
                    >
                      <span className={["text-3xl leading-none transition-transform duration-150", isSelected ? "scale-110" : ""].join(" ")}>
                        <Icon className={m.className} size={20} />
                      </span>
                      <span className={["text-[11px] font-semibold", isSelected ? "text-primary" : "text-muted-foreground"].join(" ")}>
                        {m.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Star Rating ─────────────────────────────────────── */}
            <div className="px-6 py-5">
              <SectionHeading label="How would you rate the product?" />
              <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = star <= (hoverRating || rating);
                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(rating === star ? 0 : star)}
                      onMouseEnter={() => setHoverRating(star)}
                      className="cursor-pointer p-0.5 transition-transform duration-100 hover:scale-115 active:scale-95"
                      aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    >
                      <Star
                        className={[
                          "h-8 w-8 transition-colors duration-100",
                          active
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/25 hover:text-amber-300",
                        ].join(" ")}
                      />
                    </button>
                  );
                })}
                {rating > 0 && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-400/15 text-amber-600 dark:text-amber-400">
                    {RATING_LABELS[rating]}
                  </span>
                )}
              </div>
            </div>

            {/* ── Feature Chips ───────────────────────────────────── */}
            <div className="px-6 py-5">
              <SectionHeading label="What do you use most?" hint="Select all that apply." />
              <div className="flex flex-wrap gap-2">
                {FEATURES.map((f) => {
                  const active = features.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => toggleFeature(f.id)}
                      className={[
                        "px-3.5 py-1.5 rounded-full text-[12px] font-medium border transition-all duration-150 cursor-pointer select-none",
                        active
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-muted/40 text-muted-foreground border-border/50 hover:border-border hover:bg-muted/70",
                      ].join(" ")}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Anonymous Toggle ────────────────────────────────── */}
            <div className="px-6 py-4">
              <div className={[
                "flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl border transition-all duration-200",
                anonymous
                  ? "border-green-400/40 bg-green-500/8"
                  : "border-border/50 bg-muted/20",
              ].join(" ")}>
                <div className="flex items-center gap-2.5">
                  <EyeOff className={[
                    "h-4 w-4 shrink-0 transition-colors duration-200",
                    anonymous ? "text-green-500" : "text-muted-foreground",
                  ].join(" ")} />
                  <div>
                    <p className={["text-[13px] font-medium leading-none transition-colors duration-200", anonymous ? "text-green-600 dark:text-green-400" : "text-foreground"].join(" ")}>
                      Send anonymously
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                      {anonymous
                        ? "Your name and email will not be included."
                        : "Your identity stays private."}
                    </p>
                  </div>
                </div>
                <Switch
                  id="anonymous-toggle"
                  checked={anonymous}
                  onCheckedChange={handleAnonymousToggle}
                  className="shrink-0"
                />
              </div>
            </div>

            {/* ── Name + Email (hidden when anonymous) ────────────── */}
            {!anonymous && (
              <div className="px-6 py-5 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-200">

                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="feedback-name" className="text-[13px] font-medium">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="feedback-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={handleChange}
                    disabled={submitting}
                    aria-invalid={!!errors.name}
                    className={[
                      "h-10 text-sm",
                      errors.name ? "border-destructive/50 focus-visible:ring-destructive/25" : "",
                    ].join(" ")}
                  />
                  <FieldError message={errors.name} />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="feedback-email" className="text-[13px] font-medium">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="feedback-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={handleChange}
                    disabled={submitting}
                    aria-invalid={!!errors.email}
                    className={[
                      "h-10 text-sm",
                      errors.email ? "border-destructive/50 focus-visible:ring-destructive/25" : "",
                    ].join(" ")}
                  />
                  <FieldError message={errors.email} />
                  <p className="text-[11px] text-muted-foreground/70 -mt-0.5">
                    We'll never share your email with anyone.
                  </p>
                </div>

              </div>
            )}

            {/* ── Feedback Message ─────────────────────────────────── */}
            <div className="px-6 py-5 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="feedback-message" className="text-[13px] font-medium">
                  Your Feedback <span className="text-destructive">*</span>
                </Label>
                <span className={[
                  "text-[11px] tabular-nums transition-colors",
                  form.message.length > 900 ? "text-orange-500" : "text-muted-foreground",
                ].join(" ")}>
                  {form.message.length} / 1000
                </span>
              </div>
              <Textarea
                id="feedback-message"
                name="message"
                placeholder="Tell us what's working well, what could be better, or a feature you'd love to see…"
                value={form.message}
                onChange={handleChange}
                disabled={submitting}
                maxLength={1000}
                aria-invalid={!!errors.message}
                className={[
                  "min-h-[140px] resize-none text-sm leading-relaxed",
                  errors.message ? "border-destructive/50 focus-visible:ring-destructive/25" : "",
                ].join(" ")}
              />
              <FieldError message={errors.message} />
            </div>

          </form>
        </div>

        {/* ── Sticky Footer ──────────────────────────────────────────── */}
        <div className="px-6 py-4 border-t border-border/50 bg-muted/10 shrink-0">
          <Button
            type="submit"
            form="feedback-form"
            className="w-full h-11 gap-2 font-semibold shadow-sm text-[14px]"
          >
            {anonymous ? <EyeOff className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            {anonymous ? "Submit Anonymously" : "Submit Feedback"}
          </Button>
          <p className="text-center text-[11px] text-muted-foreground/60 mt-2.5">
            {anonymous
              ? "No name or email will be attached to this submission."
              : "Your feedback goes directly to our team. We read every response."}
          </p>
        </div>

      </SheetContent>
    </Sheet>
  );
}
