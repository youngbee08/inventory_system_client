import { useRef, useState } from "react";
import type React from "react";
import { IoSearchOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { PiBellSimple, PiGear, PiSignOut } from "react-icons/pi";
import { useUser } from "../../contexts/user/UserContext";
import { getInitials } from "../../utility/formatterUtilities";

interface TopNavProps {
  showSearchBar?: boolean;
}

const TopNav: React.FC<TopNavProps> = ({ showSearchBar = true }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { logout, user } = useUser();

  const handleLogout = () => {
    logout();
  };

  const splitted_name = user?.name.split(" ");

  const firstName = splitted_name?.[0] || "John";
  const lastName = splitted_name?.[1] || "Doe";
  const initials = getInitials(firstName, lastName);
  return (
    <header className="w-full flex gap-3 items-center justify-between">
      {showSearchBar && (
        <div className="hidden md:block w-full max-w-107.5">
          <label
            htmlFor="searchBox"
            className="border border-tableBorder rounded-md bg-white flex gap-3 items-center h-10 w-full px-4 shadow-sm shadow-primary/5"
          >
            <IoSearchOutline size={17} className="text-fadedBlack" />
            <input
              type="text"
              id="searchBox"
              className="border-0 outline-0 h-full w-full text-xs bg-transparent text-tableHeading placeholder:text-fadedBlack"
              placeholder="Search"
              autoComplete="off"
            />
          </label>
        </div>
      )}

      <div className="ml-auto flex gap-4 items-center">
        <Link
          to="/dashboard/notifications"
          className="relative grid size-10 place-items-center rounded-full text-fadedBlack transition hover:bg-tetiary hover:text-primary"
        >
          <PiBellSimple size={20} className="transition" />
        </Link>

        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 hover:opacity-80 transition"
          >
            <div className="size-9 rounded-full overflow-hidden bg-primary/15 text-primary uppercase flex items-center justify-center text-xs font-bold ring-2 ring-primary/10">
              {initials}
            </div>
            <span className="hidden sm:block text-xs font-semibold text-tableHeading">
              {firstName} {lastName}
            </span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-3 w-45 bg-white rounded-lg shadow-lg border border-tableBorder py-2 z-50">
              <Link
                to="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-tetiary transition"
                onClick={() => setIsDropdownOpen(false)}
              >
                <PiGear size={18} className="text-fadedBlack" />
                <span className="text-sm">Settings</span>
              </Link>

              <div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-red-50 text-red-600 transition cursor-pointer"
                >
                  <PiSignOut size={18} />
                  <span className="text-sm font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
