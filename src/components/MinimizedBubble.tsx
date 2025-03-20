import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye } from "lucide-react";

interface MinimizedBubbleProps {
  isActive?: boolean;
  onExpand?: () => void;
  position?: { x: number; y: number };
}

const MinimizedBubble = ({
  isActive = true,
  onExpand = () => {},
  position = { x: 20, y: 100 },
}: MinimizedBubbleProps) => {
  const [bubblePosition, setBubblePosition] = useState(position);
  const [isDragging, setIsDragging] = useState(false);

  // Handle window boundaries on resize
  useEffect(() => {
    const handleResize = () => {
      setBubblePosition((prevPos) => ({
        x: Math.min(prevPos.x, window.innerWidth - 60),
        y: Math.min(prevPos.y, window.innerHeight - 60),
      }));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.div
      className={`fixed z-50 flex items-center justify-center rounded-full shadow-lg cursor-grab ${isDragging ? "cursor-grabbing" : ""} ${isActive ? "bg-primary" : "bg-gray-400"}`}
      style={{
        width: "60px",
        height: "60px",
        left: bubblePosition.x,
        top: bubblePosition.y,
      }}
      drag
      dragConstraints={{
        left: 0,
        right: window.innerWidth - 60,
        top: 0,
        bottom: window.innerHeight - 60,
      }}
      dragElastic={0.1}
      dragMomentum={false}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(_, info) => {
        setIsDragging(false);
        setBubblePosition((prevPos) => ({
          x: prevPos.x + info.offset.x,
          y: prevPos.y + info.offset.y,
        }));
      }}
      onClick={() => !isDragging && onExpand()}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Eye className="text-white" size={24} />
      {isActive && (
        <motion.div
          className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        />
      )}
    </motion.div>
  );
};

export default MinimizedBubble;
