import { motion } from "framer-motion";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-6">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="w-2 h-2 rounded-full bg-primary"
              animate={{
                opacity: [0.3, 1, 0.3],
                y: [0, -4, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: dot * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
