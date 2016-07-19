import React from 'react';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import FileAttachment from 'material-ui/svg-icons/file/attachment';
import TopBar from './topBar';
import session from '../models/session';
import api from '../services/api';

const styles = {
  container: {
    textAlign: 'center'
  },
};

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

const COLUMNS = [{
    header: 'ID',
    rowProperty: 'id',
    columnNumber: 1
}, {
    header: 'Status',
    rowProperty: 'status',
    columnNumber: 2
}, {
    header: 'Description',
    rowProperty: 'description',
    columnNumber: 3
}, {
    header: 'Log',
    rowProperty: 'log',
    columnNumber: 4,
    file: true,
    title: 'Click to download log file'
}, {
    header: 'ScreenShot',
    rowProperty: 'screenShot',
    columnNumber: 5,
    file: true,
    title: 'Click to download screen shot'
}, {
    header: 'Reporter',
    rowProperty: 'reporter',
    columnNumber: 6
}, {
    header: 'Platform',
    rowProperty: 'platform',
    columnNumber: 7
}, {
    header: 'Version',
    rowProperty: 'version',
    columnNumber: 8
}, {
    header: 'Config',
    rowProperty: 'config',
    columnNumber: 9
}]

class AppLogs extends React.Component {
  constructor(props) {
    super(props);
    this.handleCellClick = this.handleCellClick.bind(this);
    this.state = {
      application: {},
      columns: COLUMNS,
      appId: session.get('selectedApp'),
      logs: []
    };

    console.log('app logs state: ', this.state);
    api.send('/application/' + this.state.appId, 'GET').then((application)=>{
      this.setState({
        application: application
      });
    });
    api.send('/log/' + this.state.appId, 'GET').then((logs) => {
      this.setState({
        logs: logs
      });
    });
  }

  handleCellClick(rowNumber , columnId) {
    let column = this.state.columns.find(column => column.columnNumber === columnId);
    if (column.file) {
      let logId = this.state.logs[rowNumber].id;
      console.log('download ' + column.rowProperty + ' of log: ' + logId);
      api.send('/log/' + this.state.appId + '/' + logId + '/' + column.rowProperty, 'GET').then((logs) => {
        let w = window.open('');
        w.document.write('<head><title>' + column.rowProperty + ': ' + logId + '</title></head><body><p>'+ logs[0][column.rowProperty] +'</p></body>');
      });
    }
  }

  render() {
    let self = this;
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <TopBar title={this.state.application.name}/>
          <Table
            onCellClick={this.handleCellClick}>
            <TableHeader
              displaySelectAll={false}
              adjustForCheckbox={false}>
              <TableRow>
                {self.state.columns.map(function(column) {
                    return <TableHeaderColumn key={column.columnNumber}>{column.header}</TableHeaderColumn>
                })}
              </TableRow>
            </TableHeader>
            <TableBody
              showRowHover={true}
              displayRowCheckbox={false}>
              {self.state.logs.map(function(log) {
                  return <TableRow key={log.id}>
                    {self.state.columns.map(function(column) {
                      if(column.file){
                          return <TableRowColumn key={column.columnNumber}>{log[column.rowProperty] && <a title={column.title}><FileAttachment /></a>}</TableRowColumn>
                      }
                      else {
                          return <TableRowColumn key={column.columnNumber}><a title={log[column.rowProperty]}>{log[column.rowProperty]}</a></TableRowColumn>
                      }
                    })}
                  </TableRow>
              })}
            </TableBody>
          </Table>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default AppLogs;
