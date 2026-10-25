import filesendnx from './filesendnx.json';
import smartTraffic from './smart-traffic.json';
import resphinx from './resphinx.json';

export const caseStudies = {
  resphinx,
  filesendnx,
  'smart-traffic': smartTraffic,
} as const;

export type CaseStudy = (typeof caseStudies)[keyof typeof caseStudies];
