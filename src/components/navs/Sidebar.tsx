import { useState } from "react";
import type React from "react";
import { NavLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import {  MdSettings } from "react-icons/md";
import { navItems } from "../../lib/navitems";
import { useUser } from "../../contexts/user/UserContext";
import Modal from "../modals/Modal";

const Sidebar = ({
  setIsOpen,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [showLogOutModal, setShowLogOutModal] = useState<boolean>(false);
  const { role, logout } = useUser();

  const filteredLinks = navItems.filter((item) => {
    return item.role.includes(role ?? "");
  });

  return (
    <aside className="bg-secondary lg:w-full md:w-80 w-[82vw] h-full px-5 py-5 flex flex-col">
      <div className="flex items-center gap-3 px-1 pb-8">
        <h3 className="text-sm font-bold text-primary tracking-tight">
          ElectraFlow
        </h3>
      </div>

      <ul className="flex flex-col gap-2 overflow-y-scroll no-scrollbar pb-6">
        {filteredLinks.map((item, index) => {
          return (
            <NavLink
              key={index}
              to={item.path!}
              className={({ isActive }) =>
                `nav-item relative -mx-5 flex items-center gap-4 px-6 py-3 rounded-md text-sm transition-all duration-300 cursor-pointer
  ${isActive ? "nav-active" : "text-fadedBlack hover:text-primary"}`
              }
              onClick={() => setIsOpen(false)}
            >
              <span className="grid size-7 place-items-center">
                <item.icon size={17} />
              </span>
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </ul>

      <ul className="pt-4 border-t border-tableBorder flex flex-col gap-1 justify-end mt-auto">
        <li>
          <NavLink
            to="/dashboard/settings"
            className={({ isActive }) =>
              `flex items-center gap-4 text-fadedBlack transition-all duration-300 px-1 py-3 rounded-md cursor-pointer text-sm hover:text-primary ${
                isActive ? "text-primary font-semibold" : ""
              }`
            }
          >
            <span className="grid size-7 place-items-center">
              <MdSettings size={17} />
            </span>
            <span>Settings</span>
          </NavLink>
        </li>

        <li>
          <button
            onClick={() => setShowLogOutModal(true)}
            className="flex items-center gap-4 text-fadedBlack transition-all duration-300 px-1 py-3 rounded-md cursor-pointer text-sm hover:text-red-500 w-full text-left"
          >
            <span className="grid size-7 place-items-center">
              <FiLogOut size={17} />
            </span>
            <span>Logout</span>
          </button>
        </li>
      </ul>

      {showLogOutModal && (
        <Modal onClose={() => setShowLogOutModal(false)} customMode>
          <div className="flex items-center flex-col bg-white rounded-xl py-6 px-8">
            {/* <img src={assets.logOutGif} alt="Logout GiF" className="" /> */}
            <h3 className="font-medium text-lg text-red-700">
              Are you sure you want to logout?
            </h3>
            <div className="flex w-full mt-8 items-center gap-6">
              <button
                type="button"
                onClick={() => setShowLogOutModal(false)}
                className="bg-secondary text-xs rounded-md font-medium border border-primary/10 w-1/2 h-10 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={logout}
                className="bg-red-500 text-xs rounded-md font-medium text-white w-1/2 h-10 cursor-pointer"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </Modal>
      )}
    </aside>
  );
};

export default Sidebar;
