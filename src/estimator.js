const getFactor = (periodType, timeToElapse) => {
  const factorRecieved = periodType.trim().toLowerCase();
  switch (factorRecieved) {
    case 'days':
      return (Math.trunc((timeToElapse * 1) / 3));
    case 'weeks':
      return Math.trunc((timeToElapse * 7) / 3);
    case 'months':
      return Math.trunc((timeToElapse * 30) / 3);
    default:
      return Math.trunc(timeToElapse);
  }
};

const getPeriod = (periodType, timeToElapse) => {
  const factorRecieved = periodType.trim().toLowerCase();
  switch (factorRecieved) {
    case 'days':
      return (timeToElapse * 1);
    case 'weeks':
      return (timeToElapse * 7);
    case 'months':
      return (timeToElapse * 30);
    default:
      return timeToElapse;
  }
};

const getCurrentlyInfected = (value, factor) => value * factor;
const normalCases = (repcases, calcfactor) => Math.trunc((repcases * 10) * (2 ** calcfactor));
const severeCases = (repcases, calcfactor) => Math.trunc((repcases * 50) * (2 ** calcfactor));
const hospitalBeds = (totalHospitalbeds) => (0.35 * totalHospitalbeds);

const covid19ImpactEstimator = (data) => {
  const avgDIncPop = data.region.avgDailyIncomePopulation;
  const avgDIncUSD = data.region.avgDailyIncomeInUSD;
  const factor = getFactor(data.periodType, data.timeToElapse);
  const normCases = normalCases(data.reportedCases, factor);
  const sevCases = severeCases(data.reportedCases, factor);
  const totalHospBeds = data.totalHospitalBeds;
  const period = getPeriod(data.periodType, data.timeToElapse);

  const impact = {
    currentlyInfected: getCurrentlyInfected(data.reportedCases, 10),
    infectionsByRequestedTime: normCases,
    severeCasesByRequestedTime: Math.trunc(0.15 * normCases),
    hospitalBedsByRequestedTime: Math.trunc(hospitalBeds(totalHospBeds) - (0.15 * normCases)),
    casesForICUByRequestedTime: Math.trunc(0.05 * normCases),
    casesForVentilatorsByRequestedTime: Math.trunc(0.02 * normCases),
    dollarsInFlight: Math.trunc((normCases * (avgDIncPop * avgDIncUSD)) / period)
  };
  const severeImpact = {
    currentlyInfected: getCurrentlyInfected(data.reportedCases, 50),
    infectionsByRequestedTime: sevCases,
    severeCasesByRequestedTime: Math.trunc(0.15 * sevCases),
    hospitalBedsByRequestedTime: Math.trunc(hospitalBeds(totalHospBeds) - (0.15 * sevCases)),
    casesForICUByRequestedTime: Math.trunc(0.05 * sevCases),
    casesForVentilatorsByRequestedTime: Math.trunc(0.02 * sevCases),
    dollarsInFlight: Math.trunc((sevCases * (avgDIncPop * avgDIncUSD)) / period)
  };

  return {
    data,
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
