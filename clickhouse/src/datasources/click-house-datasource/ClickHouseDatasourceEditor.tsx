// Copyright 2025 The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { OptionsEditorColumn, OptionsEditorControl, OptionsEditorGrid } from '@perses-dev/components';
import { TextField, Typography } from '@mui/material';
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
          {
            endpointPattern: '/clickhouse',
            method: 'GET',
          },
        ],
        url: '',
      },
    },
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, username: event.target.value });
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, password: event.target.value });
  };

  return (
    <>
      <HTTPSettingsEditor
        value={value}
        onChange={onChange}
        isReadonly={isReadonly}
        initialSpecDirect={initialSpecDirect}
        initialSpecProxy={initialSpecProxy}
      />
      <Typography variant="h4" mb={2} mt={3}>
        Authentication
      </Typography>
      <OptionsEditorGrid>
        <OptionsEditorColumn>
          <OptionsEditorControl
            label="Username"
            control={
              <TextField
                size="small"
                variant="outlined"
                value={value.username || ''}
                onChange={handleUsernameChange}
                disabled={isReadonly}
                placeholder="ClickHouse username"
                fullWidth
              />
            }
          />
          <OptionsEditorControl
            label="Password"
            control={
              <TextField
                size="small"
                variant="outlined"
                type="password"
                value={value.password || ''}
                onChange={handlePasswordChange}
                disabled={isReadonly}
                placeholder="ClickHouse password"
                fullWidth
              />
            }
          />
        </OptionsEditorColumn>
      </OptionsEditorGrid>
    </>
  );
}
