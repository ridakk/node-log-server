import React from 'react';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextBox from './textBox';
import Button from './button';
import TopBar from './topBar';
import session from '../models/session';
import Notification from './notification';
import api from '../services/api';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

let ROLES = require('../../../../constants/roles.js');

const styles = {
  container: {
    textAlign: 'center'
  }
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500
  }
});

class NewUser extends React.Component {
  constructor(props) {
    super(props);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleCreateButtonClick = this.handleCreateButtonClick.bind(this);
    this.handleRoleChange = this.handleRoleChange.bind(this);
    this.state = {
      username: '',
      password: '',
      disabled: true,
      notificationOpen: false,
      notificationMessage: '',
      role: ROLES.GUEST
    };
  }

  handleUsernameChange(username) {
    this.state.username = username;
    this.setState({
      disabled: this.state.username.length === 0 ||
        this.state.password.length === 0,
      notificationOpen: false,
      notificationMessage: ''
    });
  }

  handlePasswordChange(password) {
    this.state.password = password;
    this.setState({
      disabled: this.state.username.length === 0 ||
        this.state.password.length === 0,
      notificationOpen: false,
      notificationMessage: ''
    });
  }

  handleCreateButtonClick() {
    console.log('app create clicked', this.state);
    api.send('/user', 'POST', {
      username: this.state.username,
      password: this.state.password,
      role: this.state.role
    });
  }

  handleRoleChange(event, index, value) {
    this.setState({
      role: value,
      notificationOpen: false,
      notificationMessage: ''
    });
  };

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <TopBar title={'Create User'}/>
          <TextBox
            onChange={this.handleUsernameChange}
            type={'text'} hint={'jhonsnow'}
            floatingLabel={'User name'}/>
          <TextBox
            onChange={this.handlePasswordChange}
            type={'text'}
            hint={'winteriscoming'}
            floatingLabel={'Password'}/>
            <DropDownMenu
              value={this.state.role}
              onChange={this.handleRoleChange}
              autoWidth={true}
              disabled={this.state.disabled}
            >
              <MenuItem value={ROLES.GUEST} primaryText={ROLES.GUEST} />
              <MenuItem value={ROLES.ADMIN} primaryText={ROLES.ADMIN} />
            </DropDownMenu>
          <Button
            label={'Create'}
            disabled={this.state.disabled}
            onClick={this.handleCreateButtonClick}
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

export default NewUser;
