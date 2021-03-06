/** @license
 *  Copyright 2016 - present The Material Motion Authors. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy
 *  of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations
 *  under the License.
 */

import {
  Constructor,
  MaybeReactive,
  MotionReactiveMappable,
  Observable,
  ObservableWithMotionOperators,
} from '../types';

import {
  ThresholdRegion,
} from '../enums';

import {
  _ReactiveMapOptions,
} from './foundation/_reactiveMap';

export type ThresholdRangeArgs = _ReactiveMapOptions & MaybeReactive<{
  start$: number,
  end$: number,
}>;

export interface MotionThresholdRangeable {
  thresholdRange(kwargs: ThresholdRangeArgs): ObservableWithMotionOperators<ThresholdRegion>;
}

export function withThresholdRange<T, S extends Constructor<MotionReactiveMappable<T>>>(superclass: S): S & Constructor<MotionThresholdRangeable> {
  return class extends superclass implements MotionThresholdRangeable {
    thresholdRange({ start$, end$, ..._reactiveMapOptions }: ThresholdRangeArgs): ObservableWithMotionOperators<ThresholdRegion> {
      return (this as any as ObservableWithMotionOperators<number>)._reactiveMap({
        transform: ({ upstream, start, end }) => {
          const lowerLimit = Math.min(start, end);
          const upperLimit = Math.max(start, end);

          if (upstream < lowerLimit) {
            return ThresholdRegion.BELOW;

          } else if (upstream > upperLimit) {
            return ThresholdRegion.ABOVE;

          } else {
            return ThresholdRegion.WITHIN;
          }
        },
        inputs: {
          start: start$,
          end: end$
        },
        ..._reactiveMapOptions,
      });
    }
  };
}
