import React from 'react';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Password from './password';
import Username from './username';
import LoginButton from './loginButton';
import { withRouter } from 'react-router'
import Notification from './notification';
import API from '../services/api';

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 100,
  },
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

class Login extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleLoginButtonClick = this.handleLoginButtonClick.bind(this);
    this.state = {
      username: '',
      password: '',
      buttonDisabled: true,
      notificationOpen: false,
      notificationMessage: ''
    };
  }

  handleUsernameChange(username) {
      this.state.username = username;
      this.setState({
          buttonDisabled: this.state.username.length === 0 ||
              this.state.password.length === 0
      });
  }

  handlePasswordChange(password) {
      this.state.password = password;
      this.setState({
          buttonDisabled: this.state.username.length === 0 ||
              this.state.password.length === 0
      });
  }

  handleLoginButtonClick() {
      console.log('login clicked', this.state);
      API.auth(this.state.username, this.state.password);
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <Username onUsernameChange={this.handleUsernameChange}/>
          <Password onPasswordChange={this.handlePasswordChange}/>
          <LoginButton
            disabled={this.state.buttonDisabled}
            onClick={this.handleLoginButtonClick}
          />
          <Notification
            open={this.state.notificationOpen}
            message={this.state.notificationMessage}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(Login)
