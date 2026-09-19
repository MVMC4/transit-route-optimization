# Backup operations examples

These files are reviewed examples, not an automatic production deployment. Replace every placeholder, pin tool versions, restrict permissions, and prove a restore on an isolated host before enabling the timers.

- `pgbackrest.conf.example`: encrypted S3-compatible physical backups and WAL archive.
- `logical-backup.sh`: portable PostgreSQL tar archive, checksum, verification, and optional S3 upload.
- `systemd/tsela-logical-backup.service`: restricted one-shot job.
- `systemd/tsela-logical-backup.timer`: daily 04:00 schedule in the host timezone.

The backup host timezone must be `Africa/Johannesburg` if 04:00 local time is the requirement. Monitor the timer's last successful completion independently; systemd scheduling alone is not proof that a usable backup exists.

Required environment for the logical job:

```text
PGHOST=db.internal
PGPORT=5432
PGDATABASE=transit
PGUSER=tsela_backup
PGPASSFILE=/run/secrets/tsela-pgpass
BACKUP_DIR=/var/backups/tsela/logical
```

Optional object-store copy:

```text
BACKUP_S3_URI=s3://tsela-db-backups-prod/logical
BACKUP_S3_ENDPOINT=https://objects.internal
AWS_SHARED_CREDENTIALS_FILE=/run/secrets/tsela-backup-aws-credentials
```

Read [`docs/BACKUP_AND_DISASTER_RECOVERY.md`](../../docs/BACKUP_AND_DISASTER_RECOVERY.md) before operating these examples.
