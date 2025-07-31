import { TimeSeriesData, TimeSeries } from '@perses-dev/core';
import { TimeSeriesQueryPlugin, replaceVariables } from '@perses-dev/plugin-system';
import { ClickHouseTimeSeriesQuerySpec, DatasourceQueryResponse } from './click-house-time-series-query-types';
import { DEFAULT_DATASOURCE } from './constants';

function buildTimeSeries(response?: DatasourceQueryResponse): TimeSeries[] {
  if (!response || !response.data || response.data.length === 0) {
    return [];
  }

  const values: Array<[number, number]> = response.data.map((row) => {
    const timestamp = new Date(row.time).getTime();
    const value = Number(row.log_count);
    return [timestamp, value];
  });

  return [
    {
      name: 'log_count',
      values,
    },
  ];
}

export const getTimeSeriesData: TimeSeriesQueryPlugin<ClickHouseTimeSeriesQuerySpec>['getTimeSeriesData'] = async (
  spec,
  context
) => {
  if (spec.query === undefined || spec.query === null || spec.query === '') {
    return { series: [] };
  }

  const query = replaceVariables(spec.query, context.variableState);

  const client = await context.datasourceStore.getDatasourceClient(spec.datasource ?? DEFAULT_DATASOURCE);

  const { start, end } = context.timeRange;

  const response = await client.query({
    start: start.getTime().toString(),
    end: end.getTime().toString(),
    query,
  });

  const chartData: TimeSeriesData = {
    series: buildTimeSeries(response),
    timeRange: { start, end },
    stepMs: 30 * 1000,
    metadata: {
      executedQueryString: query,
    },
  };

  return chartData;
};
