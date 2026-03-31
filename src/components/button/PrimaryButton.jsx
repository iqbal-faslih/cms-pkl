import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const PrimaryButton = ({
  to,
  type = "button",
  color = "text-white",
  onClick,
  icon,
  iconPosition = "right",
  children,
  font = "font-medium",
  textSize = "text-sm",
  rounded = "rounded-sm",
  iconSize = 16,
  disabled = false,
}) => {
  const isReactComponent = typeof icon !== "string" && icon !== null && icon !== undefined;
  
  const renderIcon = () => {
    if (!icon) return null;
    
    if (isReactComponent) {
      const IconComponent = icon;
      return <IconComponent size={iconSize} className={color} aria-hidden="true" />;
    } else {
      return <i className={`bi ${icon} ${color}`} aria-hidden="true"></i>;
    }
  };

  const iconElement = renderIcon();

  const classNames = `
    py-3 px-5 
    ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-[#0D5EF4] hover:bg-[#0D42EF] cursor-pointer"} 
    ${color} ${font} ${textSize} ${rounded} 
    transition duration-300 ease-in-out text-center 
    ${icon ? "flex justify-center gap-2 items-center" : ""}
  `;

  const buttonContent = (
    <>
      {iconPosition === "left" && iconElement}
      {children}
      {iconPosition === "right" && iconElement}
    </>
  );

  if (to && !disabled) {
    return (
      <Link to={to} className={classNames}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classNames} disabled={disabled}>
      {buttonContent}
    </button>
  );
};

PrimaryButton.propTypes = {
  to: PropTypes.string,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  color: PropTypes.string,
  children: PropTypes.node.isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.elementType,
    PropTypes.object,
  ]),
  iconPosition: PropTypes.oneOf(["left", "right"]),
  iconSize: PropTypes.number,
  bgColor: PropTypes.string,
  font: PropTypes.string,
  textSize: PropTypes.string,
  rounded: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};

export default PrimaryButton;

