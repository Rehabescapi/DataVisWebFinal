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

### 4. Run Dev Mode
> `$ cd app`

> `$ flask run`

