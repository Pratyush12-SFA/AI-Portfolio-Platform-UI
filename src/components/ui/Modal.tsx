import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthClass?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidthClass = "max-w-2xl",
}: ModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-6 no-print animate-fadeIn">
      {/* Backdrop click close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className={`w-full ${maxWidthClass} bg-ascend-surface-elevated border border-ascend-border rounded-dialog shadow-floating p-6 flex flex-col relative z-10 animate-scaleUp max-h-[90vh] overflow-hidden`}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b border-ascend-border pb-3 shrink-0">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-ascend-text-secondary hover:text-white rounded-button hover:bg-white/5 transition-colors"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-5 select-none pr-1">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="flex justify-end gap-2 border-t border-ascend-border pt-4 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
