import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import LogService from './../services/logService';


class LogTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: [{
        id: 1,
        status: 'new',
        content: '111'
      }, {
        id: 2,
        status: 'new',
        content: '111'
      }, {
        id: 3,
        status: 'new',
        content: '111'
      },{
        id: 4,
        status: 'new',
        content: '111'
      }]
    };

    LogService.getAll().then((res) => {
      console.log(res);
      this.setState({
        logs: res
      });
    }, (error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHeaderColumn>ID</TableHeaderColumn>
            <TableHeaderColumn>Content</TableHeaderColumn>
            <TableHeaderColumn>Status</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody showRowHover={true}>
          {this.state.logs.map(function(log) {
              return <TableRow key={log.id}>
                <TableRowColumn>{log.id}</TableRowColumn>
                <TableRowColumn>{log.content}</TableRowColumn>
                <TableRowColumn>{log.status}</TableRowColumn>
              </TableRow>
          })}
        </TableBody>
      </Table>
    )
  }
}

export default LogTable;
