import React from 'react';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TopBar from './topBar';
import DataList from './dataList';
import session from '../models/session';
import api from '../services/api';
import {RightMenu, leftIcon} from '../constants/userDataList';

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
      users: []
    };
    console.log('home page state: ', this.state);
    api.send('/users', 'GET').then((users)=>{
      this.setState({
        users: users
      });
    });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <TopBar title={'Users'}/>
          {this.state.users.length > 0 && <DataList
            content={this.state.users}
            idKey={'username'}
            primaryTextKey={'username'}
            secondaryTextKey={'role'}
            rightIconMenu={RightMenu}
            leftAvatar={leftIcon}/>}
          {this.state.users.length === 0 && <h3>You can create new user from left menu</h3>}
        </div>
      </MuiThemeProvider>
    )
  }
}

export default Apps;
