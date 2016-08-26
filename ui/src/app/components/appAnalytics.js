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
const DoughnutChart = require('react-chartjs').Doughnut;

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

const fillColor2 = 'rgba(215,40,40,0.2)';
const pointColor2 = 'rgba(215,40,40,1)';
const pointHighlightFill2 = '#fff';
const pointHighlightStroke2 = 'rgba(215,40,40,1)';
const pointStrokeColor2 = '#fff';
const strokeColor2 = 'rgba(215,40,40,1)';

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
                label: 'Issue',
                fillColor,
                strokeColor,
                pointColor,
                pointStrokeColor,
                pointHighlightFill,
                pointHighlightStroke,
                data: [],
              },
              {
                label: 'Jira',
                fillColor: fillColor2,
                strokeColor: strokeColor2,
                pointColor: pointColor2,
                pointStrokeColor: pointStrokeColor2,
                pointHighlightFill: pointHighlightFill2,
                pointHighlightStroke: pointHighlightStroke2,
                data: [],
              },
            ],
          },
        },
        issueVsJiraData: {
          data: [
            {
              value: 0,
              color: '#949FB1',
              highlight: '#A8B3C5',
              label: 'Issue',
            },
            {
              value: 0,
              color: '#F7464A',
              highlight: '#FF5A5E',
              label: 'Jira',
            },
          ],
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
        },
      },
    };

    api.send(`/log/${this.state.appId}/analytics`, 'GET').then((result) => {
      const analytics = this.state.analytics;
      const issueCreationCount = result.issueCreationCount;
      const jiraCreationCount = result.jiraCreationCount;
      const platfromCount = result.platformCount;
      const reporterCount = result.reporterCount;
      const statusCount = result.statusCount;
      let totalIssueCount = 0;
      let totalJiraCount = 0;

      for (const i of issueCreationCount.entries()) {
        analytics.issueCreationCountData.data.labels.push(`Week ${i[1]._id.date}`);
        analytics.issueCreationCountData.data.datasets[0].data.push(i[1].count);
        totalIssueCount += i[1].count;

        const jData = jiraCreationCount.find((item) =>
          (item._id.date === i[1]._id.date)
        );

        const jiraCount = jData ? jData.count : 0;
        analytics.issueCreationCountData.data.datasets[1].data.push(jiraCount);
        totalJiraCount += jiraCount;
      }

      analytics.issueVsJiraData.data[0].value = totalIssueCount - totalJiraCount;
      analytics.issueVsJiraData.data[1].value = totalJiraCount;

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
          <Subheader>Issue-Jira creation counts per week</Subheader>
          <LineChart
            data={this.state.analytics.issueCreationCountData.data}
            width="600"
            height="250"
            redraw
          />
          <Subheader>Issue distribution by platfrom</Subheader>
          <BarChart
            data={this.state.analytics.platformCountData.data}
            width="600"
            height="250"
            redraw
          />
          <Subheader>Issue distribution by reporter</Subheader>
          <BarChart
            data={this.state.analytics.reporterCountData.data}
            width="600"
            height="250"
            redraw
          />
          <Subheader>Issue distribution by status</Subheader>
          <BarChart
            data={this.state.analytics.statusCountData.data}
            width="600"
            height="250"
            redraw
          />
          <Subheader>Issue vs Jira distribution</Subheader>
          <DoughnutChart
            data={this.state.analytics.issueVsJiraData.data}
            width="600"
            height="250"
            redraw
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default AppAnalytics;
