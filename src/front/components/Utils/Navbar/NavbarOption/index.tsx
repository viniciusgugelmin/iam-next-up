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
      <h2 onClick={() => handleOptionClick(optionIndex)}>{name}</h2>
      {isActive && (
        <ul>
          {options.map((item, subOptionIndex) => (
            <li
              key={subOptionIndex}
              onClick={() => handleSubOptionClick(optionIndex, subOptionIndex)}
              className={item.isActive ? "active" : ""}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
