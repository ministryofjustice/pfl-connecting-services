// convert errors to format for GOV.UK error summary component
import { FieldValidationError } from 'express-validator';

const errorSummaryList = (errors: FieldValidationError[] = []) => {
  return errors.map((error) => {
    return {
      text: error.msg,
      // Link directly to the form field ID (not the error message element)
      // For radios/checkboxes, this links to the first input in the group
      // per GOV.UK Design System guidelines
      href: error.path ? `#${error.path}` : undefined,
    };
  });
};

export default errorSummaryList;
