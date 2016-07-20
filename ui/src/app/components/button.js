import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  margin: 12,
};

class Button extends React.Component {

  render() {
    return (
      <div>
        <RaisedButton
          label={this.props.label}
          primary
          style={style}
          onTouchTap={this.props.onClick}
          disabled={this.props.disabled}
        />
      </div>
    );
  }
}

Button.propTypes = {
  disabled: React.PropTypes.bool.isRequired,
  label: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
};

export default Button;
