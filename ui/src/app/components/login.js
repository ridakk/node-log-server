import React from 'react';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextBox from './textBox';
import Button from './button';
import { withRouter } from 'react-router';
import Notification from './notification';
import api from '../services/api';
import session from '../models/session';

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
        this.state.password.length === 0,
      notificationOpen: false,
      notificationMessage: ''
    });
  }

  handlePasswordChange(password) {
    this.state.password = password;
    this.setState({
      buttonDisabled: this.state.username.length === 0 ||
        this.state.password.length === 0,
      notificationOpen: false,
      notificationMessage: ''
    });
  }

  handleLoginButtonClick() {
    console.log('login clicked', this.state);
    // api.auth(this.state.username, this.state.password).then((data) => {
    //   console.log('auth success ', data);
    //   session.set('username', data.username);
    //   session.set('role', data.role);
    //   session.set('applications', data.applications);
    //   session.set('token', data.token);
    //   this.props.router.push('/myApps');
    // }, (data) => {
    //   //if(data.status === 401) {
    //   this.setState({
    //     notificationOpen: true,
    //     notificationMessage: 'Username or Password is wrong'
    //   });
    //   //}
    // });

    session.set('role', 'Admin');
    session.set('applications', [{id:1, name: 'asd', url: 'a@a.com'}, {id:2, name: 'qwe', url: 'b@b.com'}]);

    this.props.router.push('/myApps');
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <TextBox
            onChange={this.handleUsernameChange}
            type={'text'} hint={'Enter your user name'}
            floatingLabel={'Username'}/>
          <TextBox
            onChange={this.handlePasswordChange}
            type={'password'}
            hint={'Enter your password'}
            floatingLabel={'Password'}/>
          <Button
            label={'Login'}
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

export default withRouter(Login);
