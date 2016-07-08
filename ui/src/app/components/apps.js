import React from 'react';
import {grey400, deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TopBar from './topBar';
import DataList from './dataList';
import userModel from '../models/userModel';
import api from '../services/api';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';

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

const iconButtonElement = (
  <IconButton
    touch={true}
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

const rightMenu = (
  <IconMenu iconButtonElement={iconButtonElement}>
    <MenuItem>Logs</MenuItem>
    <MenuItem>Analytics</MenuItem>
    <MenuItem>Edit</MenuItem>
  </IconMenu>
);

const leftIcon = (
  <Avatar icon={<FileFolder />} />
);

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
          {this.state.applications.length > 0 && <DataList
            content={this.state.applications}
            idKey={'id'}
            primaryTextKey={'name'}
            secondaryTextKey={'url'}
            rightIconMenu={rightMenu}
            leftAvatar={leftIcon}/>}
          {this.state.applications.length === 0 && <h3>Please create new application from left menu</h3>}
        </div>
      </MuiThemeProvider>
    )
  }
}

export default Apps;
