import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Divider from 'material-ui/Divider';
import { withRouter } from 'react-router';

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
  }

  handleMenuItemClick(event, child) {
    console.log('child: ', child);
    console.log('path: ', child.props.path);
    if (child.props.path) {
      this.props.router.push(child.props.path);
    } else {
      // log out menu item clicked
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
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            menuStyle={{width: '%100'}}
            onItemTouchTap={this.handleMenuItemClick}
          >
            <MenuItem primaryText="Applications" path={'/apps'}/>
            {this.props.admin && <MenuItem primaryText="Users" path={'/users'}/>}
            {this.props.admin && <Divider />}
            {this.props.admin && <MenuItem primaryText="Create New Application" path={'/newApp'}/>}
            {this.props.admin && <MenuItem primaryText="Create New User" path={'/newUser'}/>}
            <Divider />
            <MenuItem primaryText="Log out"/>
          </IconMenu>
        }
      />
    )
  }
}

export default withRouter(TopBar);
