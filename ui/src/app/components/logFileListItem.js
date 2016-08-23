import React from 'react';
import FileAttachment from 'material-ui/svg-icons/file/attachment';
import { ListItem } from 'material-ui/List';
import api from '../services/api';

class LogFileListItem extends React.Component {
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

      w.document.write(`<head><title>log: ${logId}</title></head>
          <body><p>${log.log}</p></body>`);
    });
  }


  render() {
    return (
      <ListItem
        primaryText="Log File"
        rightIcon={<FileAttachment />}
        onTouchTap={() => this.handleDownloadFile(this.props.logId, this.props.appId)}
      />
    );
  }
}

LogFileListItem.propTypes = {
  logId: React.PropTypes.string.isRequired,
  appId: React.PropTypes.string.isRequired,
};

export default LogFileListItem;
