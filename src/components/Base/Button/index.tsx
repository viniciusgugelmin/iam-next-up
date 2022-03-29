interface IButtonProps {
  children: any;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export const Button = ({
  children,
  onClick,
  className = "",
  disabled,
  type = "button",
}: IButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={"up-button " + className}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
