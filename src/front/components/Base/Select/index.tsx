import { useState } from "react";

interface ISelectProps {
  placeholder?: string;
  className?: string;
  options: string[][];
  name: string;
  value: string;
  onChange: (event: any) => void;
  error?: string;
  color?: string;
  required?: boolean;
}

export const Select = ({
  placeholder = "",
  className = "",
  options = [],
  name,
  value,
  onChange,
  error = "",
  color = "",
  required = false,
}: ISelectProps) => {
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
    <div className="up-input up-input--select">
      <div className={`up-input__container${inputContainerClasses.join("")}`}>
        {placeholder && (
          <label
            className={`up-input__label${inputLabelClasses.join("")}`}
            htmlFor={name}
          >
            {placeholder}
          </label>
        )}
        <select
          className={`up-input__el ${className}`}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
        >
          {options.map((option, index) => (
            <option key={index} value={option[0]}>
              {option[1]}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <div className="up-alert up-alert--small up-alert--danger">{error}</div>
      )}
    </div>
  );
};
