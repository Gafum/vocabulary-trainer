import React from "react";
import * as LucideIcons from "lucide-react";

type IconName = keyof typeof LucideIcons;

interface IconProps {
   name: IconName;
   size?: number;
   color?: string;
   className?: string;
}

export const Icon: React.FC<IconProps> = ({
   name,
   size = 20,
   color = "currentColor",
   className = "",
}) => {
   // Type assertion до React Component
   const LucideIcon = LucideIcons[name] as React.ComponentType<any>;

   if (!LucideIcon) {
      console.error(`Icon "${name}" not found in lucide-react`);
      return null;
   }

   return <LucideIcon size={size} color={color} className={className} />;
};
