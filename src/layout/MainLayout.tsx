import { useEffect, useLayoutEffect, useRef } from "react";
import type React from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";
import Sidebar from "../components/navs/Sidebar";
import TopNav from "../components/navs/TopNav";
import { navItems } from "../lib/navitems";
import { useUser } from "../contexts/user/UserContext";

type LayoutProps = {
  children: React.ReactNode;
  pageName: string;
  showSearchBar?: boolean;
  showTopNav?: boolean;
};

const MainLayout = ({
  children,
  pageName,
  showSearchBar = true,
  showTopNav = true,
}: LayoutProps) => {
  useEffect(() => {
    document.title = "ElectraFlow - " + pageName;
  }, [pageName]);

  const location = useLocation();
  const mainContentRef = useRef<HTMLDivElement | null>(null);
  const { role } = useUser();
  const mobileLinks = navItems.filter((item) => {
    return item.role.includes(role ?? "");
  });

  const hasManyMobileLinks = mobileLinks.length > 5;
  const pageVariants: Variants = {
    initial: {
      opacity: 0,
      x: -20,
    },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1.0,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 1.0,
        ease: "easeInOut",
      },
    },
  };

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const style = document.createElement("style");
    style.textContent = `
      .main-content {
          scroll-behavior: smooth;
          -webkit-overflow-scrolling: touch;
          overflow-anchor: none;
          scroll-padding-top: 80px;
          overscroll-behavior-y: contain;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useLayoutEffect(() => {
    const scrollToTop = () => {
      if (mainContentRef.current) {
        mainContentRef.current.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      setTimeout(() => {
        if (mainContentRef.current?.scrollTop !== 0) {
          mainContentRef.current?.scrollTo(0, 0);
        }
        if (window.scrollY !== 0) {
          window.scrollTo(0, 0);
        }
      }, 300);
    };

    const rafId = requestAnimationFrame(() => {
      scrollToTop();
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [location.pathname]);

  return (
    <div className="overflow-hidden h-screen w-full">
      <div className="mx-auto flex h-full w-full overflow-hidden bg-white">
        <div className="hidden h-full w-55 shrink-0 lg:block">
          <Sidebar setIsOpen={() => undefined} />
        </div>

        <div className="flex min-w-0 flex-1 flex-col bg-primary/10">
          <div className="flex h-16 shrink-0 items-center gap-4 border-b border-tableBorder bg-white px-4 md:px-6">
            <div className="flex items-center gap-3 lg:hidden">
              
              <span className="text-sm font-bold text-primary">
                ElectraFlow
              </span>
            </div>

            {showTopNav && <TopNav showSearchBar={showSearchBar} />}
          </div>

          <div
            ref={mainContentRef}
            className="main-content min-h-0 flex-1 overflow-y-auto px-4 py-5 pb-24 md:px-6 lg:pb-6"
            style={{
              WebkitOverflowScrolling: "touch",
              overscrollBehaviorY: "contain",
            }}
            tabIndex={-1}
          >
            <AnimatePresence mode="wait">
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                style={{
                  minHeight: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      <nav
        className={`fixed inset-x-3 bottom-3 z-50 grid gap-2 rounded-2xl border border-tableBorder bg-white/95 px-2 py-2 shadow-xl shadow-primary/15 backdrop-blur lg:hidden ${
          hasManyMobileLinks
            ? "auto-cols-[72px] grid-flow-col overflow-x-auto no-scrollbar"
            : ""
        }`}
        style={
          hasManyMobileLinks
            ? undefined
            : {
                gridTemplateColumns: `repeat(${Math.max(mobileLinks.length, 1)}, minmax(0, 1fr))`,
              }
        }
      >
        {mobileLinks.map((item) => (
          <NavLink
            key={item.path}
            to={item.path!}
            className={({ isActive }) =>
              `flex h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-2 text-[11px] font-semibold transition sm:flex-row sm:gap-2 sm:text-xs ${
                isActive
                  ? "bg-tetiary text-primary"
                  : "text-fadedBlack hover:text-primary"
              }`
            }
          >
            <item.icon size={18} />
            <span className="max-w-full truncate">{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default MainLayout;
