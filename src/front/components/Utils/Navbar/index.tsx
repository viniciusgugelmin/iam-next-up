import { useState } from "react";
import { NavbarOption } from "./NavbarOption";

export const Navbar = () => {
  const [navbarOptions, setOptions] = useState([
    {
      name: "Dashboards",
      isActive: false,
      options: [
        {
          name: "Lorem ipsum",
          route: "/dashboard",
          isActive: false,
        },
      ],
    },
    {
      name: "Products",
      isActive: false,
      options: [
        {
          name: "Lorem ipsum",
          route: "/products",
          isActive: false,
        },
      ],
    },
  ]);

  const handleSubOptionClick = (
    optionIndex: number,
    subOptionIndex: number
  ) => {
    setOptions(
      navbarOptions.map((item, itemIndex) => {
        item.options.map((subItem, subItemIndex) => {
          if (itemIndex === optionIndex && subItemIndex === subOptionIndex) {
            subItem.isActive = !subItem.isActive;
            return subItem;
          }

          subItem.isActive = false;
          return subItem;
        });

        return item;
      })
    );
  };

  const handleOptionClick = (titleIndex: number) => {
    setOptions(
      navbarOptions.map((item, itemIndex) => {
        if (itemIndex === titleIndex) {
          item.isActive = !item.isActive;
          return item;
        }

        item.isActive = false;
        return item;
      })
    );
  };

  return (
    <aside className="up-navbar">
      <h1>Go Drink</h1>
      {navbarOptions.map((item, index) => (
        <NavbarOption
          key={index}
          optionIndex={index}
          {...item}
          handleSubOptionClick={handleSubOptionClick}
          handleOptionClick={handleOptionClick}
        />
      ))}
    </aside>
  );
};
