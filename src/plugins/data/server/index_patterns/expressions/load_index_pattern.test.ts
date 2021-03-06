/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { IndexPatternLoadStartDependencies } from '../../../common/index_patterns/expressions';
import { getFunctionDefinition } from './load_index_pattern';

describe('indexPattern expression function', () => {
  let getStartDependencies: () => Promise<IndexPatternLoadStartDependencies>;

  beforeEach(() => {
    getStartDependencies = jest.fn().mockResolvedValue({
      indexPatterns: {
        get: (id: string) => ({
          toSpec: () => ({
            title: 'value',
          }),
        }),
      },
    });
  });

  test('returns serialized index pattern', async () => {
    const indexPatternDefinition = getFunctionDefinition({ getStartDependencies });
    const result = await indexPatternDefinition().fn(null, { id: '1' }, {
      getKibanaRequest: () => ({}),
    } as any);
    expect(result.type).toEqual('index_pattern');
    expect(result.value.title).toEqual('value');
  });

  test('throws if getKibanaRequest is not available', async () => {
    const indexPatternDefinition = getFunctionDefinition({ getStartDependencies });
    expect(async () => {
      await indexPatternDefinition().fn(null, { id: '1' }, {} as any);
    }).rejects.toThrowErrorMatchingInlineSnapshot(
      `"A KibanaRequest is required to execute this search on the server. Please provide a request object to the expression execution params."`
    );
  });
});
