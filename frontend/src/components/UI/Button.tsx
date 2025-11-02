import React from "react";

export type ButtonVariant =
   | "primary"
   | "secondary"
   | "danger"
   | "success"
   | "outline";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
   variant?: ButtonVariant;
   size?: ButtonSize;
   fullWidth?: boolean;
   children: React.ReactNode;
   icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
   variant = "primary",
   size = "md",
   fullWidth = false,
   children,
   icon,
   className = "",
   ...props
}) => {
   const baseClasses =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

   const variantClasses = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
      danger: "bg-red-600 text-white hover:bg-red-700",
      success: "bg-green-600 text-white hover:bg-green-700",
      outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
   };

   const sizeClasses = {
      sm: "text-xs px-2 py-1",
      md: "text-sm px-4 py-2",
      lg: "text-base px-6 py-3",
   };

   const widthClass = fullWidth ? "w-full" : "";

   return (
      <button
         className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
         {...props}
      >
         {icon && <span>{icon}</span>}
         {children}
      </button>
   );
};
