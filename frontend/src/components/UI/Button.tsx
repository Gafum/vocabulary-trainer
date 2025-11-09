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
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primaryBlue focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

   const variantClasses = {
      primary: "bg-primaryBlue text-white hover:bg-primaryBlue/90",
      secondary: "bg-primaryGrey/10 text-primaryGrey hover:bg-primaryGrey/20",
      danger: "bg-primaryRed text-white hover:bg-primaryRed/90",
      success: "bg-primaryGreen text-white hover:bg-primaryGreen/90",
      outline:
         "border border-primaryGrey text-primaryGrey hover:bg-primaryGrey/10",
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
