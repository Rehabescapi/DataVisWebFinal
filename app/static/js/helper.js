/* Function generates 1D array of size dataSetSize with values between minValue and maxValue INCLUSIVELY*/
function generate1DRandomDataSet(dataSetSize, minValue, maxValue) {
  var dataset = []; //Initialize empty array
  for (var i = 0; i < dataSetSize; i++) {
    var newNumber = Math.random() * (maxValue - minValue + 1) + minValue;
    newNumber = Math.floor(newNumber) // Round to nearest integer value
    dataset.push(newNumber); //Add new number to array
  }
  return dataset
}


// Function mapping generated data to map format
function mapDataToPopulation(data, dictionaryData) {
  for (const element of data) {
    if (dictionaryData[element] != null) {
      dictionaryData[element] = dictionaryData[element] + 1;
    }
  }
  return dictionaryData
}

function bindPopulationData(geojson, year, type) {
  var dictionaryPopData = {}
  console.log(year)
  Promise.all([
    d3.json(`/Map/?Year=${year}`)]).then(function (loadData) {
      console.log('Loaded Data')
      console.log(loadData)

      if ('features' in geojson) {
        for (const elem of geojson.features) {
          // Populate dictionary with keys that will be valid "keys" based on the geojson
          dictionaryPopData[elem.properties.SCHOOL_ID] = 0;
        }
      }




      let populationData = mapDataToPopulation(loadData, dictionaryPopData);
      return populationData

    })
}


function mockPopulationData(geojson, type = 'nothing') {
  console.log(geojson)
  // Generate random data for our "population", every entry is a "patient"
  let min, max;
  if (type == 'nothing') {
    min = 11;
    max = 11;
  }

  else if (type = 'population') {
    min = Object.values(geojson.features).reduce((t, { properties }) => Math.min(t, properties.SCHOOL_ID), Infinity);
    max = Object.values(geojson.features).reduce((t, { properties }) => Math.max(t, properties.SCHOOL_ID), 0);
  }

  let randomZipcodeData = generate1DRandomDataSet(1000, min, max);
  var dictionaryPopData = {}

  // Define the valid zipcodes that will map to the choropleth map
  if ('features' in geojson) {
    for (const elem of geojson.features) {
      // Populate dictionary with keys that will be valid "keys" based on the geojson
      dictionaryPopData[elem.properties.SCHOOL_ID] = 10;
    }
  }
  else {
    console.log(geojson.objects)
    for (const elem of geojson.objects["Boundaries - ZIP Codes"].geometries) {
      dictionaryData[elem.properties] = 0
    }
  }

  // Map random data to dictionary (its possible that the data may not be in the dictionary, that case we ignore data)
  let populationData = mapDataToPopulation(randomZipcodeData, dictionaryPopData);
  return populationData
}


function CountNumberOfCandidate(Type, obj) {
  let count = 0;
  for (const key in obj) {
    if (key.startsWith(`${Type} Candidate`) && key.endsWith("Name")) {
      count++;
    }
  }
  return count;

}

// Deprecated
const jsonToCsv = json => {
  const topLevelKeys = Object.keys(json);
  let currentCSV = "date,value";
  for (let i = 0; i < Object.keys(json).length; i++) {
    const yearData = JSON.parse(json[topLevelKeys[i]]);
    if (yearData.length > 0) {
      Object.keys(yearData[0])
        .filter(k => k.toLowerCase().includes("votes"))
        .forEach(k => currentCSV += `\n${yearData[0].Year}-06-25,${yearData[0][k]}`);
    }
  }

  return currentCSV;
}

