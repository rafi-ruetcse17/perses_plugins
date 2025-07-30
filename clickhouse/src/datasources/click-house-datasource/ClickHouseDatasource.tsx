import { fetch } from '@perses-dev/core';
import { DatasourcePlugin } from '@perses-dev/plugin-system';
import { ClickHouseDatasourceSpec, ClickHouseDatasourceClient } from './click-house-datasource-types';
import { ClickHouseDatasourceEditor } from './ClickHouseDatasourceEditor';

const createClient: DatasourcePlugin<ClickHouseDatasourceSpec, ClickHouseDatasourceClient>['createClient'] = (spec, options) => {
  const { directUrl, proxy } = spec;
  const { proxyUrl } = options;

  // Use the direct URL if specified, but fallback to the proxyUrl by default if not specified
  const datasourceUrl = directUrl ?? proxyUrl;
  if (datasourceUrl === undefined) {
    throw new Error('No URL specified for ClickHouseDatasource client. You can use directUrl in the spec to configure it.');
  }

  const specHeaders = proxy?.spec.headers;

  return {
    options: {
      datasourceUrl,
    },
    query: async (params, headers) => {
      let url = `${datasourceUrl}/api/search`;
      if (params) {
        url += '?' + new URLSearchParams(params as Record<string, string>);
      }
      const init = {
        method: 'GET',
        headers: headers ?? specHeaders,
      };

      const response = await fetch(url, init);

      try {
        const body = await response.json();
        return {
          status: response.ok ? 'success' : 'error',
          data: body.data,
        };
      } catch (e) {
        console.error('Invalid response from server', e);
        throw new Error('Invalid response from server');
      }
    },
  };
};

export const ClickHouseDatasource: DatasourcePlugin<ClickHouseDatasourceSpec, ClickHouseDatasourceClient> = {
  createClient,
  OptionsEditorComponent: ClickHouseDatasourceEditor,
  createInitialOptions: () => ({ directUrl: '' }),
};