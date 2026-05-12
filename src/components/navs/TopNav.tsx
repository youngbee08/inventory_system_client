import { useEffect, useRef, useState } from "react";
import type React from "react";
import { IoSearchOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { PiBellSimple, PiGear, PiSignOut } from "react-icons/pi";
import { useUser } from "../../contexts/user/UserContext";
import { getInitials } from "../../utility/formatterUtilities";
import { useDashboardSearch } from "../../hooks/useDashboardSearch";

interface TopNavProps {
  showSearchBar?: boolean;
}

const TopNav: React.FC<TopNavProps> = ({ showSearchBar = true }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { logout, role, user } = useUser();
  const { query, setQuery, results, isLoading, hasSearched } =
    useDashboardSearch(role);

  const handleLogout = () => {
    logout();
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  const handleResultClick = (route: string) => {
    closeSearch();
    setQuery("");
    navigate(route);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        closeSearch();
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const splitted_name = user?.name.split(" ");

  const firstName = splitted_name?.[0] || "John";
  const lastName = splitted_name?.[1] || "Doe";
  const initials = getInitials(firstName, lastName);
  return (
    <header className="w-full flex gap-3 items-center justify-between">
      {showSearchBar && (
        <div
          ref={searchRef}
          className="relative hidden w-full max-w-107.5 md:block"
        >
          <label
            htmlFor="searchBox"
            className="flex h-10 w-[70%] items-center gap-3 rounded-md border border-tableBorder bg-white px-4"
          >
            <IoSearchOutline size={17} className="text-fadedBlack" />
            <input
              type="text"
              id="searchBox"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  closeSearch();
                }
              }}
              className="h-full w-full border-0 bg-transparent text-xs text-tableHeading outline-0 placeholder:text-fadedBlack"
              placeholder="Search pages, deployments, materials..."
              autoComplete="off"
            />
          </label>

          {isSearchOpen && query.trim().length > 0 && (
            <div className="absolute left-0 top-full z-50 mt-2 w-full overflow-hidden rounded-md border border-tableBorder bg-white shadow-xl shadow-primary/10">
              <div className="max-h-90 overflow-y-auto py-2 styled-scrollbar">
                {isLoading && (
                  <div className="px-4 py-3 text-xs font-semibold text-tableData">
                    Searching dashboard...
                  </div>
                )}

                {!isLoading && results.length > 0 && (
                  <div className="flex flex-col">
                    {results.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => handleResultClick(result.route)}
                        className="flex w-full min-w-0 items-start gap-3 px-4 py-3 text-left transition hover:bg-tetiary focus:bg-tetiary focus:outline-none"
                      >
                        <span className="mt-0.5 rounded-md bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
                          {result.type}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-bold text-tableHeading">
                            {result.title}
                          </span>
                          <span className="mt-1 block truncate text-[11px] font-medium text-tableData">
                            {result.moduleLabel || result.description}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {!isLoading && hasSearched && results.length === 0 && (
                  <div className="px-4 py-5 text-center">
                    <p className="text-xs font-bold text-tableHeading">
                      No results found
                    </p>
                    <p className="mt-1 text-[11px] text-tableData">
                      Try a page, deployment, material, employee, or activity.
                    </p>
                  </div>
                )}

                {!isLoading && !hasSearched && (
                  <div className="px-4 py-3 text-xs font-semibold text-tableData">
                    Type at least 2 characters to search.
                  </div>
                )}
              </div>
            </div>
          )}
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
