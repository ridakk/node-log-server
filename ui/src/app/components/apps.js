import React from 'react';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TopBar from './topBar';
import DataList from './dataList';
import session from '../models/session';
import api from '../services/api';
import {AppRightMenu} from '../constants/rightMenu';
import {folderIcon} from '../constants/icons';
import { withRouter } from 'react-router';

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
    this.handleRightIconMenuClick = this.handleRightIconMenuClick.bind(this);
    this.state = {
      applications: [],
      selectedApp: null
    };
    console.log('home page state: ', this.state);
    api.send('/applications', 'GET').then((applications)=>{
      this.setState({
        applications: applications
      });
    });
  }

  handleRightIconMenuClick(event, child) {
    console.log('selected app id', child.props.id);
    session.set('selectedAppId', child.props.id);
    this.props.router.push(child.props.path);
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <TopBar title={'Apps'}/>
          {this.state.applications.length > 0 && <DataList
            content={this.state.applications}
            idKey={'id'}
            primaryTextKey={'name'}
            secondaryTextKey={'url'}
            rightIconMenu={AppRightMenu}
            rightIconMenuClick={this.handleRightIconMenuClick}
            leftAvatar={folderIcon}/>}
          {this.state.applications.length === 0 && <h3>Please create new application from left menu</h3>}
        </div>
      </MuiThemeProvider>
    )
  }
}

export default  withRouter(Apps);
