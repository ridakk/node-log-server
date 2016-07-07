import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  margin: 12,
};

class Button extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <RaisedButton label={this.props.label} primary={true} style={style}
        onTouchTap={this.props.onClick}
        disabled={this.props.disabled}/>
      </div>
    )
  }
}

export default Button
