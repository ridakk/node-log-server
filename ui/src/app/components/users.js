import React from 'react';
import { deepOrange500 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TopBar from './topBar';
import DataList from './dataList';
import api from '../services/api';
import { UserRightMenu } from '../constants/rightMenu';
import { personIcon } from '../constants/icons';
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
      users: [],
    };
    api.send('/users', 'GET').then((users) => {
      this.setState({
        users,
      });
    });
  }

  handleRightIconMenuClick(userId) {
    api.send(`/user/${userId}`, 'DELETE').then(() => {
      const users = this.state.users;

      users.splice(users.indexOf(users.find(user => user.username === userId)), 1);
      this.setState({
        users,
      });
    });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <TopBar title={'Users'} />
          {
            this.state.users.length > 0 && <DataList
              content={this.state.users}
              idKey={'username'}
              primaryTextKey={'username'}
              secondaryTextKey={'role'}
              rightIconMenu={UserRightMenu}
              rightIconMenuClick={this.handleRightIconMenuClick}
              leftAvatar={personIcon}
            />
          }
          {this.state.users.length === 0 && <h3>You can create new user from left menu</h3>}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withRouter(Apps);
