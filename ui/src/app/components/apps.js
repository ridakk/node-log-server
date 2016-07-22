import React from 'react';
import { deepOrange500 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TopBar from './topBar';
import DataList from './dataList';
import session from '../models/session';
import api from '../services/api';
import { AppRightMenu } from '../constants/rightMenu';
import { folderIcon } from '../constants/icons';
import { withRouter } from 'react-router';

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

class Apps extends React.Component {
  constructor(props) {
    super(props);
    this.handleRightIconMenuClick = this.handleRightIconMenuClick.bind(this);
    this.state = {
      applications: [],
      selectedApp: null,
    };
    api.send('/applications', 'GET').then((applications) => {
      this.setState({
        applications,
      });
    });
  }

  handleRightIconMenuClick(event, child) {
    session.set('selectedApp', child.props.id);
    this.props.router.push(child.props.path);
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <TopBar title={'Apps'} />
          {this.state.applications.length > 0 &&
            <DataList
              content={this.state.applications}
              idKey={'id'}
              primaryTextKey={'name'}
              secondaryTextKey={'url'}
              rightIconMenu={AppRightMenu}
              rightIconMenuClick={this.handleRightIconMenuClick}
              leftAvatar={folderIcon}
            />
          }
          {this.state.applications.length === 0 &&
            <h3>Please create new application from left menu</h3>}
        </div>
      </MuiThemeProvider>
    );
  }
}

Apps.propTypes = {
  router: React.PropTypes.func.isRequired,
};

export default withRouter(Apps);
