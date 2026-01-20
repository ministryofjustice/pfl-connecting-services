// User events for analytics
const UserEvents = {
  // Generic events (kept from CAP)
  PAGE_VISIT: 'page_visit',
  DOWNLOAD: 'download',
  LINK_CLICK: 'link_click',
  PAGE_EXIT: 'page_exit',
  QUICK_EXIT: 'quick_exit',

  // CS-specific events
  START_SERVICE: 'start_service',
  COMPLETE_QUESTION_1: 'complete_question_1',
  COMPLETE_QUESTION_2: 'complete_question_2',
  COMPLETE_QUESTION_3: 'complete_question_3',
  COMPLETE_QUESTION_4: 'complete_question_4',
  COMPLETE_QUESTION_5: 'complete_question_5',
  VIEW_COURT: 'view_court',
  VIEW_MEDIATION: 'view_mediation',
  VIEW_PARENTING_PLAN: 'view_parenting_plan',
  VIEW_SAFEGUARDING: 'view_safeguarding',
  VIEW_NO_CONTACT: 'view_no_contact',
};

export default UserEvents;
