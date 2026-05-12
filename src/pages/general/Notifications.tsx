import type React from "react";
import { useNavigate } from "react-router-dom";
import { PiChartBar } from "react-icons/pi";

const Notifications: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="flex min-w-0 flex-col gap-5">
      <div>
        <h1 className="text-xl font-extrabold text-tableHeading">
          Notifications
        </h1>
        <p className="mt-2 text-sm leading-6 text-tableData">
          Important inventory and deployment updates will appear here.
        </p>
      </div>

      <div className="flex min-h-80 flex-col items-center justify-center text-center">
        <h2 className="mt-5 text-base font-extrabold text-tableHeading">
          No notifications yet
        </h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-tableData">
          Want to check activity logs now?
        </p>
        <button
          type="button"
          onClick={() => navigate("/general/activities")}
          className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-xs font-bold text-white shadow-sm shadow-primary/20 transition hover:bg-primary/90"
        >
          <PiChartBar size={16} />
          View Activity Log
        </button>
      </div>
    </section>
  );
};

export default Notifications;
