import NP from 'number-precision';

import statistics from './utils/statistics';

export type AuditId =
  | 'first-contentful-paint'
  | 'first-meaningful-paint'
  | 'speed-index'
  | 'fully-loaded';

export interface AuditScoring {
  p10: number;
  median: number;
}

export interface Audit {
  id: AuditId;
  weight: number;
  scoring: AuditScoring;
}

export type AuditMetrics = {
  [key in AuditId]: number;
};

export interface ScoreOptions {
  /**
   * 总分，默认 10
   */
  score?: number;
  audits?: Audit[];
}

export interface ScoreResults {
  score: number;
  audits: {
    id: AuditId;
    weight: number;
    score: number;
  }[];
}

export const defaultAudits: Audit[] = [
  {
    id: 'first-contentful-paint',
    weight: 2,
    // 25th and 5th percentiles HTTPArchive -> median and PODR, then p10 is derived from them.
    // https://bigquery.cloud.google.com/table/httparchive:lighthouse.2018_04_01_mobile?pli=1
    // see https://www.desmos.com/calculator/oqlvmezbze
    // scoring: {
    //   p10: 2336,
    //   median: 4000,
    // },
    // @see https://www.desmos.com/calculator/mgvri1deue
    scoring: {
      p10: 1000,
      median: 2000,
    },
  },
  {
    id: 'first-meaningful-paint',
    weight: 2,
    // 25th and 5th percentiles HTTPArchive -> median and PODR, then p10 derived from them.
    // https://bigquery.cloud.google.com/table/httparchive:lighthouse.2018_04_01_mobile?pli=1
    // see https://www.desmos.com/calculator/i4znkdccut
    // scoring: {
    //   p10: 2336,
    //   median: 4000,
    // },
    // @see https://www.desmos.com/calculator/lcdgpkbaqs
    scoring: {
      p10: 1000,
      median: 2000,
    },
  },
  {
    id: 'speed-index',
    weight: 2.67,
    // 25th and 5th percentiles HTTPArchive -> median and PODR, then p10 derived from them.
    // https://bigquery.cloud.google.com/table/httparchive:lighthouse.2018_04_01_mobile?pli=1
    // see https://www.desmos.com/calculator/dvuzvpl7mi
    // scoring: {
    //   p10: 3387,
    //   median: 5800,
    // },
    // @see https://www.desmos.com/calculator/fmegpfhf2i
    scoring: {
      p10: 1500,
      median: 3000,
    },
  },
  {
    id: 'fully-loaded',
    weight: 3.33,
    // 25th and 5th percentiles HTTPArchive -> median and PODR, then p10 derived from them.
    // https://bigquery.cloud.google.com/table/httparchive:lighthouse.2018_04_01_mobile?pli=1
    // see https://www.desmos.com/calculator/o98tbeyt1t
    // scoring: {
    //   p10: 3785,
    //   median: 7300,
    // },
    // @see https://www.desmos.com/calculator/ix2a8su01j
    scoring: {
      p10: 2000,
      median: 4000,
    },
  },
];

export const defaultScoreOptions = {
  score: 10,
  audits: defaultAudits,
};

export const webperfscore = (
  metrics: AuditMetrics,
  options?: ScoreOptions,
): ScoreResults => {
  const {
    score = defaultScoreOptions.score,
    audits = defaultScoreOptions.audits,
  } = options || defaultScoreOptions;
  const results: ScoreResults['audits'] = [];
  for (let index = 0; index < audits.length; index += 1) {
    const audit = audits[index];
    const metric = metrics[audit.id] || 0;
    const percentile = NP.round(
      statistics.getLogNormalScore(audit.scoring, metric),
      2,
    );
    results.push({
      id: audit.id,
      weight: audit.weight,
      score: NP.times(score, percentile),
    });
  }
  const totalWeight = results.reduce((rcc, result) => rcc + result.weight, 0);
  return {
    score: NP.round(
      results.reduce((rcc, result) => {
        return NP.plus(
          rcc,
          NP.times(result.score, NP.divide(result.weight, totalWeight)),
        );
      }, 0),
      1,
    ),
    audits: results,
  };
};
