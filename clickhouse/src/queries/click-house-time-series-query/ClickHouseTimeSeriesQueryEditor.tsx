import { DatasourceSelect, DatasourceSelectProps, isVariableDatasource, OptionsEditorProps } from '@perses-dev/plugin-system';
import { ReactElement, useEffect, useState } from 'react';
import { ClickHouseTimeSeriesQuerySpec } from './click-house-time-series-query-types';
import { DATASOURCE_KIND, DEFAULT_DATASOURCE } from './constants';

type ClickHouseTimeSeriesQueryEditorProps = OptionsEditorProps<ClickHouseTimeSeriesQuerySpec>;

export function ClickHouseTimeSeriesQueryEditor(props: ClickHouseTimeSeriesQueryEditorProps): ReactElement {
  const { onChange, value } = props;
  const {datasource} = value;
  const selectedDatasource = datasource ?? DEFAULT_DATASOURCE;
  const [localQuery, setLocalQuery] = useState(value.query);

  const handleDatasourceChange: DatasourceSelectProps['onChange'] = (newDatasourceSelection) => {
    if(!isVariableDatasource(newDatasourceSelection) && newDatasourceSelection.kind === DATASOURCE_KIND) {
      onChange({ ...value, datasource: newDatasourceSelection });
      return;
    }

    throw new Error('Got unexpected non ClickHouseTimeSeriesQuery datasource selection');
  };

  const handleQueryBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    if (newQuery !== value.query) {
      onChange({ ...value, query: newQuery });
    }
  };

  useEffect(() => {
    setLocalQuery(value.query);
  }, [value.query]);

  return (
    <div>
      <label>ClickHouseTimeSeriesQuery Datasource</label>
      <DatasourceSelect
          datasourcePluginKind={DATASOURCE_KIND}
          value={selectedDatasource}
          onChange={handleDatasourceChange}
          label="ClickHouseTimeSeriesQuery Datasource"
          notched
        />
      <input 
        onBlur={handleQueryBlur} 
        onChange={(e) => setLocalQuery(e.target.value)} 
        placeholder='query' 
        value={localQuery} />
    </div>
  );
}
