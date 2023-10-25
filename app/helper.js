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
function mapDataToPopulation(data, dictionaryData){
    for(const element of data){
      if(dictionaryData[element] != null){
        dictionaryData[element] = dictionaryData[element] + 1;
      }
    }
    return dictionaryData
  }

  function mockPopulationData (geojson) {
    // Generate random data for our "population", every entry is a "patient"
  let randomZipcodeData = generate1DRandomDataSet(1000, 60601, 60827);
  var dictionaryPopData = {}
  // Define the valid zipcodes that will map to the choropleth map
  for(const elem of geojson.features){
    // Populate dictionary with keys that will be valid "keys" based on the geojson
    dictionaryPopData[elem.properties.zip] = 0;
  }
  // Map random data to dictionary (its possible that the data may not be in the dictionary, that case we ignore data)
  let populationData = mapDataToPopulation(randomZipcodeData, dictionaryPopData);
  return populationData
}