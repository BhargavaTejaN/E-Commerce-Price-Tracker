import Image from "next/image";
import Link from "next/link";
import React from "react";

const navIcons = [
  {
    src: "/assets/icons/search.svg",
    alt: "search",
    id: 1,
  },
  {
    src: "/assets/icons/black-heart.svg",
    alt: "search",
    id: 2,
  },
  {
    src: "/assets/icons/user.svg",
    alt: "search",
    id: 3,
  },
];

const NavBar = () => {
  return (
    <header className="w-full">
      <nav className="nav">
        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/assets/icons/logo.svg"
            width={27}
            height={27}
            alt="logo"
          />
          <p className="nav-logo">
            PRICE<span className="text-primary">WISE</span>
          </p>
        </Link>
        <div className="flex items-center gap-5">
          {navIcons.map((each) => (
            <Image
              key={each.id}
              src={each.src}
              alt={each.alt}
              height={28}
              width={28}
              className="object-contain cursor-pointer"
            />
          ))}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
