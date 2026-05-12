
interface EmptyStateProps {
  title?: string;
  message?: string;
}

const EmptyState = ({
  title = "No records found",
  message = "There is no information to show for this section yet.",
}: EmptyStateProps) => {
  return (
    <div className="flex min-h-36 flex-col items-center justify-center text-center">
      
      <h3 className="mt-4 text-sm font-bold text-tableHeading">{title}</h3>
      <p className="mt-1 max-w-sm text-xs leading-5 text-tableData">
        {message}
      </p>
    </div>
  );
};

export default EmptyState;
