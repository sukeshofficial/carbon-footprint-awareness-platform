import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";
import { IconCircleCheck, IconInfoCircle, IconAlertTriangle, IconAlertOctagon, IconLoader } from "@tabler/icons-react"

const Toaster = ({
  ...props
}) => {
  const { theme = "light" } = useTheme()

  return (
    <Sonner
      theme={/** @type {"light" | "dark" | "system"} */ (theme)}
      className="toaster group"
      icons={{
        success: (
          <IconCircleCheck className="size-4" />
        ),
        info: (
          <IconInfoCircle className="size-4" />
        ),
        warning: (
          <IconAlertTriangle className="size-4" />
        ),
        error: (
          <IconAlertOctagon className="size-4" />
        ),
        loading: (
          <IconLoader className="size-4 animate-spin" />
        ),
      }}
      style={
        /** @type {import("react").CSSProperties} */
        ({
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)"
        })
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
          title: "!text-foreground font-semibold",
          description: "!text-muted-foreground !opacity-100",
        },
      }}
      {...props} />
  );
}

export { Toaster }
