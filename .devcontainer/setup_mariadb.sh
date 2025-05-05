#!/bin/bash

# This script is used to initially populate the mariadb

# Set MySQL connection variables or use those already set by the container environment
MYSQL_USER=${MYSQL_USER:-root} # use the default root or adjust as necessary
MYSQL_PASSWORD=${MYSQL_PASSWORD:-your_root_password}
MYSQL_DATABASE=${MYSQL_DATABASE:-your_database_name}

# Array with the paths and order of SQL files to be executed
SQL_FILES=(
  "/TestDatabase/statiegeld_test/supermarkets.sql"
  "/TestDatabase/statiegeld_test/meldingen.sql"
  "/TestDatabase/statiegeld_test/sticker_requests.sql"
  "/TestDatabase/supermarkets_data.sql"
  "/TestDatabase/meldingen_data.sql"
)

echo "Starting to initially populate database using TestDatabase sql scripts."

# Execute each SQL file in order
for sql_file in "${SQL_FILES[@]}"
do
  if [ -f "$sql_file" ]; then
    echo "Executing $sql_file..."
    mariadb -u"$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" < "$sql_file" || {
      echo "Failed to execute $sql_file"
      exit 1
    }
  else
    echo "SQL file $sql_file not found, skipping..."
  fi
done

echo "All specified scripts executed successfully."
