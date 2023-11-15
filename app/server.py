# Template Server copied from CS468 Lab 6
import csv
import json
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
from flask import Flask, send_from_directory, request, url_for


app = Flask(__name__)

# Lab Remnants
# reader = json.load(open("chicago_zipcodes.json"))

df_lsc_elections = gp.read_file("../data/Final_Project_Data_with_Geo.geojson")
df = df_lsc_elections.rename(columns={'Chicago Local School Council Voting District School ID': "ID",
                             "Chicago Local School Council Voting District School": "Name"})

# Functions
if __name__ == "__main__":
    app.run(debug=True)


def catch_all(path):
    return app.send_static_file('index.index.html')


def dataSample(numSamples):
    """Return a sample set of rows"""
    random.shuffle(stringData)
    return stringData[:numSamples]

##


def dataToCSVStr(header, dataList):
    csvStr = ",".join(header) + "\n"
    strData = [",".join([str(x) for x in data]) for data in dataList]
    csvStr += "\n".join(strData)

    return csvStr


# Routes
@app.route("/")
def index():
    return app.send_static_file("index.html")


@app.route('/<path:path>')
def startup(path):
    return send_from_directory('.', path)




@app.route('/SchoolID/')
def queryTest():
    sample = request.args.get('ID')
    goalYear = request.args.get('Year')
    print(sample)
    print(goalYear)
    
    testdf = df[(df['ID'] == int(sample)) & (df['Year'] == int(goalYear))]
    print(testdf[:1])

    testdf = testdf.drop(['geometry'],axis=1)
    testdf = pd.DataFrame(testdf)

    testdf = testdf.replace('',np.nan)    
    testdf = testdf.dropna(axis=1, how='all')
    testdf = testdf.fillna(0, axis=1)
    
    #TODO 
    #Get Rid of this hardcode Pandas
    #
    print(testdf)
    ##Numeric Only issue
    testdf['ParentSum']=testdf.apply(lambda x:sum([x[c] for c in testdf.columns if c.startswith('Parent') & c.endswith('Votes') ]),axis=1)
    
    testdf['CommunitySum']=testdf.apply(lambda x:sum([x[c] for c in testdf.columns if c.startswith('Community') & c.endswith('Votes')]),axis=1)
   
    
    return testdf.to_json(orient='records')



@app.route('/Map/')
def getSumbyYear():
    goalYear = request.args.get('Year')
    
    test = df[df['Year'] == int(goalYear)]
    test= test.fillna(0 )
    test['ParentSum']=test.apply(lambda x:sum([x[c] for c in test.columns if c.startswith('Parent') & c.endswith('Votes')]),axis=1)

    recordSumarry= test[['Name', 'ID', 'Year', 'ParentSum', 'geometry']].copy()
    return recordSumarry.to_json()
    #testdf = testdf.dropna(axis=1)
   
   

    #testdf['ParentSum']=testdf.apply(lambda x:sum([x[c] for c in testdf.columns if c.startswith('Parent') & c.endswith('Votes')]),axis=1)
    
    #print (testdf['ParentSum'].size)
    #return testdf.to_json(orient='records')

def catch_all(path):
    return app.send_static_file('index.html');
