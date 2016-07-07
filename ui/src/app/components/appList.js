import React from 'react';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import FileFolder from 'material-ui/svg-icons/file/folder';


class AppList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (

        <List>
          <Subheader inset={true}>Applications</Subheader>
          {this.props.apps.map(function(app) {
              return <ListItem
                key={app.id}
                leftAvatar={<Avatar icon={<FileFolder />} />}
                primaryText={app.name}
              />
          })}
        </List>

    )
  }
}

export default AppList;
