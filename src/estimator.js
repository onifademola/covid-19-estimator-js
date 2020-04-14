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

const getCurrentlyInfected = (value, factor) => { return value * factor; };
const normalCases = (reportedcases, calcfactor) => { return Math.trunc((reportedcases * 10) * (Math.pow(2, calcfactor))); };
const severeCases = (reportedcases, calcfactor) => { return Math.trunc((reportedcases * 50) * (Math.pow(2, calcfactor))); };
const hospitalBeds = (totalHospitalbeds) => { return (0.35 * totalHospitalbeds)};

const covid19ImpactEstimator = (data) => {
    let impact = {};
    let severeImpact = {};
    const factor = getFactor(data.periodType, data.timeToElapse);

    impact.currentlyInfected = getCurrentlyInfected(data.reportedCases, 10);
    impact.infectionsByRequestedTime = normalCases(data.reportedCases, factor);
    impact.severeCasesByRequestedTime = Math.trunc(0.15 * normalCases(data.reportedCases, factor));
    impact.hospitalBedsByRequestedTime = Math.trunc((hospitalBeds(data.totalHospitalBeds)) - (0.15 * normalCases(data.reportedCases, factor)));
    impact.casesForICUByRequestedTime = Math.trunc(0.05 * normalCases(data.reportedCases, factor));
    impact.casesForVentilatorsByRequestedTime = Math.trunc(0.02 * normalCases(data.reportedCases, factor));
    impact.dollarsInFlight = Math.trunc(((normalCases(data.reportedCases, factor)) * (data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD)) * data.timeToElapse);

    severeImpact.currentlyInfected = getCurrentlyInfected(data.reportedCases, 50)
    severeImpact.infectionsByRequestedTime = severeCases(data.reportedCases, factor);
    severeImpact.severeCasesByRequestedTime = Math.trunc(0.15 * severeCases(data.reportedCases, factor));
    severeImpact.hospitalBedsByRequestedTime = Math.trunc((hospitalBeds(data.totalHospitalBeds)) - (0.15 * severeCases(data.reportedCases, factor)));
    severeImpact.casesForICUByRequestedTime = Math.trunc(0.05 * severeCases(data.reportedCases, factor));
    severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(0.02 * severeCases(data.reportedCases, factor));
    severeImpact.dollarsInFlight = Math.trunc(((severeCases(data.reportedCases, factor)) * (data.region.avgDailyIncomePopulation * data.region.avgDailyIncomeInUSD)) * data.timeToElapse);

    
    return {
        data,
        impact,
        severeImpact
    };
};

export default covid19ImpactEstimator;