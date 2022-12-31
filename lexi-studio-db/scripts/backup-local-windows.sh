#/bin/bash
backup_name=$(date +"%Y_%m_%d_%I_%M_%p")
docker exec lexi-studio-db sh -c 'exec mysqldump --all-databases -uroot -p"$MYSQL_ROOT_PASSWORD"' > "./backups/lexi-studio-db_$backup_name.sql"
cp ./backups/lexi-studio-db_$backup_name.sql ./backups/lexi-studio-db_latest.sql