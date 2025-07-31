import { TimeSeriesQueryPlugin, parseVariables } from '@perses-dev/plugin-system';
import { getTimeSeriesData } from './get-time-series-data';
import { ClickHouseTimeSeriesQueryEditor } from './ClickHouseTimeSeriesQueryEditor';
import { ClickHouseTimeSeriesQuerySpec } from './click-house-time-series-query-types';

export const ClickHouseTimeSeriesQuery: TimeSeriesQueryPlugin<ClickHouseTimeSeriesQuerySpec> = {
  getTimeSeriesData,
  OptionsEditorComponent: ClickHouseTimeSeriesQueryEditor,
  createInitialOptions: () => ({ query: '' }),
  dependsOn: (spec) => {
    const queryVariables = parseVariables(spec.query);
    const allVariables = [...new Set([...queryVariables])];
    return {
      variables: allVariables,
    };
  },
};
