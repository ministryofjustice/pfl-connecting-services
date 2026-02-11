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
  [FormSteps.HELP_TO_AGREE]: {
    path: paths.HELP_TO_AGREE,
    dependsOn: [FormSteps.AGREEMENT],
  },
  [FormSteps.OTHER_OPTIONS]: {
    path: paths.OTHER_OPTIONS,
    dependsOn: [FormSteps.HELP_TO_AGREE],
  },
  [FormSteps.MEDIATION]: {
    path: paths.MEDIATION,
    dependsOn: [FormSteps.OTHER_OPTIONS],
  },
};

export default flowConfig;
