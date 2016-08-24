/* eslint no-underscore-dangle: 0 */

import React from 'react';
import { deepOrange500 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Subheader from 'material-ui/Subheader';
import TopBar from './topBar';
import session from '../models/session';
import api from '../services/api';

const LineChart = require('react-chartjs').Line;
const BarChart = require('react-chartjs').Bar;

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

const fillColor = 'rgba(151,187,205,0.2)';
const pointColor = 'rgba(151,187,205,1)';
const pointHighlightFill = '#fff';
const pointHighlightStroke = 'rgba(151,187,205,1)';
const pointStrokeColor = '#fff';
const strokeColor = 'rgba(151,187,205,1)';

class AppAnalytics extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appId: session.get('selectedApp'),
      analytics: {
        issueCreationCountData: {
          data: {
            labels: [],
            datasets: [
              {
                label: 'Issue creation counts per week',
                data: [],
                fillColor,
                pointColor,
                pointHighlightFill,
                pointHighlightStroke,
                pointStrokeColor,
                strokeColor,
              },
            ],
          },
          options: {
          },
        },
        platformCountData: {
          data: {
            labels: [],
            datasets: [
              {
                label: 'Issue distribution by platfrom',
                data: [],
                fillColor,
                pointColor,
                pointHighlightFill,
                pointHighlightStroke,
                pointStrokeColor,
                strokeColor,
              },
            ],
          },
          options: {
          },
        },
        reporterCountData: {
          data: {
            labels: [],
            datasets: [
              {
                label: 'Issue distribution by reporter',
                data: [],
                fillColor,
                pointColor,
                pointHighlightFill,
                pointHighlightStroke,
                pointStrokeColor,
                strokeColor,
              },
            ],
          },
          options: {
          },
        },
        statusCountData: {
          data: {
            labels: [],
            datasets: [
              {
                label: 'Issue distribution by status',
                data: [],
                fillColor,
                pointColor,
                pointHighlightFill,
                pointHighlightStroke,
                pointStrokeColor,
                strokeColor,
              },
            ],
          },
          options: {
          },
        },
      },
    };

    api.send(`/log/${this.state.appId}/analytics`, 'GET').then((result) => {
      const analytics = this.state.analytics;
      const issueCreationCount = result.issueCreationCount;
      const platfromCount = result.platformCount;
      const reporterCount = result.reporterCount;
      const statusCount = result.statusCount;

      for (const i of issueCreationCount.entries()) {
        analytics.issueCreationCountData.data.labels.push(i[1]._id.date);
        analytics.issueCreationCountData.data.datasets[0].data.push(i[1].count);
      }

      for (const i of platfromCount.entries()) {
        analytics.platformCountData.data.labels.push(i[1]._id);
        analytics.platformCountData.data.datasets[0].data.push(i[1].count);
      }

      for (const i of reporterCount.entries()) {
        analytics.reporterCountData.data.labels.push(i[1]._id);
        analytics.reporterCountData.data.datasets[0].data.push(i[1].count);
      }

      const noJiraNoDuplicateArray = statusCount.filter((item) =>
        (item._id.indexOf('jira.genband.com') === -1 && item._id.indexOf('Duplicate: ') === -1)
      );
      for (const i of noJiraNoDuplicateArray.entries()) {
        analytics.statusCountData.data.labels.push(i[1]._id);
        analytics.statusCountData.data.datasets[0].data.push(i[1].count);
      }

      const onlyJiraArray = statusCount.filter((item) =>
        (item._id.indexOf('jira.genband.com') !== -1)
      );
      if (onlyJiraArray.length > 0) {
        analytics.statusCountData.data.labels.push('Jira');
        let count = 0;
        for (const i of onlyJiraArray.entries()) {
          count += i[1].count;
        }
        analytics.statusCountData.data.datasets[0].data.push(count);
      }

      const onlyDuplicateArray = statusCount.filter((item) =>
        (item._id.indexOf('Duplicate: ') !== -1)
      );
      if (onlyDuplicateArray.length > 0) {
        analytics.statusCountData.data.labels.push('Duplicate');
        let count = 0;
        for (const i of onlyDuplicateArray.entries()) {
          count += i[1].count;
        }
        analytics.statusCountData.data.datasets[0].data.push(count);
      }

      this.setState({
        analytics,
      });
    });
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
          <TopBar title={'App Analytics'} />
          <Subheader>Issue creation counts per week</Subheader>
          <LineChart
            data={this.state.analytics.issueCreationCountData.data}
            options={this.state.analytics.issueCreationCountData.options}
            width="600"
            height="250"
          />
          <Subheader>Issue distribution by platfrom</Subheader>
          <BarChart
            data={this.state.analytics.platformCountData.data}
            options={this.state.analytics.platformCountData.options}
            width="600"
            height="250"
          />
          <Subheader>Issue distribution by reporter</Subheader>
          <BarChart
            data={this.state.analytics.reporterCountData.data}
            options={this.state.analytics.reporterCountData.options}
            width="600"
            height="250"
          />
          <Subheader>Issue distribution by status</Subheader>
          <BarChart
            data={this.state.analytics.statusCountData.data}
            options={this.state.analytics.statusCountData.options}
            width="600"
            height="250"
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default AppAnalytics;
