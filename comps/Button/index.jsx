import PropTypes from "prop-types";

export const Button = ({
  children,
  onClick,
  className = "",
  disabled,
  type = "button",
}) => {
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

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
};
