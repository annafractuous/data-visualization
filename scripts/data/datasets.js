// Parsing Functions
import { parseHsDemographicsData, parseHsOfferingsData, parseDistrictDemographicsData } from './data_parsers';

export const datasets = {
  // 2011-2016: http://schools.nyc.gov/NR/rdonlyres/20056B95-8351-4E45-B8A1-9901B4B6A93B/0/DemographicSnapshot201112to201516Public_FINAL.xlsx
  nycHighSchoolDemographics: {
    data: require('../../resources/all_school_demographics_2011_15.json'),
    parsingFunction: parseHsDemographicsData,
    firebaseRef: 'hsDemographics201516',
    saved: true
  },
  nycHighSchoolOfferings: {
    // 2016 data: https://data.cityofnewyork.us/Education/DOE-High-School-Directory-2016/7crd-d9xh
    endpoint: 'https://data.cityofnewyork.us/resource/4isn-xf7m.json',
    parsingFunction: parseHsOfferingsData,
    firebaseRef: 'hsOfferings',
    saved: true
  },
  schoolDistrictDemographics: {
    // last updated 2014: https://data.cityofnewyork.us/Education/School-District-Breakdowns/g3vh-kbnw
    endpoint: 'https://data.cityofnewyork.us/resource/sh8v-yxdi.json',
    parsingFunction: parseDistrictDemographicsData,
    firebaseRef: 'districtDemographics',
    saved: true
  }
}
