import React, {
  useState,
  createContext,
  useContext,
  useMemo
} from "react";
import PropTypes from "prop-types";
import { cn } from "../../lib/utils";

const TabsContext = createContext(null);

export function Tabs({ defaultValue, children, className = "" }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const contextValue = useMemo(
    () => ({ activeTab, setActiveTab }),
    [activeTab]
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("w-full", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

Tabs.propTypes = {
  defaultValue: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};

export function TabsList({ children, className = "" }) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-start gap-1 p-1 bg-slate-100 dark:bg-zinc-800/50 rounded-full mb-8 self-start shadow-inner border border-slate-200/50 dark:border-zinc-800",
        className
      )}
    >
      {children}
    </div>
  );
}

TabsList.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export function TabsTrigger({
  value,
  label,
  icon: Icon,
  className = "",
}) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      onClick={() => setActiveTab(value)}
      className={cn(
        "flex items-center gap-2 px-6 py-1.5 h-8 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300",
        isActive
          ? "bg-white text-slate-900 dark:bg-zinc-700 dark:text-zinc-50 shadow-sm"
          : "text-slate-500 hover:text-slate-900 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-white/50",
        className
      )}
    >
      {Icon && (
        <Icon
          size={12}
          className={cn(isActive ? "text-primary" : "opacity-40")}
        />
      )}
      {label}
    </button>
  );
}

TabsTrigger.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  className: PropTypes.string,
};

export function TabsContent({ value, children, className = "" }) {
  const { activeTab } = useContext(TabsContext);

  if (activeTab !== value) return null;

  return (
    <div
      className={cn(
        "animate-in fade-in slide-in-from-bottom-4 duration-700 outline-none",
        className
      )}
    >
      {children}
    </div>
  );
}

TabsContent.propTypes = {
  value: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
};
