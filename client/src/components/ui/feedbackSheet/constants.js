import { Smile, Meh, Frown } from "lucide-react";

export const MOODS = [
  { icon: Smile, emoji: "😊", label: "Happy", value: "happy", className: "text-green-500" },
  { icon: Meh, emoji: "😐", label: "Neutral", value: "neutral", className: "text-yellow-500" },
  { icon: Frown, emoji: "😞", label: "Sad", value: "disappointed", className: "text-red-500" },
];

export const FEATURES = [
  { id: "ai-gen", label: "AI Generation" },
  { id: "search", label: "Search" },
  { id: "reports", label: "Reports" },
];

export const RATING_LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];

export const INITIAL_FORM = { name: "", email: "", message: "" };
export const INITIAL_ERRORS = { name: "", email: "", message: "" };
