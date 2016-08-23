import React from 'react';
import ImageImage from 'material-ui/svg-icons/image/image';
import { ListItem } from 'material-ui/List';
import api from '../services/api';

class ScreenShotListItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleDownloadFile = this.handleDownloadFile.bind(this);
    this.state = {
    };
  }

  handleDownloadFile(logId, appId) {
    api.send(`/log/${appId}/${logId}/log`, 'GET').then((logs) => {
      const log = logs[0];

      const w = window.open('');

      w.document.write(`<head><title>Screen Shot:${logId}</title></head>
          <body><img src='${log.screenShot}'></img></body>`);
    });
  }

  render() {
    return (
      <ListItem
        primaryText="Screen Shot"
        rightIcon={<ImageImage />}
        onTouchTap={() => this.handleDownloadFile(this.props.logId, this.props.appId)}
      />
    );
  }
}

ScreenShotListItem.propTypes = {
  logId: React.PropTypes.string.isRequired,
  appId: React.PropTypes.string.isRequired,
};

export default ScreenShotListItem;
