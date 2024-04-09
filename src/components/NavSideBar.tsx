"use client";
import { useState } from "react";
import clsx from "clsx";
// import { useNavigate } from "react-router-dom";
import CommonIcon from "./common/CommonIcon";
import { sidebarMenu } from "@/constant/navigation.constant";

const NavSideBar = () => {
  // const router = useNavigate();
  const [showMenu, setShowMenu] = useState("");
  const [showNestedMenu, setShowNestedMenu] = useState("");
  const [isOpen, setIsopen] = useState(true);
  // handle parent menu click
  const menuClick = (menu: any) => {
    // menu?.routerLink && router(menu?.routerLink);
    setShowMenu(menu.name);
    setShowNestedMenu("");
  };

  //  handle nested menu click
  const nestedMenuClick = (menu: any) => {
    setShowNestedMenu(menu.name);
    // router(menu?.routerLink);
  };

  // This function is use for collapsed side nav;
  const collapsedNavClick = (e: any) => {
    // props.width(e);
    setIsopen(e);
  };

  return (
    <nav
      className={clsx(
        "z-40 fixed bg-white  ml-[-235px] left-[235px] bottom-0 top-0 overflow-x-hidden overflow-y-scroll border-0 whitespace-nowrap pb-12 pt-16",
        isOpen ? "w-56" : "w-16"
      )}
    >
      {sidebarMenu.map((menu) => {
        return (
          <div
            key={menu.name}
            className=" list-none float-left w-full cursor-pointer"
          >
            <p
              className={clsx(
                "p-3 flex items-center text-[#808593] border-l-4 border-primary border-opacity-0 hover:text-primary hover:bg-secondary hover:border-opacity-100",
                showMenu === menu.name
                  ? "bg-secondary text-primary border-opacity-100"
                  : ""
              )}
              onClick={() => menuClick(menu)}
            >
              <span className="hover:text-primary">
                <CommonIcon icon={`${menu.icon}`} />
              </span>
              <span className="ml-2">{menu.name}</span>
            </p>
            {showMenu === menu.name &&
              menu.nestedMenu &&
              menu.nestedMenu.length > 0 && (
                <>
                  {menu.nestedMenu.map((nMenu) => (
                    <p
                      key={nMenu.name}
                      onClick={() => nestedMenuClick(nMenu)}
                      className={clsx(
                        "pl-[35px] py-2 float-left w-full text-[#808593] hover:text-primary",
                        showNestedMenu === nMenu.name ? "text-primary " : ""
                      )}
                    >
                      {nMenu.name}
                    </p>
                  ))}
                </>
              )}
          </div>
        );
      })}
      <div
        className={clsx(
          "toggle-button fixed bottom-0 p-3  text-primary bg-white cursor-pointer text-center",
          isOpen ? "w-[210px]" : "w-[64px]"
        )}
        onClick={() => collapsedNavClick(!isOpen)}
      >
        <span className="text-base">
          {isOpen ? "<< Collapse Sidebar" : ">>"}
        </span>
      </div>
    </nav>
  );
};

export default NavSideBar;

export const NavSideBar2 = ({ closeSidear }: any) => {
  // const router = useNavigate();
  const [showMenu, setShowMenu] = useState("");
  const [showNestedMenu, setShowNestedMenu] = useState("");
  const menuClick = (menu: any) => {
    // menu?.routerLink && router(menu?.routerLink);
    setShowMenu(menu.name);
    setShowNestedMenu("");
  };

  const nestedMenuClick = (menu: any) => {
    setShowNestedMenu(menu.name);
    // router(menu?.routerLink);
  };

  return (
    <div className="z-50 fixed w-full h-full overflow-y-scroll overflow-x-hidden">
      {sidebarMenu.map((menu) => {
        return (
          <div key={menu.name} className=" list-none w-full cursor-pointer">
            <div
              className={clsx(
                "p-3 flex justify-between items-center text-[#808593] border-l-4 border-primary border-opacity-0 hover:text-primary hover:bg-secondary hover:border-opacity-100",
                showMenu === menu.name
                  ? "bg-secondary text-primary border-opacity-100"
                  : ""
              )}
              onClick={() => {
                menuClick(menu);
                if (!menu?.nestedMenu?.length) {
                  closeSidear();
                }
              }}
            >
              <p className="flex items-center">
                <CommonIcon icon={`${menu.icon}`} />
                <span className="ml-2">{menu.name}</span>
              </p>
              {menu?.nestedMenu?.length && (
                <span className="pr-4">
                  <CommonIcon icon="iconamoon:arrow-down-2-thin" />
                </span>
              )}
            </div>
            {showMenu === menu.name &&
              menu.nestedMenu &&
              menu.nestedMenu.length > 0 && (
                <>
                  {menu.nestedMenu.map((nMenu) => (
                    <p
                      key={nMenu.name}
                      onClick={() => {
                        nestedMenuClick(nMenu);
                        closeSidear();
                      }}
                      className={clsx(
                        "pl-[35px] py-2 float-left w-full text-[#808593] hover:text-primary",
                        showNestedMenu === nMenu.name ? "text-primary " : ""
                      )}
                    >
                      {nMenu.name}
                    </p>
                  ))}
                </>
              )}
          </div>
        );
      })}
    </div>
  );
};
