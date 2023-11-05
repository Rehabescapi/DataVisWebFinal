##Template Server copied from CS468 Lab 6
import csv , json
import random 

import numpy as np
from numpy import float64, int64
from numpy.core.numeric import outer
import pandas as pd
from pandas.core.common import flatten
import geopandas as gp
from geopandas.geodataframe import GeoDataFrame
from geographiclib.geodesic import Geodesic
import datetime
import math
import decimal
from decimal import Decimal








df_lsc_elections = pd.read_csv("../data/Final_Project_Data.csv")
df = df_lsc_elections.rename(columns={'Chicago Local School Council Voting District School ID':"ID","Chicago Local School Council Voting District School": "Name"})


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


from flask import Flask, send_from_directory, request
app =Flask(__name__)


@app.route('/<path:path>')
def startup(path):
    return send_from_directory('.', path)



@app.route('/SchoolID/')
def queryTest():
   
    sample = request.args.get('ID')
    print(df.head())
    print(" and " + str(sample))
    testdf = df[df['ID'] == 609772]
    print(testdf)
    return testdf.to_csv()




def catch_all(path):
    return app.send_static_file('index.html');