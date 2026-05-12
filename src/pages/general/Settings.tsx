import type React from "react";
import { useUser } from "../../contexts/user/UserContext";

const inputClass =
  "h-10 w-full rounded-md border border-tableBorder bg-white px-4 text-xs text-tableHeading shadow-sm shadow-primary/5 outline-0 transition placeholder:text-fadedBlack focus:border-primary/40 focus:ring-2 focus:ring-primary/10 disabled:bg-secondary disabled:text-tableData";

const Settings: React.FC = () => {
  const { user } = useUser();

  return (
    <section className="flex min-w-0 flex-col gap-5 pb-20">
      <div>
        <h1 className="text-xl font-extrabold text-tableHeading">Settings</h1>
        <p className="mt-2 text-sm leading-6 text-tableData">
          Review your profile information and account details.
        </p>
      </div>

      <div className="rounded-md border border-tableBorder bg-white p-4 shadow-sm shadow-primary/5 sm:p-5">
        <div className="flex items-start gap-3 border-b border-tableBorder pb-5">
          <div>
            <h2 className="text-base font-extrabold text-tableHeading">
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-tableData">
              Profile editing is not available yet.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-2 block text-xs font-bold text-tableHeading">
              Full Name
            </span>
            <input
              value={user?.name ?? ""}
              placeholder="Full name"
              className={inputClass}
              disabled
              readOnly
            />
          </label>

          <label>
            <span className="mb-2 block text-xs font-bold text-tableHeading">
              Email Address
            </span>
            <input
              value={user?.email ?? ""}
              placeholder="Email address"
              className={inputClass}
              disabled
              readOnly
            />
          </label>

          <label>
            <span className="mb-2 block text-xs font-bold text-tableHeading">
              Role
            </span>
            <input
              value={user?.role ?? ""}
              placeholder="Role"
              className={`${inputClass} capitalize`}
              disabled
              readOnly
            />
          </label>

          <label>
            <span className="mb-2 block text-xs font-bold text-tableHeading">
              User ID
            </span>
            <input
              value={user?._id ? String(user._id) : ""}
              placeholder="User ID"
              className={inputClass}
              disabled
              readOnly
            />
          </label>
        </div>
      </div>
    </section>
  );
};

export default Settings;
