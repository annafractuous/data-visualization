export const datasets = {
  nycHighSchoolDemographics: {
    data: require('../resources/all_school_demographics_2011_15.json'),
    parsingFunction: parseHsDemographicsData,
    firebaseRef: 'hsDemographics201516',
    saved: true
  },
  nycHighSchoolOfferings: {
    endpoint: 'https://data.cityofnewyork.us/resource/4isn-xf7m.json',
    parsingFunction: parseHsOfferingsData,
    firebaseRef: 'hsOfferings',
    saved: true
  },
  schoolDistrictDemographics: {
    endpoint: 'https://data.cityofnewyork.us/resource/sh8v-yxdi.json',
    parsingFunction: parseDistrictDemographicsData,
    firebaseRef: 'districtDemographics',
    saved: true
  }
}
