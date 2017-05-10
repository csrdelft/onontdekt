import { isNumeric, reviveDateTime } from './data';

describe('reviveDateTime', () => {

  it('should parse plain datetime strings', () => {
    const parsed = reviveDateTime(null, '2017-05-09 18:30:00');
    expect(parsed instanceof Date).toBe(true);
  });

  it('should not parse other string values', () => {
    const parsed = reviveDateTime(null, '1500');
    expect(parsed).toEqual('1500');
  });

  it('should not parse non-strings', () => {
    const parsed = reviveDateTime(null, 1500);
    expect(parsed).toEqual(1500);
  });

});

describe('isNumeric', () => {

  it('should allow strings containing numbers', () => {
    expect(isNumeric('546')).toBe(true);
  });

  it('should allow numbers', () => {
    expect(isNumeric(546)).toBe(true);
  });

  it('should not parse strings without numbers', () => {
    expect(isNumeric('546x')).toBe(false);
  });

});
