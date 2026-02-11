import { FieldValidationError } from 'express-validator';

import errorSummaryList from './errorSummaryList';

describe('errorSummaryList', () => {
  it('should return empty array when no errors provided', () => {
    expect(errorSummaryList([])).toEqual([]);
  });

  it('should return empty array when undefined passed', () => {
    expect(errorSummaryList(undefined)).toEqual([]);
  });

  it('should convert error to format with href linking to field ID', () => {
    const errors: FieldValidationError[] = [
      {
        type: 'field',
        location: 'body',
        path: 'agreement',
        value: '',
        msg: 'Select whether you and your ex-partner agree on child arrangements',
      },
    ];

    const result = errorSummaryList(errors);

    expect(result).toEqual([
      {
        text: 'Select whether you and your ex-partner agree on child arrangements',
        href: '#agreement',
      },
    ]);
  });

  it('should link directly to field ID without -error suffix (per GOV.UK Design System)', () => {
    const errors: FieldValidationError[] = [
      {
        type: 'field',
        location: 'body',
        path: 'domesticAbuse',
        value: '',
        msg: 'Select an option',
      },
    ];

    const result = errorSummaryList(errors);

    // Should be #domesticAbuse, NOT #domesticAbuse-error
    // This ensures clicking the error link jumps to the first radio input
    expect(result[0].href).toBe('#domesticAbuse');
  });

  it('should handle multiple errors', () => {
    const errors: FieldValidationError[] = [
      {
        type: 'field',
        location: 'body',
        path: 'firstName',
        value: '',
        msg: 'Enter your first name',
      },
      {
        type: 'field',
        location: 'body',
        path: 'lastName',
        value: '',
        msg: 'Enter your last name',
      },
    ];

    const result = errorSummaryList(errors);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ text: 'Enter your first name', href: '#firstName' });
    expect(result[1]).toEqual({ text: 'Enter your last name', href: '#lastName' });
  });

  it('should set href to undefined when path is missing', () => {
    const errors: FieldValidationError[] = [
      {
        type: 'field',
        location: 'body',
        path: '',
        value: '',
        msg: 'Something went wrong',
      },
    ];

    const result = errorSummaryList(errors);

    expect(result[0].href).toBeUndefined();
  });
});
