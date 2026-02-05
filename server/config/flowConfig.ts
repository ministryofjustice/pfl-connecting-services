import FormSteps from '../constants/formSteps';
import paths from '../constants/paths';

interface FlowStep {
  path: string;
  dependsOn?: FormSteps[];
}

export const flowConfig: Record<FormSteps, FlowStep> = {
  [FormSteps.START]: {
    path: paths.START,
  },
  [FormSteps.DOMESTIC_ABUSE]: {
    path: paths.DOMESTIC_ABUSE,
    dependsOn: [FormSteps.START],
  },
  [FormSteps.CONTACT_CHILD_ARRANGEMENTS]: {
    path: paths.CONTACT_CHILD_ARRANGEMENTS,
    dependsOn: [FormSteps.DOMESTIC_ABUSE],
  },
  [FormSteps.AGREEMENT]: {
    path: paths.AGREEMENT,
    dependsOn: [FormSteps.CONTACT_CHILD_ARRANGEMENTS],
  },
  [FormSteps.HELP_OPTIONS]: {
    path: paths.HELP_OPTIONS,
    dependsOn: [FormSteps.AGREEMENT],
  },
  [FormSteps.MEDIATION_CHECK]: {
    path: paths.MEDIATION_CHECK,
    dependsOn: [FormSteps.HELP_OPTIONS],
  },
};

export default flowConfig;
