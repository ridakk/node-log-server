import React from 'react';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

const DataList = ({ subheader, content, idKey, leftAvatar,
                    rightIconMenu, rightIconMenuClick,
                    primaryTextKey, secondaryTextKey }) =>
  <List>
    {subheader && <Subheader inset>{subheader}</Subheader>}
    {content.map((data) =>
      <ListItem
        key={data[idKey]}
        leftAvatar={leftAvatar}
        rightIconButton={rightIconMenu(data[idKey], rightIconMenuClick)}
        primaryText={data[primaryTextKey]}
        secondaryText={data[secondaryTextKey]}
      />
    )}
  </List>;

DataList.propTypes = {
  rightIconMenuClick: React.PropTypes.func.isRequired,
  subheader: React.PropTypes.string.isRequired,
  idKey: React.PropTypes.string.isRequired,
  primaryTextKey: React.PropTypes.string.isRequired,
  secondaryTextKey: React.PropTypes.string.isRequired,
  content: React.PropTypes.array.isRequired,
  leftAvatar: React.PropTypes.element.isRequired,
  rightIconMenu: React.PropTypes.element.isRequired,
};

export default DataList;
