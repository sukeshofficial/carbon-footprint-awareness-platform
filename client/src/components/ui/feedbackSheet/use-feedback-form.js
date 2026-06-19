import { useState } from "react";
import { INITIAL_FORM, INITIAL_ERRORS, MOODS, FEATURES } from "./constants";

export function useFeedbackForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [submitting, setSubmitting] = useState(false);
  const [mood, setMood] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [features, setFeatures] = useState([]);
  const [anonymous, setAnonymous] = useState(false);

  // ── Validation ─────────────────────────────────────────────────────────────

  const validate = () => {
    const newErrors = { name: "", email: "", message: "" };
    let valid = true;

    if (!anonymous) {
      if (!form.name.trim()) {
        newErrors.name = "Full name is required.";
        valid = false;
      }
      if (!form.email.trim()) {
        newErrors.email = "Email address is required.";
        valid = false;
      } else if (!/^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/.test(form.email.slice(0, 320))) {
        newErrors.email = "Enter a valid email address.";
        valid = false;
      }
    }

    if (!form.message.trim()) {
      newErrors.message = "Please share at least a short note.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const toggleFeature = (id) =>
    setFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );

  const handleAnonymousToggle = (checked) => {
    setAnonymous(checked);
    if (checked) setErrors((prev) => ({ ...prev, name: "", email: "" }));
  };

  const buildMessage = () => {
    const selectedMood = MOODS.find((m) => m.value === mood);
    const selectedFeatures = FEATURES.filter((f) => features.includes(f.id))
      .map((f) => f.label)
      .join(", ");

    return [
      form.message.trim(),
      "",
      selectedMood ? `Experience: ${selectedMood.emoji} ${selectedMood.label}` : null,
      rating ? `Rating: ${"★".repeat(rating)}${"☆".repeat(5 - rating)} (${rating}/5)` : null,
      selectedFeatures ? `Most-used features: ${selectedFeatures}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const resetAll = () => {
    setForm(INITIAL_FORM);
    setErrors(INITIAL_ERRORS);
    setSubmitting(false);
    setMood(null);
    setRating(0);
    setHoverRating(0);
    setFeatures([]);
    setAnonymous(false);
  };

  return {
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
  };
}
