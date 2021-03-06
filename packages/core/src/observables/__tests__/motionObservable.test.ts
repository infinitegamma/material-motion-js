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

import { expect, use as useInChai } from 'chai';
import * as sinonChai from 'sinon-chai';
useInChai(sinonChai);

import {
  beforeEach,
  describe,
  it,
} from 'mocha-sugar-free';

import {
  stub,
} from 'sinon';

import {
  createMockObserver,
} from 'material-motion-testing-utils';

import {
  IndefiniteObservable,
} from 'indefinite-observable';

import {
  MotionObservable,
} from '../';

describe('motionObservable',
  () => {
    let stream;
    let mockObserver;
    let listener;

    beforeEach(
      () => {
        mockObserver = createMockObserver();
        stream = new MotionObservable(mockObserver.connect);

        listener = stub();
      }
    );

    it('should pass values to observer.next',
      () => {
        stream.subscribe(listener);

        mockObserver.next(1);

        expect(listener).to.have.been.calledWith(1);
      }
    );

    it('should cast other observables to itself with MotionObservable.from',
      () => {
        MotionObservable.from(
          new IndefiniteObservable(mockObserver.connect)
        )._filter({
          predicate: value => value < 2
        }).subscribe(listener);

        mockObserver.next(1);
        mockObserver.next(3);

        expect(listener).to.have.been.calledOnce.and.to.have.been.calledWith(1);
      }
    );
  }
);
