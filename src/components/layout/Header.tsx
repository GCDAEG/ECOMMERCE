import React from "react";
import MobileMenu from "./mobile-menu/MobileMenu";
import NavBar from "./NavBar";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({}) => {
  return (
    <div className="grid grid-cols-1 grid-rows-2 h-20">
      {/* Desktop */}
      <NavBar></NavBar>
      {/* Mobile menu */}
      <MobileMenu></MobileMenu>
    </div>
  );
};

export default Header;
