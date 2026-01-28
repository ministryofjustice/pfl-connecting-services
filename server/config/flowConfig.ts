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
  [FormSteps.QUESTION_2_CONTACT]: {
    path: paths.QUESTION_2_CONTACT,
    dependsOn: [FormSteps.DOMESTIC_ABUSE],
  },
  [FormSteps.AGREEMENT]: {
    path: paths.AGREEMENT,
    dependsOn: [FormSteps.QUESTION_2_CONTACT],
  },
  [FormSteps.QUESTION_4_HELP]: {
    path: paths.QUESTION_4_HELP,
    dependsOn: [FormSteps.AGREEMENT],
  },
  [FormSteps.QUESTION_5_MEDIATION]: {
    path: paths.QUESTION_5_MEDIATION,
    dependsOn: [FormSteps.QUESTION_4_HELP],
  },
};

export default flowConfig;
