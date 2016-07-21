import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Divider from 'material-ui/Divider';
import { withRouter } from 'react-router';
import session from '../models/session';

const ROLES = require('../../../../constants/roles.js');

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: session.get('role') === ROLES.ADMIN,
    };
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
  }

  handleMenuItemClick(event, child) {
    if (child.props.path) {
      this.props.router.push(child.props.path);
    } else {
      // log out menu item clicked
      // TODO: need to implement a way to invalidate jwt tokens in server first
      window.location.href = '.';
    }
  }

  render() {
    return (
      <AppBar
        title={this.props.title}
        iconElementLeft={
          <IconMenu
            iconButtonElement={
              <IconButton><MoreVertIcon /></IconButton>
            }
            targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            menuStyle={{ width: '%100' }}
            onItemTouchTap={this.handleMenuItemClick}
          >
            <MenuItem primaryText="My Apps" path={'/myApps'} />
            {this.state.admin && <MenuItem primaryText="Apps" path={'/apps'} />}
            {this.state.admin && <MenuItem primaryText="Users" path={'/users'} />}
            {this.state.admin && <Divider />}
            {this.state.admin && <MenuItem primaryText="Create New Application" path={'/newApp'} />}
            {this.state.admin && <MenuItem primaryText="Create New User" path={'/newUser'} />}
            <Divider />
            <MenuItem primaryText="Log out" />
          </IconMenu>
        }
      />
    );
  }
}

TopBar.propTypes = {
  router: React.PropTypes.func.isRequired,
  title: React.PropTypes.string.isRequired,
};

export default withRouter(TopBar);
