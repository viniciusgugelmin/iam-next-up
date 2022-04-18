import { useState } from "react";

interface IInputProps {
  placeholder?: string;
  className?: string;
  type: string;
  name: string;
  value: string;
  onChange: (event: any) => void;
  error?: string;
  color?: string;
  required?: boolean;
}

export const Input = ({
  placeholder = "",
  className = "",
  type,
  name,
  value,
  onChange,
  error = "",
  color = "",
  required = false,
}: IInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const inputContainerClasses = [
    color ? ` up-input__container--${color}` : "",
    error ? " up-input__container--error" : "",
    isFocused || value ? " up-input__container--active" : "",
  ];

  const inputLabelClasses = [
    color ? ` up-input__label--${color}` : "",
    isFocused || value ? " up-input__label--active" : "",
  ];

  return (
    <div className="up-input">
      <div className={`up-input__container${inputContainerClasses.join("")}`}>
        {placeholder && (
          <label
            className={`up-input__label${inputLabelClasses.join("")}`}
            htmlFor={name}
          >
            {placeholder}
          </label>
        )}
        <input
          className={`up-input__el ${className}`}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
        />
      </div>
      {error && (
        <div className="up-alert up-alert--small up-alert--danger">{error}</div>
      )}
    </div>
  );
};
