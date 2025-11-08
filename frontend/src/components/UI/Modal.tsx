import { useEffect, useRef } from "react";

interface ModalProps {
   isOpen: boolean;
   setOpen: (open: boolean) => void;
   children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, setOpen, children }) => {
   const ref = useRef<HTMLDivElement>(null);

   useEffect(() => {
      const handleKey = (e: KeyboardEvent) => {
         if (e.key === "Escape") setOpen(false);
      };
      const handleClick = (e: MouseEvent) => {
         if (ref.current && !ref.current.contains(e.target as Node))
            setOpen(false);
      };
      document.addEventListener("keydown", handleKey);
      document.addEventListener("mousedown", handleClick);
      return () => {
         document.removeEventListener("keydown", handleKey);
         document.removeEventListener("mousedown", handleClick);
      };
   }, [setOpen]);

   if (!isOpen) return "";

   return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
         <div
            ref={ref}
            className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
         >
            {children}
         </div>
      </div>
   );
};
