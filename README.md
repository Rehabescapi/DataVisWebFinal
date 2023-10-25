Change in .flaskenv depending on your possible Environment
Virtual Environment settings created based on 
https://blog.miguelgrinberg.com/post/the-flask-mega-tutorial-part-i-hello-world
To Activate Virtual environment

python3 -m venv CS468
source CS468/bin/activate



(CS468) $ pip install flask
(CS468) $ pip install python-dotenv







.flaskenv settings
MacOS
export FLASK_APP=server.py
Windows
setx FLASK_APP "server.py"