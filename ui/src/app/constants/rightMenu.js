import React from 'react';
import { grey400 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import session from '../models/session';

const ROLES = require('../../../../constants/roles.js');

const iconButtonElement = (
  <IconButton touch>
    <MoreVertIcon color={grey400} />
  </IconButton>
);

export const AppRightMenu = (id, fn) => {
  const admin = session.get('role') === ROLES.ADMIN;

  return (
    <IconMenu
      onItemTouchTap={(event, child) => fn(child.props.id, child.props.path)}
      iconButtonElement={iconButtonElement}
    >
      <MenuItem id={id} path={'/appLogs'}>Logs</MenuItem>
      <MenuItem id={id} path={'/appAnalytics'}>Analytics</MenuItem>
      {admin && <MenuItem id={id} path={'/appEdit'}>Edit</MenuItem>}
    </IconMenu>
  );
};

export const UserRightMenu = (id, fn) => (
  <IconMenu
    onItemTouchTap={(event, child) => fn(child.props.id)}
    iconButtonElement={iconButtonElement}
  >
    <MenuItem id={id}>Delete</MenuItem>
  </IconMenu>
);
