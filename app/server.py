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
from flask import Flask, send_from_directory, request

# Root
app = Flask(__name__)

if __name__ == "__main__":
    app.run(debug=True)

# Fetching elections data
df_lsc_elections = gp.read_file("../data/Final_Project_Data_with_Geo.geojson")
df = df_lsc_elections.rename(columns={'Chicago Local School Council Voting District School ID': "ID",
                             "Chicago Local School Council Voting District School": "Name"})


@app.route("/")
def index():
    return app.send_static_file("index.html")


@app.route('/<path:path>')
def startup(path):
    return send_from_directory('.', path)


@app.route('/SchoolID/')
def elections_by_id_and_year():
    """Sample call: /SchoolID/?ID=609739&Year=2020"""
    [id, year] = [get_arg('ID'), get_arg('Year')]
    return school_district_details_by_year(id, year)


@app.route('/Legend/')
def get_legend_year():
    goal_year = get_arg('Year')
    goal_ranges = get_arg('Bin')

    if goal_ranges:
        print("Goal Ranges Exist")
    testdf = df[(df['Year'] == int(goal_year))]

    testdf = testdf.drop(['geometry'], axis=1)
    testdf = pd.DataFrame(testdf)

    testdf = testdf.replace('', np.nan)
    testdf = testdf.dropna(axis=1, how='all')
    testdf = testdf.fillna(0, axis=1)

    testdf['ParentSum'] = testdf.apply(lambda x: sum(
        [x[c] for c in testdf.columns if c.startswith('Parent') & c.endswith('Votes')]), axis=1)

    test_array = testdf[['ParentSum']].to_numpy()

    sorted_array = np.sort(test_array, axis=None)

    goal = pd.qcut(sorted_array, q=int(goal_ranges), retbins=False)
    print(goal)

    return json.dumps(goal)


@app.route('/Map/')
def get_sum_by_year():
    test = df[df['Year'] == int(get_arg("Year"))]
    test = test.fillna(0)
    test['ParentSum'] = test.apply(lambda x: sum(
        [x[c] for c in test.columns if c.startswith('Parent') & c.endswith('Votes')]), axis=1)

    test['Category'] = pd.qcut(test.ParentSum, q=5, labels=False)
    test['CategoryMax'] = test.groupby(
        ['Category'])["ParentSum"].transform("max")
    test=test[test['ParentSum'] > 0]
    record_sumarry = test[['Name', 'ID', 'Year', 'ParentSum',
                          'geometry', 'Category', 'CategoryMax']].copy()

    return record_sumarry.to_json()


@app.route('/school-districts/<district_id>/<election_year>')
def school_district_details(district_id, election_year):
    """Sample call: /school-districts/609739/2020"""
    return school_district_details_by_year(district_id, election_year)


@app.route('/school-districts/<district_id>')
def district_multi_year_elections(district_id):
    """ Example call: 127.0.0.1:9909/school-districts/609739"""
    return get_multi_year_elections(district_id)


@app.route('/school-districts/<district_id>/csv')
def data_as_csv(district_id):
    """Example call: 127.0.0.1:9909/school-districts/609739/csv"""
    return json_to_csv(get_multi_year_elections(district_id))


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


def get_multi_year_elections(district_id):
    """School district multi-year election results (votes per candidate)"""
    d_collection = {}
    goal_years = [2016, 2018, 2020]
    for goal_year in goal_years:
        d_collection[goal_year] = school_district_details_by_year(
            district_id, goal_year)

    return d_collection


def get_arg(arg_name):
    return request.args.get(arg_name)


def data_to_csv_str(header, data_list):
    csv_str = ",".join(header) + "\n"
    str_data = [",".join([str(x) for x in data]) for data in data_list]
    csv_str += "\n".join(str_data)

    return csv_str


def json_to_csv(json_data):
    top_level_keys = list(json_data.keys())
    current_csv = "date,value\n"

    for i in range(len(top_level_keys)):
        year_data = json.loads(json_data[top_level_keys[i]])
        if len(year_data) > 0:
            for k in year_data[0].keys():
                if "votes" in k.lower():
                    current_csv += f'{year_data[0]["Year"]}-06-25,{year_data[0][k]}\n'

    return current_csv
