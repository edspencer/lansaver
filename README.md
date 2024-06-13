## Features

Allows users to configure Devices on their network that they wish to back up configurations for - Firewalls, Managed Switches, Home Assistant instances, etc

## To do

- username/password credentials
- Schedules UI
- Settings?
- All backups UI
- Controlled dataset
- Toasts for user feedback - how to incorporate into server actions (esp with redirect)?
- Delete backup files when deleting the backup db entry (depends on where we saved the file...)
- Destinations support

## Supported Backup Sources

- OPNSense
- Home Assistant
- TP Link Managed Switches

## Supported Destinations

- git repository

## Models

Device

- type: String (e.g. opnsense, tplink, homeassistant, etc)
- hostname: String
- username: String
- password: String
- credentials?: String

Backup

- device_id: Integer
- created_at: Datetime
- status: String

Schedule

- disabled: Boolean
- cron: String
- name: String

Destination

- type: String (e.g. git, ftp, scp, email)
- how to represent these credentials/details?

Job

- created_at: Datetime
- started_at: Datetime
- finished_at: Datetime
- status: Datetime
- schedule_id: Integer

Back everything up on the same schedule? Probably, but should probably be able to choose which devices on each Schedule.
Probably most people would just want one schedule and back everything up at the same time

A Schedule triggers zero or more backups. Once all have been performed, should do whatever user configures. Should track these as Jobs. Job status should be a state machine. So should Backup status - which is probably just queued, running, succeeded or error.

A Destination represents some place where the backups should be sent. Destinations include git, ftp, email, scp, and each needs some custom code that will implement the way it should receive data (e.g. git adapter should check out repo, add files, commit and push. scp is probably a simpler implementation, as it email).
