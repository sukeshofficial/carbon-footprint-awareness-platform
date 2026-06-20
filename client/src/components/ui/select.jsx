import * as React from "react";
import PropTypes from "prop-types";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const Select = ({ children, value, onValueChange, className }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef(null);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (val) => {
    onValueChange(val);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {React.Children.map(children, (child) => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: handleToggle,
            value,
          });
        }

        if (child.type === SelectContent) {
          return (
            isOpen &&
            React.cloneElement(child, {
              onSelect: handleSelect,
              selectedValue: value,
            })
          );
        }

        return child;
      })}
    </div>
  );
};

Select.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string,
  onValueChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

const SelectTrigger = ({ children, value, onClick, className }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
  >
    {children}
    <ChevronDown className="h-4 w-4 opacity-50" />
  </button>
);

SelectTrigger.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

const SelectValue = ({ placeholder, value, children }) => (
  <span className="truncate">{value || placeholder || children}</span>
);

SelectValue.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.node,
};

const SelectContent = ({
  children,
  onSelect,
  selectedValue,
  className,
}) => (
  <div
    className={cn(
      "absolute top-full z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 zoom-in-95 mt-1 w-full",
      className
    )}
  >
    <div className="p-1">
      {React.Children.map(children, (child) => {
        if (child.type === SelectItem) {
          return React.cloneElement(child, {
            onClick: () => onSelect(child.props.value),
            isSelected: child.props.value === selectedValue,
          });
        }
        return child;
      })}
    </div>
  </div>
);

SelectContent.propTypes = {
  children: PropTypes.node,
  onSelect: PropTypes.func.isRequired,
  selectedValue: PropTypes.string,
  className: PropTypes.string,
};

const SelectItem = ({
  children,
  value,
  onClick,
  isSelected,
  className,
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "relative flex w-full select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer",
      isSelected && "bg-accent text-accent-foreground",
      className
    )}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      {isSelected && <Check className="h-4 w-4" />}
    </span>
    {children}
  </button>
);

SelectItem.propTypes = {
  children: PropTypes.node,
  value: PropTypes.string,
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
  className: PropTypes.string,
};

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
};
