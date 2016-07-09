import React from 'react';
import {grey400} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

const iconButtonElement = (
  <IconButton
    touch={true}
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

export const AppRightMenu = (id, fn) => {
  return (
    <IconMenu onItemTouchTap={fn} iconButtonElement={iconButtonElement}>
      <MenuItem id={id} path={'/appLogs'}>Logs</MenuItem>
      <MenuItem id={id} path={'/appAnalytics'}>Analytics</MenuItem>
      <MenuItem id={id} path={'/appEdit'}>Edit</MenuItem>
    </IconMenu>
  );
};

export const UserRightMenu = (id, fn) => {
  return (
    <IconMenu onItemTouchTap={fn} iconButtonElement={iconButtonElement}>
      <MenuItem id={id}>Delete</MenuItem>
    </IconMenu>
  );
};
