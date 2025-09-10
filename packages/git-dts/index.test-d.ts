/* eslint-disable @typescript-eslint/ban-ts-comment */

import { expectAssignable, expectError } from 'tsd';
import { HexChar } from '.';

expectAssignable<HexChar>('0');
expectAssignable<HexChar>('1');
expectAssignable<HexChar>('2');
expectAssignable<HexChar>('3');
expectAssignable<HexChar>('4');
expectAssignable<HexChar>('5');
expectAssignable<HexChar>('6');
expectAssignable<HexChar>('7');
expectAssignable<HexChar>('8');
expectAssignable<HexChar>('9');
expectAssignable<HexChar>('a');
expectAssignable<HexChar>('b');
expectAssignable<HexChar>('c');
expectAssignable<HexChar>('d');
expectAssignable<HexChar>('e');
expectAssignable<HexChar>('f');

// @ts-expect-error
expectError<HexChar>('hi');
