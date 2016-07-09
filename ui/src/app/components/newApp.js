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

let ROLES = require('../../../../constants/roles.js');

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

class NewApp extends React.Component {
  constructor(props) {
    super(props);
    this.handleAppNameChange = this.handleAppNameChange.bind(this);
    this.handleAppUrlChange = this.handleAppUrlChange.bind(this);
    this.handleCreateButtonClick = this.handleCreateButtonClick.bind(this);
    this.state = {
      appName: '',
      appUrl: '',
      buttonDisabled: true,
      notificationOpen: false,
      notificationMessage: ''
    };
  }

  handleAppNameChange(appName) {
    this.state.appName = appName;
    this.setState({
      buttonDisabled: this.state.appName.length === 0 ||
        this.state.appUrl.length === 0,
      notificationOpen: false,
      notificationMessage: ''
    });
  }

  handleAppUrlChange(appUrl) {
    this.state.appUrl = appUrl;
    this.setState({
      buttonDisabled: this.state.appName.length === 0 ||
        this.state.appUrl.length === 0,
      notificationOpen: false,
      notificationMessage: ''
    });
  }

  handleCreateButtonClick() {
    console.log('app create clicked', this.state);
    api.send('/application', 'POST', {
      name: this.state.appName,
      url: this.state.appUrl
    })
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <TopBar title={'Create Application'}/>
          <TextBox
            onChange={this.handleAppNameChange}
            type={'text'} hint={'my-app'}
            floatingLabel={'Application name'}/>
          <TextBox
            onChange={this.handleAppUrlChange}
            type={'text'}
            hint={'https://my-app.com'}
            floatingLabel={'Application url'}/>
          <Button
            label={'Create'}
            disabled={this.state.buttonDisabled}
            onClick={this.handleCreateButtonClick}
          />
          <Notification
            open={this.state.notificationOpen}
            message={this.state.notificationMessage}
          />
        </div>
      </MuiThemeProvider>
    )
  }
}

export default NewApp;
