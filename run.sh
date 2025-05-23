#!/bin/bash

# if y-websocket is not already running...
if ! netstat -tulpn | grep 3099 | grep node
then
	# ... then start it
	PORT=3099 HOST=0.0.0.0 npx y-websocket &
fi

# start the tiptap HTTP server (this first builds static assets and then serves
# them)
REACT_APP_YJS_WEBSOCKET_SERVER_URL=ws://europa.d4.t7a.org:3099 npm start
