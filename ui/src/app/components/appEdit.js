
import React from 'react';
import { deepOrange500 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TopBar from './topBar';
import session from '../models/session';
import api from '../services/api';
import ChipList from './chipList';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import Button from './button';
import AutoComplete from 'material-ui/AutoComplete';
import Notification from './notification';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const styles = {
  container: {
    textAlign: 'center',
  },
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

class AppEdit extends React.Component {
  constructor(props) {
    super(props);
    this.handleGenerateNewKey = this.handleGenerateNewKey.bind(this);
    this.handleAddUser = this.handleAddUser.bind(this);
    this.handleUserDeleteRequest = this.handleUserDeleteRequest.bind(this);
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.handleNewKeyDialogClose = this.handleNewKeyDialogClose.bind(this);
    this.handleKeyDeleteRequest = this.handleKeyDeleteRequest.bind(this);
    this.state = {
      application: {},
      users: [],
      userDataSource: [],
      keys: [],
      newKeyDialog: false,
      newKey: {},
      userToAdd: '',
      notificationOpen: false,
      notificationMessage: '',
      appId: session.get('selectedApp'),
    };
    api.send(`/application/${this.state.appId}`, 'GET').then((application) => {
      this.setState({
        application,
      });
    });
    api.send(`/key/${this.state.appId}`, 'GET').then((keys) => {
      this.setState({
        keys,
      });
    });
    api.send('/users', 'GET').then((users) => {
      this.setState({
        userDataSource: users,
      });
    });
    api.send(`/user/applications/${this.state.appId}`, 'GET').then((users) => {
      this.setState({
        users,
      });
    });
  }

  handleGenerateNewKey() {
    api.send(`/key/${this.state.appId}`, 'POST').then((newKey) => {
      const keys = this.state.keys;

      keys.push(newKey);
      this.setState({
        keys,
        notificationOpen: false,
        notificationMessage: '',
        newKeyDialog: true,
        newKey,
      });
    }, (err) => {
      this.setState({
        notificationOpen: true,
        notificationMessage: `Failed to generate key: ${err.reasonText}`,
      });
    });
  }

  handleKeyDeleteRequest(keyId) {
    api.send(`/key/${keyId}`, 'DELETE').then(() => {
      const keys = this.state.keys;

      keys.splice(keys.indexOf(keys.find(key => key.id === keyId)), 1);
      this.setState({
        keys,
        notificationOpen: false,
        notificationMessage: '',
      });
    }, (err) => {
      this.setState({
        notificationOpen: true,
        notificationMessage: `Failed to remove key: ${err.reasonText}`,
      });
    });
  }

  handleNewKeyDialogClose() {
    this.setState({
      notificationOpen: false,
      notificationMessage: '',
      newKeyDialog: false,
      newKey: {},
    });
  }

  handleAddUser() {
    api.send(`/user/${this.state.userToAdd.username}/${this.state.appId}`, 'POST').then(() => {
      const users = this.state.users;

      users.push({
        username: this.state.userToAdd.username,
      });
      this.setState({
        users,
        notificationOpen: false,
        notificationMessage: '',
      });
    }, (err) => {
      this.setState({
        notificationOpen: true,
        notificationMessage: `Failed to add user: ${err.reasonText}`,
      });
    });
  }

  handleUserDeleteRequest(username) {
    api.send(`/user/${username}/${this.state.appId}`, 'DELETE').then(() => {
      const users = this.state.users;

      users.splice(users.indexOf(users.find(user => user.username === username)), 1);
      this.setState({
        users,
        notificationOpen: false,
        notificationMessage: '',
      });
    }, (err) => {
      this.setState({
        notificationOpen: true,
        notificationMessage: `Failed to remove user: ${err.reasonText}`,
      });
    });
  }

  handleUpdateInput(value) {
    this.setState({
      userToAdd: value,
      notificationOpen: false,
      notificationMessage: '',
    });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <TopBar title={this.state.application.name} />
          <h4>{this.state.application.url}</h4>
          <h4>{this.state.appId}</h4>
          <Subheader>Keys</Subheader>
          <ChipList
            content={this.state.keys}
            idKey={'id'}
            labelKey={'id'}
            onRequestDelete={this.handleKeyDeleteRequest}
          />
          <Button
            label={'Generate new key'}
            disabled={false}
            onClick={this.handleGenerateNewKey}
          />
          <Divider />
          <Subheader>Users</Subheader>
          <ChipList
            content={this.state.users}
            idKey={'username'}
            labelKey={'username'}
            onRequestDelete={this.handleUserDeleteRequest}
          />
          <AutoComplete
            hintText="Type username"
            dataSource={this.state.userDataSource}
            dataSourceConfig={{
              text: 'username',
              value: 'username',
            }}
            onNewRequest={this.handleUpdateInput}
          />
          <Button
            label={'Add user'}
            disabled={false}
            onClick={this.handleAddUser}
          />
          <Dialog
            title="New key is generated"
            modal={false}
            contentStyle={{
              width: '100%',
            }}
            actions={<FlatButton
              label="Close"
              primary
              keyboardFocused
              onTouchTap={this.handleNewKeyDialogClose}
            />}
            open={this.state.newKeyDialog}
          >
            <h3>Please note ProductKey & JsKey!!!
            You can not see them after closing this dialog</h3>
            <h4>ProductKey:</h4> {this.state.newKey.productKey}
            <h4>JsKey:</h4> {this.state.newKey.jsKey}
          </Dialog>
          <Notification
            open={this.state.notificationOpen}
            message={this.state.notificationMessage}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default AppEdit;
