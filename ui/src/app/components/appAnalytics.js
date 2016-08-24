import React from 'react';
import { deepOrange500 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TopBar from './topBar';
import session from '../models/session';
// import api from '../services/api';

const LineChart = require('react-chartjs').Line;

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

class AppAnalytics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appId: session.get('selectedApp'),
      lineChartData: [],
      lineChartOptions: [],
    };
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <TopBar title={'App Analytics'} />
          <LineChart
            data={this.state.lineChartData}
            options={this.state.lineChartOptions}
            width="600"
            height="250"
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default AppAnalytics;
