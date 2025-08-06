import { TimeSeriesData, TimeSeries } from '@perses-dev/core';
import { TimeSeriesQueryPlugin, replaceVariables } from '@perses-dev/plugin-system';
import { ClickHouseTimeSeriesQuerySpec, DatasourceQueryResponse } from './click-house-query-types';
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

type LogEntry = {
  Body?: string;
  LogAttributes?: {
    [key: string]: string;
  };
  ResourceAttributes?: {
    [key: string]: string;
  };
  ScopeAttributes?: {
    [key: string]: string;
  };
  ScopeName?: string;
  ScopeVersion?: string;
  ScopeSchemaUrl?: string;
  ServiceName?: string;
  SeverityNumber?: string;
  SeverityText?: string;
  SpanId?: string;
  Timestamp: string;
  TraceFlags?: string;
  TraceId?: string;
};

function convertStreamsToLogs(streams: LogEntry[]) {
  const entries = streams.map((entry) => ({
    timestamp: entry.Timestamp,
    severityNumber: entry.SeverityNumber,
    severityText: entry.SeverityText,
    serviceName: entry.ServiceName,
    body: entry.Body,
    k8sMetadata: entry.ResourceAttributes,
    logAttributes: entry.LogAttributes,
    trace: {
      traceId: entry.TraceId,
      spanId: entry.SpanId,
      traceFlags: entry.TraceFlags,
    },
  }));

  return {
    entries,
    totalCount: entries.length,
  };
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
  console.log('query response+++', response);

  // const chartData: TimeSeriesData = {
  //   series: buildTimeSeries(response),
  //   timeRange: { start, end },
  //   stepMs: 30 * 1000,
  //   metadata: {
  //     executedQueryString: query,
  //   },
  // };

  // return chartData;
  const logs = convertStreamsToLogs(response.data);
  return {
    series: [],
    timeRange: { start, end },
    logs,
    metadata: {
      executedQueryString: query,
    },
  };
};
