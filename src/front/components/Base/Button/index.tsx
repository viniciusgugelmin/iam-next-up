interface IButtonProps {
  children: any;
  onClick?: () => any;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  color?: string;
}

export const Button = ({
  children,
  onClick = () => {},
  className = "",
  disabled,
  type = "button",
  color = "",
}: IButtonProps) => {
  const buttonClasses = [color ? ` up-button--${color}` : ""];

  return (
    <button
      type={type}
      onClick={onClick}
      className={`up-button ${className} ${buttonClasses.join("")}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
