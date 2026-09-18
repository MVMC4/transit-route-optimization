#!/bin/bash
# wait-for-it.sh from https://github.com/vishnubob/wait-for-it
# Usage: ./wait-for-it.sh host:port -- command

set -e

hostport=$1
shift
cmd="$@"

IFS=':' read -r host port <<< "$hostport"

echo "Waiting for $host:$port..."

while ! nc -z "$host" "$port"; do
  sleep 1
done

echo "$host:$port is up! Running command..."
exec $cmd
