import React from 'react';
import { deepOrange500 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Table, TableBody, TableHeader,
  TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import FileAttachment from 'material-ui/svg-icons/file/attachment';
import TopBar from './topBar';
import session from '../models/session';
import api from '../services/api';

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
    style: { width: '17rem' },
  }, {
    header: 'Status',
    rowProperty: 'status',
    columnNumber: 2,
    style: { width: '4rem' },
  }, {
    header: 'Description',
    rowProperty: 'description',
    columnNumber: 3,
  }, {
    header: 'Log',
    rowProperty: 'log',
    columnNumber: 4,
    file: true,
    style: { width: '1rem' },
    title: 'Click to download log file',
  }, {
    header: 'ScreenShot',
    rowProperty: 'screenShot',
    columnNumber: 5,
    file: true,
    style: { width: '1rem' },
    title: 'Click to download screen shot',
  },
];

class AppLogs extends React.Component {
  constructor(props) {
    super(props);
    this.handleCellClick = this.handleCellClick.bind(this);
    this.state = {
      application: {},
      columns: COLUMNS,
      appId: session.get('selectedApp'),
      logs: [],
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

  handleCellClick(rowNumber, columnId) {
    const column = this.state.columns.find(col => col.columnNumber === columnId);

    if (column.file) {
      const logId = this.state.logs[rowNumber].id;

      api.send(`/log/${this.state.appId}/${logId}/${column.rowProperty}`, 'GET').then((logs) => {
        const w = window.open('');

        w.document.write(`<head><title>${column.rowProperty}:${logId}</title></head>
          <body><p>${logs[0][column.rowProperty]}</p></body>`);
      });
    }
  }

  render() {
    const self = this;
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <TopBar title={this.state.application.name} />
          <Table onCellClick={this.handleCellClick}>
            <TableHeader
              displaySelectAll={false}
              adjustForCheckbox={false}
            >
              <TableRow>
              {
                self.state.columns.map((column) =>
                  <TableHeaderColumn key={column.columnNumber}>
                    {column.header}</TableHeaderColumn>)
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
                      if (column.file) {
                        return (<TableRowColumn key={column.columnNumber} style={column.style}>
                          {log[column.rowProperty] &&
                            <a title={column.title}><FileAttachment /></a>}
                        </TableRowColumn>);
                      }
                      return (<TableRowColumn key={column.columnNumber} style={column.style}>
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
        </div>
      </MuiThemeProvider>
    );
  }
}

export default AppLogs;
