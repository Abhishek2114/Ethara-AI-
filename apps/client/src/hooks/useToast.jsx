import { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const icons = { success: CheckCircle, error: AlertCircle, info: Info };
  const colors = {
    success: "border-success/20 bg-success/5",
    error: "border-danger/20 bg-danger/5",
    info: "border-accent/20 bg-accent/5",
  };
  const iconColors = {
    success: "text-success",
    error: "text-danger",
    info: "text-accent",
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = icons[t.type] || Info;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                className={`flex items-center gap-3 rounded-lg border bg-card px-4 py-3 shadow-lg shadow-black/20 ${colors[t.type]}`}
              >
                <Icon size={16} className={iconColors[t.type]} />
                <span className="text-sm text-text">{t.message}</span>
                <button
                  onClick={() => setToasts((x) => x.filter((i) => i.id !== t.id))}
                  className="ml-2 rounded p-0.5 text-muted transition-colors hover:bg-elevated hover:text-text"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
