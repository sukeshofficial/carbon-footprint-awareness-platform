import { Toaster } from "./components/ui/sonner";
import { UnderDevelopmentBadge } from "./components/ui/underDevelopmentBadge/under-development-badge";
import { FeedbackSheet } from "./components/ui/feedbackSheet/feedback-sheet";

function App() {
  return (
    <>
      <UnderDevelopmentBadge />
      <FeedbackSheet />
      <Toaster
        position="bottom-right"
        closeButton
        richColors={false}
        toastOptions={{
          classNames: {
            toast: "rounded-xl border border-border",
            title: "text-foreground font-semibold",
            description: "text-muted-foreground",
          },
        }}
      />
    </>
  );
}

export default App;