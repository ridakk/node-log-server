import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  margin: 12,
};

const Button = ({ label, onClick, disabled }) =>
  <div>
    <RaisedButton
      label={label}
      primary
      style={style}
      onTouchTap={onClick}
      disabled={disabled}
    />
  </div>;

Button.propTypes = {
  disabled: React.PropTypes.bool.isRequired,
  label: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
};

export default Button;
