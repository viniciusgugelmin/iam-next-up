import { useContext, useState } from "react";
import { NavbarOption } from "./NavbarOption";
import { useRouter } from "next/router";
import { checkIfHasPermission } from "../../../services/checkIfUserHasPermission";
import authContext from "../../../stores/AuthContext";

export const Navbar = () => {
  const router = useRouter();
  const context = useContext(authContext);
  const [navbarOptions, setOptions] = useState([
    {
      name: "Users",
      blocked: !checkIfHasPermission(context.user, "users", "read", false),
      isActive: checkIfOptionInitActive("users"),
      options: [
        {
          name: "List",
          route: "users/list",
          isActive: checkIfSubOptionInitActive("users/list"),
        },
        {
          name: "Form",
          route: "users/form",
          isActive: checkIfSubOptionInitActive("users/form"),
        },
      ],
    },
  ]);

  function checkIfOptionInitActive(option: string) {
    return router.pathname.startsWith(`/home/${option.toLowerCase()}`);
  }

  function checkIfSubOptionInitActive(subOption: string) {
    return router.pathname.startsWith(`/home/${subOption.toLowerCase()}`);
  }

  const handleSubOptionClick = (
    optionIndex: number,
    subOptionIndex: number
  ) => {
    setOptions(
      navbarOptions.map((item, itemIndex) => {
        item.options.map((subItem, subItemIndex) => {
          if (itemIndex === optionIndex && subItemIndex === subOptionIndex) {
            subItem.isActive = true;
            router.push(`/home/${subItem.route}`);

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
        if (item.blocked) {
          return item;
        }

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
      <h1 className="up-navbar__title">Go Drink</h1>
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
