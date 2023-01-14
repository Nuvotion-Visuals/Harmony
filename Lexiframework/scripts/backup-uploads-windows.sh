backup_date=$(date +"%Y_%m_%d_%I_%M_%p")
tar -caf ./backups/lexi-studio-api_uploads_$backup_date.tar -C ./public/uploads .
cp ./backups/lexi-studio-api_uploads_$backup_date.tar ./backups/lexi-studio-api_uploads_latest.tar