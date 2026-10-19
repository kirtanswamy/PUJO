import { test, expect } from '@playwright/test';
import * as chromeCopy from '../src/copy';
import { scenes } from '../src/editions/2026';

const DEVANAGARI = /[\u0900-\u097F]/u;

function userFacingStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(userFacingStrings);
  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(userFacingStrings);
  }
  return [];
}

test('chrome and edition user-facing strings do not contain Devanagari characters', () => {
  const strings = [...userFacingStrings(chromeCopy), ...userFacingStrings(scenes)];

  expect(strings.filter((text) => DEVANAGARI.test(text))).toEqual([]);
});
