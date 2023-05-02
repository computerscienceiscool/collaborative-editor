#!/bin/bash

if ! netstat -tulpn | grep 3099 | grep node
then
	PORT=3099 HOST=0.0.0.0 npx y-websocket &
fi
REACT_APP_YJS_WEBSOCKET_SERVER_URL=ws://europa.d4.t7a.org:3099 npm start
