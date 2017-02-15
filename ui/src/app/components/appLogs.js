import React from 'react';
import { deepOrange500 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Table, TableBody, TableHeader,
  TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import TopBar from './topBar';
import session from '../models/session';
import api from '../services/api';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import { List } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import TextBox from './textBox';
import Notification from './notification';
import ConfigFileListItem from './configFileListItem';
import LogFileListItem from './logFileListItem';
import ScreenShotListItem from './screenShotListItem';

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
  }, {
    header: 'Platform',
    rowProperty: 'platform',
    columnNumber: 4,
  },
];

let allLogs = [];

class AppLogs extends React.Component {
  constructor(props) {
    super(props);
    this.handleRowSelection = this.handleRowSelection.bind(this);
    this.handleLogDialogClose = this.handleLogDialogClose.bind(this);
    this.handleDownloadFile = this.handleDownloadFile.bind(this);
    this.handleDownloadScreenShot = this.handleDownloadScreenShot.bind(this);
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleLogStatusUpdate = this.handleLogStatusUpdate.bind(this);
    this.handleLogDelete = this.handleLogDelete.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
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
      allLogs = logs;
      this.setState({
        logs,
      });
    });
  }

  handleLogDialogClose() {
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

  handleLogStatusUpdate() {
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

  handleLogDelete() {
    api.send(`/log/${this.state.appId}/${this.state.dialogContent.id}`, 'DELETE')
    .then(() => {
      const logs = this.state.logs;
      logs.splice(logs.indexOf(logs.find(log => log.id === this.state.dialogContent.id)), 1);

      this.setState({
        logs,
        dialogOpen: false,
        notificationOpen: false,
        notificationMessage: '',
      });
    }, (err) => {
      this.setState({
        notificationOpen: true,
        notificationMessage: `Failed to delete log: ${err.reasonText}`,
      });
    });
  }

  handleFilterChange(filterString) {
    // TODO: need to have debounce here
    let filtered = allLogs;
    if (filterString.length > 0) {
      filtered = allLogs.filter((item) => {
        let found = false;
        Object.keys(item).forEach((key) => {
          if (item && item.hasOwnProperty(key) &&
              item[key].includes &&
              item[key].toLowerCase().includes(filterString.toLowerCase())) {
            found = true;
          }
        });
        return found;
      });
    }

    this.setState({
      logs: filtered,
      dialogOpen: false,
      notificationOpen: false,
      notificationMessage: '',
    });
  }

  render() {
    const self = this;
    const actions = [
      <FlatButton
        label="Delete"
        secondary
        disabled={false}
        keyboardFocused
        onTouchTap={this.handleLogDelete}
      />,
      <FlatButton
        label="Update"
        primary
        disabled={this.state.statusUpdateButtonDisabled}
        keyboardFocused
        onTouchTap={this.handleLogStatusUpdate}
      />,
      <FlatButton
        label="Close"
        primary
        keyboardFocused
        onTouchTap={this.handleLogDialogClose}
      />,
    ];

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <TopBar title={this.state.application.name} />
          <TextBox
            disableErrorText
            fullWidth
            onChange={this.handleFilterChange}
            type={'text'} hint={'Filter...'}
            floatingLabel={'Filter by ID, Status or Description'}
          />
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
                      if (log[column.rowProperty] &&
                          log[column.rowProperty].match(/^(http|https|www)/)) {
                        return (<TableRowColumn key={column.columnNumber}>
                          <a
                            title={log[column.rowProperty]}
                            href={log[column.rowProperty]}
                            target="_blank"
                          >
                            {log[column.rowProperty]}
                          </a>
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
            onRequestClose={this.handleLogDialogClose}
            open={this.state.dialogOpen}
          >
            <TextBox
              fullWidth
              value={this.state.dialogContent.status}
              onChange={this.handleStatusChange}
              type={'text'} hint={''}
              floatingLabel={''}
            />
            <div>Description: {this.state.dialogContent.description}</div>
            <div>Reporter: {this.state.dialogContent.reporter}</div>
            <div>Version: {this.state.dialogContent.version}</div>
            <div>Platform: {this.state.dialogContent.platform}</div>
            <div>Date: {new Date(this.state.dialogContent.date).toGMTString()}</div>
            <Divider />
            <List>
              {this.state.dialogContent.config &&
                <ConfigFileListItem
                  logId={this.state.dialogContent.id}
                  appId={this.state.appId}
                />}
                {this.state.dialogContent.log &&
                  <LogFileListItem
                    logId={this.state.dialogContent.id}
                    appId={this.state.appId}
                  />}
                {this.state.dialogContent.screenShot &&
                  <ScreenShotListItem
                    logId={this.state.dialogContent.id}
                    appId={this.state.appId}
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
