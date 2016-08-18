import React from 'react';
import { deepOrange500 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Table, TableBody, TableHeader,
  TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FileAttachment from 'material-ui/svg-icons/file/attachment';
import ImageImage from 'material-ui/svg-icons/image/image';
import TopBar from './topBar';
import session from '../models/session';
import api from '../services/api';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { List, ListItem } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import TextBox from './textBox';
import Notification from './notification';

const styles = {
  container: {
    textAlign: 'center',
  },
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

const COLUMNS = [
  {
    header: 'ID',
    rowProperty: 'id',
    columnNumber: 1,
  }, {
    header: 'Status',
    rowProperty: 'status',
    columnNumber: 2,
  }, {
    header: 'Description',
    rowProperty: 'description',
    columnNumber: 3,
  },
];

class AppLogs extends React.Component {
  constructor(props) {
    super(props);
    this.handleRowSelection = this.handleRowSelection.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleDownloadFile = this.handleDownloadFile.bind(this);
    this.handleDownloadScreenShot = this.handleDownloadScreenShot.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleStatusUpdate = this.handleStatusUpdate.bind(this);
    this.state = {
      application: {},
      columns: COLUMNS,
      appId: session.get('selectedApp'),
      logs: [],
      dialogOpen: false,
      dialogTitle: '',
      dialogContent: '',
      newLogStatus: '',
      statusUpdateButtonDisabled: true,
      notificationOpen: false,
      notificationMessage: '',
    };

    api.send(`/application/${this.state.appId}`, 'GET').then((application) => {
      this.setState({
        application,
      });
    });
    api.send(`/log/${this.state.appId}`, 'GET').then((logs) => {
      this.setState({
        logs,
      });
    });
  }

  handleDialogClose() {
    this.setState({
      dialogOpen: false,
      notificationOpen: false,
      notificationMessage: '',
    });
  }

  handleRowSelection(rowId) {
    const logId = this.state.logs[rowId].id;

    api.send(`/log/${this.state.appId}/${logId}/all`, 'GET').then((logs) => {
      const log = logs[0];
      this.setState({
        dialogOpen: true,
        statusUpdateButtonDisabled: true,
        dialogTitle: log.id,
        dialogContent: log,
        notificationOpen: false,
        notificationMessage: '',
      });
    });
  }

  handleDownloadFile(logId, resourceIdentifier) {
    api.send(`/log/${this.state.appId}/${logId}/${resourceIdentifier}`, 'GET').then((logs) => {
      const log = logs[0];

      this.setState({
        dialogOpen: false,
        notificationOpen: false,
        notificationMessage: '',
      });

      const w = window.open('');

      w.document.write(`<head><title>${resourceIdentifier}:${logId}</title></head>
          <body><p>${log[resourceIdentifier]}</p></body>`);
    });
  }

  handleDownloadScreenShot(logId) {
    api.send(`/log/${this.state.appId}/${logId}/screenShot`, 'GET').then((logs) => {
      const log = logs[0];

      this.setState({
        dialogOpen: false,
        notificationOpen: false,
        notificationMessage: '',
      });

      const w = window.open('');

      w.document.write(`<head><title>Screen Shot:${logId}</title></head>
          <body><img src='${log.screenShot}'></img></body>`);
    });
  }

  handleStatusChange(status) {
    this.state.newLogStatus = status;
    this.setState({
      statusUpdateButtonDisabled: this.state.newLogStatus.length === 0 ||
        this.state.dialogContent.status === status,
      notificationOpen: false,
      notificationMessage: '',
    });
  }

  handleStatusUpdate() {
    api.send(`/log/${this.state.appId}/${this.state.dialogContent.id}/status`, 'PUT', {
      status: this.state.newLogStatus,
    }).then(() => {
      this.state.logs.find(item => item.id === this.state.dialogContent.id)
        .status = this.state.newLogStatus;

      this.setState({
        logs: this.state.logs,
        dialogOpen: false,
        notificationOpen: false,
        notificationMessage: '',
      });
    }, (err) => {
      this.setState({
        notificationOpen: true,
        notificationMessage: `Failed to update status: ${err.reasonText}`,
      });
    });
  }

  render() {
    const self = this;
    const actions = [
      <FlatButton
        label="Update"
        primary
        disabled={this.state.statusUpdateButtonDisabled}
        keyboardFocused
        onTouchTap={this.handleStatusUpdate}
      />,
      <FlatButton
        label="Close"
        primary
        keyboardFocused
        onTouchTap={this.handleDialogClose}
      />,
    ];

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <TopBar title={this.state.application.name} />
          <Table onRowSelection={this.handleRowSelection}>
            <TableHeader
              displaySelectAll={false}
              adjustForCheckbox={false}
            >
              <TableRow>
              {
                self.state.columns.map((column) =>
                  <TableHeaderColumn
                    key={column.columnNumber}
                  >
                    {column.header}
                  </TableHeaderColumn>)
              }
              </TableRow>
            </TableHeader>
            <TableBody
              showRowHover
              displayRowCheckbox={false}
            >
              {
                self.state.logs.map((log) =>
                  <TableRow key={log.id}>
                  {
                    self.state.columns.map((column) => {
                      if (column.icon) {
                        return (<TableRowColumn key={column.columnNumber}>
                          {log[column.rowProperty] &&
                            <a title={column.title}><FileAttachment /></a>}
                        </TableRowColumn>);
                      }
                      return (<TableRowColumn key={column.columnNumber}>
                        <a title={log[column.rowProperty]}>
                          {log[column.rowProperty]}</a>
                      </TableRowColumn>);
                    })
                  }
                  </TableRow>
                )
              }
            </TableBody>
          </Table>
          <Dialog
            title={this.state.dialogTitle}
            modal={false}
            actions={actions}
            onRequestClose={this.handleDialogClose}
            open={this.state.dialogOpen}
          >
            <TextBox
              value={this.state.dialogContent.status}
              onChange={this.handleStatusChange}
              type={'text'} hint={''}
              floatingLabel={''}
            />
            <div>Description: {this.state.dialogContent.description}</div>
            <div>Reporter: {this.state.dialogContent.reporter}</div>
            <div>Version: {this.state.dialogContent.version}</div>
            <div>Platform: {this.state.dialogContent.platform}</div>
            <Divider />
            <List>
              {this.state.dialogContent.config &&
                <ListItem
                  primaryText="Config File"
                  rightIcon={<FileAttachment />}
                  onTouchTap={() => this.handleDownloadFile(this.state.dialogContent.id,
                    'config')}
                />}
                {this.state.dialogContent.log &&
                  <ListItem
                    primaryText="Log File"
                    rightIcon={<FileAttachment />}
                    onTouchTap={() => this.handleDownloadFile(this.state.dialogContent.id,
                      'log')}
                  />}
                {this.state.dialogContent.screenShot &&
                  <ListItem
                    primaryText="Screen Shot"
                    rightIcon={<ImageImage />}
                    onTouchTap={() => this.handleDownloadScreenShot(this.state.dialogContent.id,
                      'screenShot')}
                  />}
            </List>
          </Dialog>
          <Notification
            open={this.state.notificationOpen}
            message={this.state.notificationMessage}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default AppLogs;
