import { TimeSeriesQueryPlugin, parseVariables } from '@perses-dev/plugin-system';
import { getTimeSeriesData } from './get-time-series-data';
import { ClickHouseQueryEditor } from './ClickHouseQueryEditor';
import { ClickHouseQuerySpec } from './click-house-query-types';

export const ClickHouseQuery: TimeSeriesQueryPlugin<ClickHouseQuerySpec> = {
  getTimeSeriesData,
  OptionsEditorComponent: ClickHouseQueryEditor,
  createInitialOptions: () => ({ query: '' }),
  dependsOn: (spec) => {
    const queryVariables = parseVariables(spec.query);
    const allVariables = [...new Set([...queryVariables])];
    return {
      variables: allVariables,
    };
  },
};
