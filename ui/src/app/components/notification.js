import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';

class Notification extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      open: false,
      message: ''
    };
  }
  render() {
    return (
      <div>
        <Snackbar
          open={this.props.open}
          message={this.props.message}
          autoHideDuration={4000}
        />
      </div>
    );
  }
}

export default Notification;
