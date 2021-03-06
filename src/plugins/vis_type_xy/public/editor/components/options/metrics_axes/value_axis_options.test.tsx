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

import React from 'react';
import { shallow } from 'enzyme';

import { Position } from '@elastic/charts';

import { TextInputOption } from '../../../../../../vis_default_editor/public';

import { ValueAxis, ScaleType } from '../../../../types';
import { LabelOptions } from './label_options';
import { ValueAxisOptions, ValueAxisOptionsParams } from './value_axis_options';
import { valueAxis, vis } from './mocks';

const POSITION = 'position';

describe('ValueAxisOptions component', () => {
  let setParamByIndex: jest.Mock;
  let onValueAxisPositionChanged: jest.Mock;
  let setMultipleValidity: jest.Mock;
  let defaultProps: ValueAxisOptionsParams;
  let axis: ValueAxis;

  beforeEach(() => {
    setParamByIndex = jest.fn();
    setMultipleValidity = jest.fn();
    onValueAxisPositionChanged = jest.fn();
    axis = { ...valueAxis };

    defaultProps = {
      axis,
      index: 0,
      valueAxis,
      vis,
      setParamByIndex,
      onValueAxisPositionChanged,
      setMultipleValidity,
    };
  });

  it('should init with the default set of props', () => {
    const comp = shallow(<ValueAxisOptions {...defaultProps} />);

    expect(comp).toMatchSnapshot();
  });

  it('should hide options when axis.show is false', () => {
    defaultProps.axis.show = false;
    const comp = shallow(<ValueAxisOptions {...defaultProps} />);

    expect(comp.find(TextInputOption).exists()).toBeFalsy();
    expect(comp.find(LabelOptions).exists()).toBeFalsy();
  });

  it('should call onValueAxisPositionChanged when position is changed', () => {
    const value = Position.Right;
    const comp = shallow(<ValueAxisOptions {...defaultProps} />);
    comp.find({ paramName: POSITION }).prop('setValue')(POSITION, value);

    expect(onValueAxisPositionChanged).toBeCalledWith(defaultProps.index, value);
  });

  it('should call setValueAxis when title is changed', () => {
    defaultProps.axis.show = true;
    const textValue = 'New title';
    const comp = shallow(<ValueAxisOptions {...defaultProps} />);
    comp.find(TextInputOption).prop('setValue')('text', textValue);

    expect(setParamByIndex).toBeCalledWith('valueAxes', defaultProps.index, 'title', {
      text: textValue,
    });
  });

  it('should call setValueAxis when scale value is changed', () => {
    const scaleValue = ScaleType.SquareRoot;
    const comp = shallow(<ValueAxisOptions {...defaultProps} />);
    comp.find({ paramName: 'type' }).prop('setValue')('type', scaleValue);

    expect(setParamByIndex).toBeCalledWith('valueAxes', defaultProps.index, 'scale', {
      ...defaultProps.axis.scale,
      type: scaleValue,
    });
  });
});
