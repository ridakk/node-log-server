import React from 'react';
import Snackbar from 'material-ui/Snackbar';

class Notification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      message: '',
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

Notification.propTypes = {
  open: React.PropTypes.bool.isRequired,
  message: React.PropTypes.string.isRequired,
};

export default Notification;
