interface IInputProps {
  placeholder?: string;
  className?: string;
  type: string;
  name: string;
  value: string;
  onChange: (event: any) => void;
  error?: string;
}

export const Input = ({
  placeholder = "",
  className = "",
  type,
  name,
  value,
  onChange,
  error = "",
}: IInputProps) => {
  return (
    <div className="up-input">
      <div
        className={`up-input__container ${
          error ? "up-input__container--error" : ""
        }`}
      >
        {placeholder && (
          <label className="up-input__label" htmlFor={name}>
            {placeholder}
          </label>
        )}
        <input
          className={`up-input__el ${className}`}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
        />
      </div>
      {error && (
        <div className="up-alert up-alert--small up-alert--danger">{error}</div>
      )}
    </div>
  );
};
