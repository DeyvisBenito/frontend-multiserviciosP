import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function ConfirmarCompra({
  isOpen,
  onClose,
  hasConflict,
}: {
  isOpen: boolean;
  hasConflict: boolean;
  onClose: () => void;
}) {
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (isOpen && hasConflict && !hasShownToast.current) {
      toast.error("Algunos productos de la caja tienen conflicto", {
        description: "Por favor revise y despues confirme compra",
      });
      hasShownToast.current = true;
      onClose();
    }

    if (!isOpen) {
      hasShownToast.current = false;
    }
  }, [isOpen, hasConflict, onClose]);

  if (!isOpen || hasConflict) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow dark:bg-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Confirmacion de compra
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          >
            ✕
          </button>
        </div>
        <button
          onClick={onClose}
          type="submit"
          className="w-full bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
}
