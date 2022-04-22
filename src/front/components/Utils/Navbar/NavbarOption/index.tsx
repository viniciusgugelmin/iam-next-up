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
  return (
    <>
      <h2
        className={
          "up-navbar__option" + (isActive ? " up-navbar__option--active" : "")
        }
        onClick={() => handleOptionClick(optionIndex)}
        title={name}
      >
        {name}
      </h2>

      <ul
        className={
          "up-navbar__sub-options" +
          (isActive
            ? " up-navbar__sub-options--active"
            : " up-navbar__sub-options--hidden")
        }
      >
        {options.map((item, subOptionIndex) => (
          <li
            key={subOptionIndex}
            onClick={() => handleSubOptionClick(optionIndex, subOptionIndex)}
            className={
              "up-navbar__sub-option" +
              (item.isActive ? " up-navbar__sub-option--active" : "")
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
