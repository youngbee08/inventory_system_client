import { motion } from "framer-motion";
import type { IconType } from "react-icons";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: IconType;
  subtitle?: string;
}

const StatCard = ({ title, value, icon: Icon, subtitle }: StatCardProps) => {
  return (
    <motion.article className="group relative overflow-hidden rounded-md border border-tableBorder/60 bg-white p-5 shadow-sm">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-primary/5 blur-2xl transition-all" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium tracking-wide text-tableData">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-tableHeading">
            {value}
          </h2>

          {subtitle && (
            <p className="mt-2 text-xs text-tableData/80">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className="flex h-14 w-14 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon size={24} />
          </div>
        )}
      </div>
    </motion.article>
  );
};

export default StatCard;
