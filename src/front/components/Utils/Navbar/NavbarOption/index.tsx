import { useRef } from "react";

interface INavbarOptionProps {
  optionIndex: number;
  name: string;
  isActive: boolean;
  options: Array<INavbarSubOptionsProps>;
  handleSubOptionClick: (optionIndex: number, subOptionIndex: number) => void;
  handleOptionClick: (titleIndex: number) => void;
}

interface INavbarSubOptionsProps {
  name: string;
  route: string;
  blocked: boolean;
  isActive: boolean;
}

export const NavbarOption = ({
  optionIndex,
  name,
  isActive,
  options,
  handleSubOptionClick,
  handleOptionClick,
}: INavbarOptionProps) => {
  const listRef = useRef<HTMLUListElement>(null);

  return (
    <>
      <h2
        className={
          "up-navbar__option" +
          (isActive ? " up-navbar__option--active" : "") +
          (options.length === 0 ? " up-navbar__option--has-sub-options" : "")
        }
        onClick={() => handleOptionClick(optionIndex)}
        title={name}
      >
        {name}
      </h2>

      <ul
        ref={listRef}
        className={
          "up-navbar__sub-options" +
          (isActive
            ? " up-navbar__sub-options--active"
            : " up-navbar__sub-options--hidden")
        }
        style={{
          minHeight: isActive ? listRef.current?.scrollHeight : 0,
        }}
      >
        {options.map((item, subOptionIndex) => (
          <li
            key={subOptionIndex}
            onClick={() => handleSubOptionClick(optionIndex, subOptionIndex)}
            className={
              "up-navbar__sub-option" +
              (item.isActive ? " up-navbar__sub-option--active" : "") +
              (item.blocked ? " up-navbar__sub-option--blocked" : "")
            }
            title={item.name}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </>
  );
};
