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
import SocialPerson from 'material-ui/svg-icons/social/person';

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
    <MenuItem>Delete</MenuItem>
  </IconMenu>
);

const leftIcon = (
  <Avatar icon={<SocialPerson />} />
);

class Apps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      token: userModel.getToken(),
      admin: userModel.getRole() === ROLES.ADMIN,
      users: []
    };
    console.log('home page state: ', this.state);
    api.send(this.state.token, '/users', 'GET').then((users)=>{
      this.setState({
        users: users
      });
    });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <TopBar admin={this.state.admin} title={'Users'}/>
          {this.state.users.length > 0 && <DataList
            content={this.state.users}
            idKey={'username'}
            primaryTextKey={'username'}
            secondaryTextKey={'role'}
            rightIconMenu={rightMenu}
            leftAvatar={leftIcon}/>}
          {this.state.users.length === 0 && <h3>You can create new user from left menu</h3>}
        </div>
      </MuiThemeProvider>
    )
  }
}

export default Apps;
