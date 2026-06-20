import * as React from "react";
import PropTypes from "prop-types";

import { cn } from "@/lib/utils";

function Card({ className = "", size = "default", ...props }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-4xl bg-card py-(--card-spacing) text-sm text-card-foreground shadow-md ring-1 ring-foreground/5 [--card-spacing:--spacing(6)] has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(4)] dark:ring-foreground/10 *:[img:first-child]:rounded-t-4xl *:[img:last-child]:rounded-b-4xl",
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className = "", ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1.5 rounded-t-4xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className = "", ...props }) {
  return (
    <div
      data-slot="card-title"
      className={cn("font-heading text-base font-medium", className)}
      {...props}
    />
  );
}

function CardDescription({ className = "", ...props }) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardAction({ className = "", ...props }) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  );
}

function CardContent({ className = "", ...props }) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  );
}

function CardFooter({ className = "", ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-4xl px-(--card-spacing) [.border-t]:pt-(--card-spacing)",
        className
      )}
      {...props}
    />
  );
}

// PropTypes
Card.propTypes = {
  className: PropTypes.string,
  size: PropTypes.oneOf(["default", "sm"]),
};

CardHeader.propTypes = {
  className: PropTypes.string,
};

CardTitle.propTypes = {
  className: PropTypes.string,
};

CardDescription.propTypes = {
  className: PropTypes.string,
};

CardAction.propTypes = {
  className: PropTypes.string,
};

CardContent.propTypes = {
  className: PropTypes.string,
};

CardFooter.propTypes = {
  className: PropTypes.string,
};

// Default props
Card.defaultProps = {
  className: "",
  size: "default",
};

CardHeader.defaultProps = {
  className: "",
};

CardTitle.defaultProps = {
  className: "",
};

CardDescription.defaultProps = {
  className: "",
};

CardAction.defaultProps = {
  className: "",
};

CardContent.defaultProps = {
  className: "",
};

CardFooter.defaultProps = {
  className: "",
};

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
