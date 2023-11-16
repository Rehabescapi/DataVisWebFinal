#!/usr/bin/env bash

port=9909

source CS468/bin/activate     # activate the virtual environment
cd app                        # move to 'app' dir
open "http://127.0.0.1:$port" # Launch the app in the [default] browser (new tab)
flask run --port "$port"
