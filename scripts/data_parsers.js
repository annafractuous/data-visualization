/* HS Demographics */

export function parseHsDemographicsData(dataHash) {
  var highSchoolDemographics = {};
  dataHash.forEach(function(school){
    if (school["Year"] === "2015-16" && school["Grade 12"] > 0) {
      var name = school["School Name"].replace(/\.|\/|#/g, "");
      highSchoolDemographics[name] = {
        year: school["Year"],
        totalEnrollment: parseInt(school["Total Enrollment"]),
        female: parseFloat(school["% Female"]),
        male: parseFloat(school["% Male"]),
        asian: parseFloat(school["% Asian"]),
        black: parseFloat(school["% Black"]),
        hispanic: parseFloat(school["% Hispanic"]),
        other: parseFloat(school["% Other"]),
        white: parseFloat(school["% White"]),
        disabled: parseFloat(school["% Students with Disabilities"]),
        esl: parseFloat(school["% English Language Learners"]),
        poverty: parseFloat(school["% Poverty"])
      }
    }
  })
  return highSchoolDemographics;
}

/* HS Offerings */

export function parseHsOfferingsData(dataHash) {
  var highSchoolOfferings = {};
  dataHash.forEach(function(school){
    var name = school.school_name.replace(/\.|\/|#/g, "");
    var address = [school.primary_address_line_1, school.city, school.state_code, school.zip].join(", ");
    var gradeSpan = school.grade_span_min + "-" + school.grade_span_max;
    var apClasses = school.advancedplacement_courses ? school.advancedplacement_courses.split(/,\s|;\s/) : "None listed";
    // var apClassCount = apClasses.constructor === Array ? apClasses.length : 0;
    var extracurriculars = school.extracurricular_activities ? school.extracurricular_activities.split(/,\s|;\s/) : "None listed";
    var sports = scrubSportsData([school.school_sports, school.psal_sports_boys, school.psal_sports_girls, school.psal_sports_coed]);

    highSchoolOfferings[name] = {
      address: address,
      gradeSpan: gradeSpan,
      apClasses: apClasses,
      // apClassCount: apClassCount,
      extracurriculars: extracurriculars,
      sports: sports
    }
  })
  return highSchoolOfferings;
}

var scrubSportsData = function(array){
  return array.filter(Boolean).join(", ").split(/,\s|;\s/);
}

/* School District Demographics */

export function parseDistrictDemographicsData(dataHash) {
  var schoolDistrictDemographics = {};
  dataHash.forEach(function(district){
    var districtName = district.jurisdiction_name.split(" ")[1].replace(/^0/, "");  // "CSD 01 Manhattan" => "1"
    var hispanic = Math.round(parseFloat(district.percent_hispanic_latino) * 100);
    var black = Math.round(parseFloat(district.percent_black_non_hispanic) * 100);
    var asian = Math.round(parseFloat(district.percent_asian_non_hispanic) * 100);
    var white = Math.round(parseFloat(district.percent_white_non_hispanic) * 100);
    var otherEthnicity = Math.round(parseFloat(district.percent_other_ethnicity) * 100);
    var publicAssistance = Math.round(parseFloat(district.percent_receives_public_assistance) * 100);
    var usCitizen = Math.round(parseFloat(district.percent_us_citizen) * 100);

    schoolDistrictDemographics[districtName] = {
      usCitizen: usCitizen,
      publicAssistance: publicAssistance,
      white: white,
      black: black,
      hispanic: hispanic,
      asian: asian,
      other: otherEthnicity
    }
  })
  return schoolDistrictDemographics;
}
