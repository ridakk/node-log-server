import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';


class DataList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let self = this;
    return (

        <List>
          {self.props.subheader && <Subheader inset={true}>{self.props.subheader}</Subheader>}
          {self.props.content.map(function(data) {
              return <ListItem key={data[self.props.idKey]}
                leftAvatar={self.props.leftAvatar}
                rightIconButton={self.props.rightIconMenu(data[self.props.idKey])}
                primaryText={data[self.props.primaryTextKey]}
                secondaryText={data[self.props.secondaryTextKey]}
              />
          })}
        </List>

    )
  }
}

export default DataList;
