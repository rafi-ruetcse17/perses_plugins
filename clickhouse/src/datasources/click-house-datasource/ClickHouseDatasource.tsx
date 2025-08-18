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

import { fetch } from '@perses-dev/core';
import { DatasourcePlugin } from '@perses-dev/plugin-system';
import { ClickHouseDatasourceSpec, ClickHouseDatasourceClient } from './click-house-datasource-types';
import { ClickHouseDatasourceEditor } from './ClickHouseDatasourceEditor';

const createClient: DatasourcePlugin<ClickHouseDatasourceSpec, ClickHouseDatasourceClient>['createClient'] = (
  spec,
  options
) => {
  const { directUrl, proxy, username, password } = spec;
  const { proxyUrl } = options;

  const datasourceUrl = directUrl ?? proxyUrl;
  if (datasourceUrl === undefined) {
    throw new Error(
      'No URL specified for ClickHouseDatasource client. You can use directUrl in the spec to configure it.'
    );
  }

  const specHeaders = proxy?.spec.headers || {};

  // Add Basic Auth header if credentials are provided
  if (username && password) {
    const credentials = btoa(`${username}:${password}`);
    specHeaders['Authorization'] = `Basic ${credentials}`;
  }

  return {
    options: {
      datasourceUrl,
    },
    query: async (params, headers) => {
      // Use the actual query from params, not hardcoded
      if (!params.query) {
        throw new Error('No query provided in params');
      }

      let finalQuery = params.query.trim();
      if (!finalQuery.toUpperCase().includes('FORMAT')) {
        finalQuery += ' FORMAT JSON';
      }

      // Option 2: Use GET with properly encoded query parameter
      const url = new URL(datasourceUrl);
      url.searchParams.set('query', finalQuery);
      url.searchParams.set('database', params.database || 'default');

      const init = {
        method: 'GET',
        headers: {
          ...specHeaders,
          ...headers,
        },
      };

      try {
        const response = await fetch(url.toString(), init);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('ClickHouse error response:', errorText);
          return {
            status: 'error',
            data: [],
            warnings: [errorText],
          };
        }

        const body = await response.json();

        return {
          status: 'success',
          data: body.data || body,
        };
      } catch (e) {
        console.error('ClickHouse query failed:', e);
        throw new Error(`ClickHouse query failed: ${e}`);
      }
    },
  };
};

export const ClickHouseDatasource: DatasourcePlugin<ClickHouseDatasourceSpec, ClickHouseDatasourceClient> = {
  createClient,
  OptionsEditorComponent: ClickHouseDatasourceEditor,
  createInitialOptions: () => ({
    directUrl: '',
    username: '',
    password: '',
  }),
};
