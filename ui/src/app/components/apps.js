import React from 'react';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TopBar from './topBar';
import AppList from './appList';
import userModel from '../models/userModel';
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

class Apps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: userModel.getToken(),
      admin: userModel.getRole() === ROLES.ADMIN,
      applications: [],
      selectedApp: null
    };
    console.log('home page state: ', this.state);
    api.send(this.state.token, '/applications', 'GET').then((applications)=>{
      this.setState({
        applications: applications
      });
    });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <TopBar admin={this.state.admin} title={'Applications'}/>
          {this.state.applications.length > 0 && <AppList apps={this.state.applications}/>}
          {this.state.applications.length === 0 && <h3>Please create new application from left menu</h3>}
        </div>
      </MuiThemeProvider>
    )
  }
}

export default Apps;
