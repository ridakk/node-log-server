import React from 'react';
import { deepOrange500 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TopBar from './topBar';
import DataList from './dataList';
import session from '../models/session';
import { AppRightMenu } from '../constants/rightMenu';
import { folderIcon } from '../constants/icons';
import { withRouter } from 'react-router';
import api from '../services/api';

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

class MyApps extends React.Component {
  constructor(props) {
    super(props);
    this.handleRightIconMenuClick = this.handleRightIconMenuClick.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.state = {
      username: session.get('username'),
      applicationIds: session.get('applications'),
      applications: [],
      selectedApp: null,
    };

    for (const elem of this.state.applicationIds.entries()) {
      api.send(`/application/${elem[1]}`, 'GET').then((application) => {
        const applications = this.state.applications;

        applications.push(application);
        this.setState({
          applications,
        });
      });
    }
  }

  handleRightIconMenuClick(selectedAppId, path) {
    session.set('selectedApp', selectedAppId);
    this.props.router.push(path);
  }

  handleItemClick(selectedAppId) {
    session.set('selectedApp', selectedAppId);
    this.props.router.push('/appLogs');
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <TopBar title={'My apps'} />
          {
            this.state.applications.length > 0 &&
              <DataList
                content={this.state.applications}
                idKey={'id'}
                primaryTextKey={'name'}
                secondaryTextKey={'url'}
                rightIconMenu={AppRightMenu}
                rightIconMenuClick={this.handleRightIconMenuClick}
                onClick={this.handleItemClick}
                leftAvatar={folderIcon}
              />
          }
          {
            this.state.applications.length === 0 &&
              <h3>Please create new application from left menu</h3>
          }
        </div>
      </MuiThemeProvider>
    );
  }
}

MyApps.propTypes = {
  router: React.PropTypes.func.isRequired,
};

export default withRouter(MyApps);
