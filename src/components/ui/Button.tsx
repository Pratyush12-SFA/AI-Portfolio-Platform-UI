import React from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ai";
  label?: string;
  isLoading?: boolean;
  icon?: React.ComponentType<any>;
}

export default function Button({
  variant = "secondary",
  label,
  isLoading,
  icon: Icon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyle =
    "inline-flex items-center justify-center gap-2 font-semibold text-xs tracking-wide transition-all duration-200 focus-ring-ascend disabled:opacity-50 disabled:pointer-events-none rounded-button select-none py-2.5 px-4 cursor-pointer";

  const variants = {
    primary:
      "bg-ascend-primary text-black hover:bg-ascend-primary/90 hover:shadow-card font-bold",
    secondary:
      "bg-white/5 border border-ascend-border hover:bg-white/10 hover:border-white/15 text-white",
    ai:
      "bg-gradient-to-r from-ascend-primary to-ascend-ai text-white hover:shadow-floating font-black border border-white/10 relative overflow-hidden group shadow-lg",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : Icon ? (
        <Icon className="w-3.5 h-3.5 shrink-0" />
      ) : variant === "ai" ? (
        <Sparkles className="w-3.5 h-3.5 fill-current text-white shrink-0" />
      ) : null}
      {label || children}
    </button>
  );
}
