import type React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

const SectionHeader = ({ title, subtitle, action }: SectionHeaderProps) => {
  return (
    <div className="flex gap-3 items-start justify-between">
      <div>
        <h2 className="text-sm font-bold text-tableHeading">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-xs leading-5 text-tableData">{subtitle}</p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export default SectionHeader;
