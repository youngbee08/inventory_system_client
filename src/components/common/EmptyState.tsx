import type { IconType } from "react-icons";
import { PiTray } from "react-icons/pi";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: IconType;
}

const EmptyState = ({
  title = "No records found",
  message = "There is no information to show for this section yet.",
  icon: Icon = PiTray,
}: EmptyStateProps) => {
  return (
    <div className="flex min-h-36 flex-col items-center justify-center rounded-md border border-dashed border-outlineBlack bg-secondary px-5 py-8 text-center">
      <span className="grid size-10 place-items-center rounded-md bg-white text-fadedBlack shadow-sm shadow-primary/5">
        <Icon size={19} />
      </span>
      <h3 className="mt-4 text-sm font-bold text-tableHeading">{title}</h3>
      <p className="mt-1 max-w-sm text-xs leading-5 text-tableData">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
