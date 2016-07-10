
import React from 'react';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TopBar from './topBar';
import session from '../models/session';
import api from '../services/api';
import {AppRightMenu} from '../constants/rightMenu';
import {folderIcon} from '../constants/icons';
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
    textAlign: 'center'
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
    this.handleUpdateInput = this.handleUpdateInput.bind(this);
    this.handleNewKeyDialogClose = this.handleNewKeyDialogClose.bind(this);
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
      appId: session.get('selectedApp')
    };
    console.log('app edit state: ', this.state);
    api.send('/application/' + this.state.appId, 'GET').then((application)=>{
      this.setState({
        application: application
      });
    });
    api.send('/key/' + this.state.appId, 'GET').then((keys)=>{
      this.setState({
        keys: keys
      });
    });
    api.send('/users', 'GET').then((users)=>{
      this.setState({
        userDataSource: users
      });
    });

    // TODO: once server api is implemented, retrieve users that has permission to app
  }

  handleGenerateNewKey() {
    console.log('key create clicked');
    api.send('/key/' + this.state.appId, 'POST').then((newKey) => {
      let keys = this.state.keys;
      keys.push(newKey);
      this.setState({
        keys: keys,
        notificationOpen: false,
        notificationMessage: '',
        newKeyDialog: true,
        newKey: newKey
      });
    }, (err) => {
      this.setState({
        notificationOpen: true,
        notificationMessage: 'Failed to generate key: ' + err.reasonText
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
    console.log('add user clicked');
    api.send('/user/' + this.state.userToAdd.username + '/' + this.state.appId, 'POST').then((newUser) => {
      let users = this.state.users;
      users.push(newUser);
      this.setState({
        users: users,
        notificationOpen: false,
        notificationMessage: ''
      });
    }, (err) => {
      this.setState({
        notificationOpen: true,
        notificationMessage: 'Failed to add user: ' + err.reasonText
      });
    });
  }

  handleUpdateInput(value) {
    this.setState({
      userToAdd: value,
      notificationOpen: false,
      notificationMessage: ''
    });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <TopBar title={'App Edit'}/>
          <h4>{this.state.application.name}</h4>
          <h4>{this.state.application.url}</h4>
          <h4>{this.state.appId}</h4>
          <Subheader>Keys</Subheader>
          <ChipList
            content={this.state.keys}
            idKey={'id'}
            labelKey={'id'}/>
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
            labelKey={'username'}/>
            <AutoComplete
              hintText="Type username"
              dataSource={this.state.userDataSource}
              dataSourceConfig={{
                text: 'username',
                value: 'username'
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
                primary={true}
                keyboardFocused={true}
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
    )
  }
}

export default  AppEdit;
