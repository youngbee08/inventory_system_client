import { motion } from "framer-motion";
import type { IconType } from "react-icons";

type StatusTone = "pending" | "in_transit" | "completed" | "cancelled";

interface StatusCardProps {
  label: string;
  count: string | number;
  icon?: IconType;
  tone: StatusTone;
  description?: string;
}

const statusToneClasses = {
  pending: {
    border: "border-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  in_transit: {
    border: "border-blue-200",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
  },
  completed: {
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  cancelled: {
    border: "border-red-200",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
  },
};

const StatusCard = ({
  label,
  count,
  icon: Icon,
  tone,
  description,
}: StatusCardProps) => {
  const toneClasses = statusToneClasses[tone];

  return (
    <motion.article
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`rounded-md border bg-white p-4 shadow-sm shadow-primary/5 ${toneClasses.border}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={`size-2.5 rounded-full ${toneClasses.dot}`} />
          <p className="text-xs font-bold text-tableHeading">{label}</p>
        </div>

        {Icon && (
          <span
            className={`grid size-8 place-items-center rounded-md ${toneClasses.bg} ${toneClasses.text}`}
          >
            <Icon size={17} />
          </span>
        )}
      </div>

      <p className="mt-4 text-2xl font-extrabold text-tableHeading">{count}</p>
      {description && (
        <p className="mt-1 text-xs leading-5 text-tableData">{description}</p>
      )}
    </motion.article>
  );
};

export default StatusCard;
