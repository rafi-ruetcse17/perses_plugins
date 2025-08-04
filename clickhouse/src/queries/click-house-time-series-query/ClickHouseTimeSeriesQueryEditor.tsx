import {
  DatasourceSelect,
  DatasourceSelectProps,
  isVariableDatasource,
  OptionsEditorProps,
} from '@perses-dev/plugin-system';
import { ReactElement, useEffect, useState } from 'react';
import { ClickHouseTimeSeriesQuerySpec } from './click-house-time-series-query-types';
import { DATASOURCE_KIND, DEFAULT_DATASOURCE } from './constants';
type ClickHouseTimeSeriesQueryEditorProps = OptionsEditorProps<ClickHouseTimeSeriesQuerySpec>;
export function ClickHouseTimeSeriesQueryEditor(props: ClickHouseTimeSeriesQueryEditorProps): ReactElement {
  const { onChange, value } = props;
  const { datasource } = value;
  const selectedDatasource = datasource ?? DEFAULT_DATASOURCE;
  const [localQuery, setLocalQuery] = useState(value.query || '');
  const handleDatasourceChange: DatasourceSelectProps['onChange'] = (newDatasourceSelection) => {
    console.log('Datasource changed:', {
      currentDatasource: value.datasource,
      newDatasource: newDatasourceSelection,
      fullValue: value,
    });
    if (!isVariableDatasource(newDatasourceSelection) && newDatasourceSelection.kind === DATASOURCE_KIND) {
      onChange({ ...value, datasource: newDatasourceSelection });
      return;
    }
    throw new Error('Got unexpected non ClickHouse datasource selection');
  };
  const handleQueryChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newQuery = event.target.value;
    setLocalQuery(newQuery);
  };
  const handleQueryBlur = (event: React.FocusEvent<HTMLTextAreaElement>) => {
    console.log('Query input blurred:', event.target.value);
    const newQuery = event.target.value;
    if (newQuery !== value.query) {
      onChange({ ...value, query: newQuery });
    }
  };
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      // Trigger onChange to run the query
      const newQuery = (event.target as HTMLTextAreaElement).value;
      if (newQuery !== value.query) {
        onChange({ ...value, query: newQuery });
      }
    }
  };
  useEffect(() => {
    setLocalQuery(value.query || '');
  }, [value.query]);
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '16px',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#fafafa',
    marginTop: '10px',
  };
  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#333',
  };
  const textareaStyle: React.CSSProperties = {
    width: '100%',
    height: '120px',
    padding: '12px',
    border: '1px solid #d0d0d0',
    borderRadius: '4px',
    fontSize: '13px',
    color: '#000',
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    resize: 'vertical',
    backgroundColor: '#fff',
    lineHeight: '1.4',
  };
  const hintStyle: React.CSSProperties = {
    fontSize: '12px',
    color: '#666',
    fontStyle: 'italic',
    marginTop: '4px',
  };
  const examplesStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#777',
    backgroundColor: '#f5f5f5',
    padding: '8px',
    borderRadius: '4px',
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.3',
  };
  return (
    <>
      <DatasourceSelect
        datasourcePluginKind={DATASOURCE_KIND}
        value={selectedDatasource}
        onChange={handleDatasourceChange}
        label="ClickHouse Datasource"
        notched
      />
      <div style={containerStyle}>
        <div>
          <div style={labelStyle}>Query</div>
          <textarea
            value={localQuery}
            onChange={handleQueryChange}
            onBlur={handleQueryBlur}
            onKeyDown={handleKeyDown}
            placeholder="Enter your ClickHouse SQL query here..."
            style={textareaStyle}
          />
          <div style={hintStyle}>Press Ctrl+Enter (Cmd+Enter on Mac) to execute query</div>
        </div>
        <details>
          <summary style={{ cursor: 'pointer', fontSize: '12px', color: '#666', marginBottom: '8px' }}>
            Query Examples
          </summary>
          <div style={examplesStyle}>
            {`-- Time Series Query
SELECT 
  toStartOfMinute(timestamp) as time,
  avg(cpu_usage) as avg_cpu,
  max(memory_usage) as max_memory
FROM system_metrics 
WHERE timestamp BETWEEN '{start}' AND '{end}'
GROUP BY time ORDER BY time
-- Logs Query  
SELECT 
  timestamp as time,
  level,
  message,
  service_name
FROM application_logs 
WHERE timestamp >= '{start}' 
ORDER BY time DESC LIMIT 1000
-- Traces Query
SELECT 
  start_time as time,
  trace_id,
  service_name,
  duration_ms
FROM traces 
WHERE start_time >= '{start}'
ORDER BY time DESC`}
          </div>
        </details>
      </div>
    </>
  );
}
