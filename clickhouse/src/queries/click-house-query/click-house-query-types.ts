import { DatasourceSelector } from '@perses-dev/core';

export interface ClickHouseQuerySpec {
  query: string;
  datasource?: DatasourceSelector;
}

// TODO: import this type from your datasource or an existing datasource plugin
export type DatasourceQueryResponse = {
  status: string;
  data: any;
  warnings?: string[];
};
