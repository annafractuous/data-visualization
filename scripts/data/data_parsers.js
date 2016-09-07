/* HS Demographics */

export function parseHsDemographicsData(dataHash) {
  var highSchoolDemographics = {};
  dataHash.forEach(function(school){
    if (school["Year"] === "2015-16" && school["Grade 10"] > 0) {  // isolate 2015-16 high school data
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

var scrubSportsData = function(array){
  return array.filter(Boolean).join(", ").split(/,\s|;\s/);
}

export function parseHsOfferingsData(dataHash) {
  var highSchoolOfferings = {};
  dataHash.forEach(function(school){
    var name = school.school_name.replace(/\.|\/|#/g, ""),
        address = [school.primary_address_line_1, school.city, school.state_code, school.zip].join(", ")
        gradeSpan = school.grade_span_min + "-" + school.grade_span_max
        apClasses = school.advancedplacement_courses ? school.advancedplacement_courses.split(/,\s|;\s/) : "None listed"
        extracurriculars = school.extracurricular_activities ? school.extracurricular_activities.split(/,\s|;\s/) : "None listed"
        sports = scrubSportsData([school.school_sports, school.psal_sports_boys, school.psal_sports_girls, school.psal_sports_coed]);

    highSchoolOfferings[name] = {
      address: address,
      gradeSpan: gradeSpan,
      apClasses: apClasses,
      extracurriculars: extracurriculars,
      sports: sports
    }
  })
  return highSchoolOfferings;
}


/* School District Demographics */

export function parseDistrictDemographicsData(dataHash) {
  var schoolDistrictDemographics = {};
  dataHash.forEach(function(district){
    var districtName = district.jurisdiction_name.split(" ")[1].replace(/^0/, ""),  // "CSD 01 Manhattan" => "1"
        hispanic = Math.round(parseFloat(district.percent_hispanic_latino) * 100),
        black = Math.round(parseFloat(district.percent_black_non_hispanic) * 100),
        asian = Math.round(parseFloat(district.percent_asian_non_hispanic) * 100),
        white = Math.round(parseFloat(district.percent_white_non_hispanic) * 100),
        otherEthnicity = Math.round(parseFloat(district.percent_other_ethnicity) * 100),
        publicAssistance = Math.round(parseFloat(district.percent_receives_public_assistance) * 100),
        usCitizen = Math.round(parseFloat(district.percent_us_citizen) * 100);

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


/* Merging Poverty Percentage Into Offerings Data */

function mergeWithPovertyStat() {
  var refDemographics = new Firebase('https://data-viz.firebaseio.com/hsDemographics201516'),
      refOfferings = new Firebase('https://data-viz.firebaseio.com/hsOfferings');

  // fetch demographics data from Firebase
  refDemographics.on("value", function(snapshot) {
    var demographicsData = snapshot.val(),
        demoSchools = Object.keys(demographicsData);

    refOfferings.on("value", function(snapshot) {
      var offeringsData = snapshot.val(); // once demographics data is loaded, fetch HS offerings data

      for (var schoolName in offeringsData) {
        // account for differences in capitalization or school names that are cut off in demographics dataset
        var school = demoSchools.find(function(schoolName2) {
          return schoolName.toLowerCase() === schoolName2.toLowerCase() || schoolName.slice(0,40) === schoolName2.slice(0,40);
        });

        if (demographicsData[school]) {
          offeringsData[schoolName]["poverty"] = demographicsData[school][poverty];
        }
        else {
          offeringsData[schoolName]["poverty"] = "Data Not Found";
        }
      };

      saveToFirebase('hsOfferings', offeringsData);

    },
    function (errorObject) { // error fetching school offerings
      console.log("The read failed: " + errorObject.code);
    });
  },
  function (errorObject) { // error fetching school demographics
    console.log("The read failed: " + errorObject.code);
  });
}
