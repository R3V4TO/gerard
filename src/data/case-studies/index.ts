import filesendnx from './filesendnx.json';
import versarent from './versarent.json';
import smartTraffic from './smart-traffic.json';

export const caseStudies = {
  filesendnx,
  versarent,
  'smart-traffic': smartTraffic,
} as const;

export type CaseStudy = (typeof caseStudies)[keyof typeof caseStudies];
