import React from 'react';
import fetch from 'isomorphic-fetch';
import { ApiContext } from '@newfrontdoor/api-config';
import CurrentSeries from './current-series';

class CurrentSeriesContainerDrupal extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      loading: true,
      error: null,
      seriesData: {}
    };
  }

  componentDidMount() {
    this.getCurrentSeries()
      .then(response => {
        // This transform could moved out into generic (Drupal => NFD) component structure for sermon series
        const transformedSeriesData = response.map(x => ({
          title: x.node_title,
          image: x['series thumbnail'],
          link: x.url,
          id: x.series_id
        }));
        this.setState({
          seriesData: transformedSeriesData,
          loading: false
        });
      })
      .catch(error => {
        this.setState({
          error
        });
      });
  }

  getCurrentSeries = () => {
    return fetch(
      `${this.props.baseUrl}current_series_api?display_id=services_1`
    ).then(resp => resp.json());
  };

  render() {
    return <CurrentSeries {...this.state} />;
  }
}

export default function() {
  return (
    <ApiContext.Consumer>
      {({baseUrl}) => <CurrentSeriesContainerDrupal baseUrl={baseUrl} />}
    </ApiContext.Consumer>
  );
}

