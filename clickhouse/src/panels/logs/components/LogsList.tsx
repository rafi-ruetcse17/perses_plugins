import React from 'react';
import { LogEntry } from '../../../model/click-house-data-types';
import { LogsOptions } from '../logs-types';
import { EmptyLogsState } from './EmptyLogsState';
import { useExpandedRows } from './hooks/useExpandedRows';
import { VirtualizedLogsList } from './VirtualizedLogsList';

interface LogsListProps {
  logs: LogEntry[];
  spec: LogsOptions;
}

const LogsList: React.FC<LogsListProps> = ({ logs, spec }) => {
  const { expandedRows, toggleExpand } = useExpandedRows();

  if (!logs.length) {
    return <EmptyLogsState />;
  }

  return <VirtualizedLogsList logs={logs} spec={spec} expandedRows={expandedRows} onToggleExpand={toggleExpand} />;
};

export default LogsList;
