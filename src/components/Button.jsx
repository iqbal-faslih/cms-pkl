import PropTypes from "prop-types";
import React from "react";

const Button = ({ children, ...props }) => {
  return (
    <button {...props}>
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Button;