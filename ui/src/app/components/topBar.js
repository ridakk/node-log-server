import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ActionExitToApp from 'material-ui/svg-icons/action/exit-to-app'

class TopBar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <AppBar
        title='Log Storage'
        iconElementLeft={<div/>}
        iconElementRight={<IconButton><ActionExitToApp /></IconButton>}
      />
    )
  }
}

export default TopBar;
