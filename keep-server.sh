#!/bin/bash
cd /home/z/my-project
while true; do
  if ! curl -s -o /dev/null http://localhost:3000/ 2>/dev/null; then
    lsof -ti:3000 2>/dev/null | xargs -r kill -9 2>/dev/null
    sleep 1
    nohup ./node_modules/.bin/next dev -p 3000 > dev.log 2>&1 < /dev/null &
    sleep 8
  fi
  sleep 10
done
