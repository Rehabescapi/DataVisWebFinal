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

# /SchoolID/?ID=609739&Year=2020


@app.route('/SchoolID/')
def queryTest():
    sample = request.args.get('ID')
    goalYear = request.args.get('Year')
    print(sample)
    print(goalYear)
    testdf = df[(df['ID'] == int(sample)) & (df['Year'] == int(goalYear))]
    print(testdf[:1])

    testdf = testdf.drop(['geometry'], axis=1)
    testdf = pd.DataFrame(testdf)

    testdf = testdf.replace('', np.nan)
    testdf = testdf.dropna(axis=1, how='all')
    testdf = testdf.fillna(0, axis=1)

    # TODO
    # Get Rid of this hardcode Pandas
    #
    print(testdf)
    # Numeric Only issue
    testdf['ParentSum'] = testdf.apply(lambda x: sum(
        [x[c] for c in testdf.columns if c.startswith('Parent') & c.endswith('Votes')]), axis=1)

    testdf['CommunitySum'] = testdf.apply(lambda x: sum(
        [x[c] for c in testdf.columns if c.startswith('Community') & c.endswith('Votes')]), axis=1)

    return testdf.to_json(orient='records')


@app.route('/Legend/')
def getLegendYear():
    goalYear = request.args.get('Year')
    goalRanges = request.args.get('Bin')

    if (goalRanges):
        print("Goal Ranges Exist")
    testdf = df[(df['Year'] == int(goalYear))]

    testdf = testdf.drop(['geometry'], axis=1)
    testdf = pd.DataFrame(testdf)

    testdf = testdf.replace('', np.nan)
    testdf = testdf.dropna(axis=1, how='all')
    testdf = testdf.fillna(0, axis=1)

    testdf['ParentSum'] = testdf.apply(lambda x: sum(
        [x[c] for c in testdf.columns if c.startswith('Parent') & c.endswith('Votes')]), axis=1)

    test_Array = testdf[['ParentSum']].to_numpy()

    sorted_Array = np.sort(test_Array, axis=None)

    goal = pd.qcut(sorted_Array, q=int(goalRanges), retbins=False)
    print(goal)

    return json.dumps(goal)


@app.route('/Map/')
def getSumbyYear():
    goalYear = request.args.get('Year')



    test = df[df['Year'] == int(goalYear)]
    test = test.fillna(0)
    test['ParentSum'] = test.apply(lambda x: sum(
        [x[c] for c in test.columns if c.startswith('Parent') & c.endswith('Votes')]), axis=1)

    test['Category'] = pd.qcut(test.ParentSum, q=5, labels=False)
    test['CategoryMax'] = test.groupby(
        ['Category'])["ParentSum"].transform("max")
    recordSumarry = test[['Name', 'ID', 'Year', 'ParentSum',
                          'geometry', 'Category', 'CategoryMax']].copy()
    return recordSumarry.to_json()
    # testdf = testdf.dropna(axis=1)

    # testdf['ParentSum']=testdf.apply(lambda x:sum([x[c] for c in testdf.columns if c.startswith('Parent') & c.endswith('Votes')]),axis=1)

    # print (testdf['ParentSum'].size)
    # return testdf.to_json(orient='records')


def catch_all(path):
    return app.send_static_file('index.html')


@app.route("/blc")
def basic_line_chart():
    """Basic Line Chart"""
    return app.send_static_file("basic-line-chart.html")


@app.route("/glc")
def gradient_line_chart():
    """Gradient Line Chart"""
    return app.send_static_file("gradient-line-chart.html")


# /school-districts/609739/2020
@app.route('/school-districts/<district_id>/<election_year>')
def school_district_details(district_id, election_year):
    return school_district_details_by_year(district_id, election_year)

# /school-districts/609739


@app.route('/school-districts/<district_id>')
def district_multi_year_elections(district_id):
    """School district multi-year election results (votes per candidate)"""

    d_collection = {}
    goal_years = range(2016, 2021)  # (2016-2020)
    for goal_year in goal_years:
        d_collection[goal_year] = school_district_details_by_year(
            district_id, goal_year)

    return d_collection


def school_district_details_by_year(district_id, election_year):
    print(district_id)
    print(election_year)
    d_frame = df[(df['ID'] == int(district_id)) &
                 (df['Year'] == int(election_year))]
    print(d_frame[:1])

    d_frame = d_frame.drop(['geometry'], axis=1)
    d_frame = pd.DataFrame(d_frame)

    d_frame = d_frame.replace('', np.nan)
    d_frame = d_frame.dropna(axis=1, how='all')
    d_frame = d_frame.fillna(0, axis=1)

    print(d_frame)
    d_frame['ParentSum'] = d_frame.apply(lambda x: sum(
        [x[c] for c in d_frame.columns if c.startswith('Parent') & c.endswith('Votes')]), axis=1)

    d_frame['CommunitySum'] = d_frame.apply(lambda x: sum(
        [x[c] for c in d_frame.columns if c.startswith('Community') & c.endswith('Votes')]), axis=1)

    return d_frame.to_json(orient='records')
