##Template Server copied from CS468 Lab 6
import csv , json
import random 



reader = json.load(open("chicago_zipcodes.json"))
#reader = csv.reader(open("cereal.csv"))
#header = reader.__next__()
##stringData = [ row for row in reader]
##numericalData = [ [ float(x) for x in row[3:]] for  row in stringData]

##Return a sample set of rows
def dataSample(numSamples):
    random.shuffle(stringData)
    return stringData[:numSamples]

##
def dataToCSVStr(header, dataList):
    csvStr = ",".join(header) + "\n"
    strData = [ ",".join([str(x) for x in data])
                  for data in dataList ]
    csvStr += "\n".join(strData)

    return csvStr


from flask import Flask, send_from_directory
app =Flask(__name__)


@app.route('/<path:path>')
def startup(path):
    return send_from_directory('.', path)



@app.route('/sample/<numSamples>')
def data(numSamples):
    return dataToCSVStr(header, dataSample(int(numSamples)))


