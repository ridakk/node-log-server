import React from 'react';
import {grey400} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';
import SocialPerson from 'material-ui/svg-icons/social/person';

const iconButtonElement = (
  <IconButton
    touch={true}
  >
    <MoreVertIcon color={grey400} />
  </IconButton>
);

export const RightMenu = (id) => {
  return (
    <IconMenu iconButtonElement={iconButtonElement}>
      <MenuItem id={id}>Delete</MenuItem>
    </IconMenu>
  );
};

export const leftIcon = (
  <Avatar icon={<SocialPerson />} />
);
