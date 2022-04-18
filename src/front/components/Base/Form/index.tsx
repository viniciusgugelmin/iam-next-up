interface IFormProps {
  className?: string;
  children: any;
  onSubmit: (e: any) => void;
  color?: string;
  title?: string;
}

export const Form = ({
  className = "",
  children,
  onSubmit,
  color = "",
  title = "",
}: IFormProps) => {
  const formClasses = [color ? ` up-form--${color}` : ""];

  return (
    <form className={`up-form ${className} ${formClasses}`} onSubmit={onSubmit}>
      {title && <h2 className="up-form__title">{title}</h2>}
      {children}
    </form>
  );
};
