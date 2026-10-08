import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Pops up briefly after each star catch to show the love reason.
 * Auto-dismisses after 2.2 seconds.
 */
const LoveReasonCard = ({ reason }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(timer);
  }, [reason]);

  return (
    <AnimatePresence>
      {visible && reason && (
        <motion.div
          key={reason}
          initial={{ opacity: 0, y: 30, scale: 0.85 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-24 left-1/2 z-40 -translate-x-1/2 w-[88vw] max-w-sm"
        >
          <div
            className="rounded-2xl mb-30 px-5 py-4 text-center border border-pink-400/30 backdrop-blur-md"
            style={{
              background: "linear-gradient(135deg, rgba(177,26,112,0.25), rgba(237,102,178,0.15))",
              boxShadow: "0 0 20px rgba(177,26,112,0.3)",
              fontFamily: "Dancing Script, cursive",
            }}
          >
            <p className="text-pink-200 text-xl font-semibold leading-snug">
              {reason}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoveReasonCard;