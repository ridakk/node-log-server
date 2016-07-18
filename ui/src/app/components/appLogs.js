import React from 'react';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
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

class AppLogs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      application: {},
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

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <TopBar title={this.state.application.name}/>
          <Table>
            <TableHeader
              displaySelectAll={false}
              adjustForCheckbox={false}>
              <TableRow>
                <TableHeaderColumn>ID</TableHeaderColumn>
                <TableHeaderColumn>Status</TableHeaderColumn>
                <TableHeaderColumn>Description</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody
              showRowHover={true}
              displayRowCheckbox={false}>
              {this.state.logs.map(function(log) {
                  return <TableRow key={log.id}>
                    <TableRowColumn>{log.id}</TableRowColumn>
                    <TableRowColumn>{log.status}</TableRowColumn>
                    <TableRowColumn>{log.description}</TableRowColumn>
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
