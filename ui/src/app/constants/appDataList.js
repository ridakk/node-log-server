import React from 'react';
import {grey400} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';

const iconButtonElement = (
  <IconButton
    touch={true}
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

function handleMenuItemClick(event, child) {
  console.log('event: ', event)
  console.log('child: ', child)
}

export const RightMenu = (id) => {
  return (
    <IconMenu onItemTouchTap={handleMenuItemClick} iconButtonElement={iconButtonElement}>
      <MenuItem id={id} path={'/appLogs'}>Logs</MenuItem>
      <MenuItem id={id} path={'/appAnalytics'}>Analytics</MenuItem>
      <MenuItem id={id} path={'/appEdit'}>Edit</MenuItem>
    </IconMenu>
  );
};

export const leftIcon = (
  <Avatar icon={<FileFolder />} />
);
