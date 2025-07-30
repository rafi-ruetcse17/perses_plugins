import { HTTPSettingsEditor } from '@perses-dev/plugin-system';
import React, { ReactElement } from 'react';
import { ClickHouseDatasourceSpec } from './click-house-datasource-types';

export interface ClickHouseDatasourceEditorProps {
  value: ClickHouseDatasourceSpec;
  onChange: (next: ClickHouseDatasourceSpec) => void;
  isReadonly?: boolean;
}

export function ClickHouseDatasourceEditor(props: ClickHouseDatasourceEditorProps): ReactElement {
  const { value, onChange, isReadonly } = props;

  const initialSpecDirect: ClickHouseDatasourceSpec = {
    directUrl: '',
  };

  const initialSpecProxy: ClickHouseDatasourceSpec = {
    proxy: {
      kind: 'HTTPProxy',
      spec: {
        allowedEndpoints: [
          // Adjust based on your API
          {
            endpointPattern: '/api/search',
            method: 'GET',
          },
        ],
        url: '',
      },
    },
  };

  return (
    <HTTPSettingsEditor
      value={value}
      onChange={onChange}
      isReadonly={isReadonly}
      initialSpecDirect={initialSpecDirect}
      initialSpecProxy={initialSpecProxy}
    />
  );
}
