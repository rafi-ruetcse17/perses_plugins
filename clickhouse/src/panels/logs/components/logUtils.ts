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

import { LogEntry } from '../../../model/click-house-data-types';

export const getSeverity = (log: LogEntry): 'info' | 'warn' | 'error' | 'debug' | 'unknown' => {
  //   const message = log.line.toLowerCase();
  //   const level = log.labels.level?.toLowerCase();
  const message = 'error';
  const level = 'error';

  if (level) {
    if (level.includes('error') || level.includes('err')) return 'error';
    if (level.includes('warn')) return 'warn';
    if (level.includes('info')) return 'info';
    if (level.includes('debug')) return 'debug';
  }

  if (message.includes('error') || message.includes('exception') || message.includes('fail')) {
    return 'error';
  }
  if (message.includes('warn')) return 'warn';
  if (message.includes('info')) return 'info';
  if (message.includes('debug')) return 'debug';

  return 'unknown';
};
