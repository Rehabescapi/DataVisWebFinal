# Development
## GEOJSON ISSUES
## https://observablehq.com/@john-guerra/d3-black-box-map
## when converting to D3 V6, the current GeoJsonFiles are showing up as a black box.
## This link resolves the issue




## Setup

### 1. Activate Virtual environment
Virtual Environment settings created based on 
[Flask Mega-Tutorial](https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world "The Flask Mega-Tutorial Part I: Hello, World!")

> `$ python3 -m venv CS468`

> `$ source CS468/bin/activate`

### 2. Install essential packages
> `$ pip install flask python-dotenv numpy pandas geopandas geographiclib`

### 3. Make changes in `.flaskenv` depending on your Environment

- MacOS <br>
> `export FLASK_APP=server.py`

- Windows <br>
> `setx FLASK_APP "server.py"`

<br><br>

# How to run the app

##### Prerequisite installations
1. Python 3.
2. Flask.

#### Windows*
1. Open Powershell
2. Move into the root level of the project (same level as `run.sh`)
3. Run the shell script: `$ bash run.sh`

#### MacOS/Linux
1. Open Terminal
2. Move into the root level of the project (same level as `run.sh`)
3. Run the shell script: `$ bash run.sh`

<hr>

__The app should launch in a new tab in your default browser.__

<br>

> __*__ `Script not tested on Windows`

<br><br>

# Browsing around
1. [Homepage](http://127.0.0.1:9909 "Landing page")
2. [Others](http://127.0.0.1:8000/others "Others")
3. [Map of Illinois](http://127.0.0.1:8000/il-map "Elections map")

