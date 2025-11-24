# Discord Guild Bot

A custom Discord bot built in JavaScript to manage guild activity, communication, and events in an automated and efficient way.

## Tech Stack

- Node.js
- discord.js
- cron / scheduling system
- Optional: database (MongoDB / SQLite / JSON)

## Features

- Welcome message sent when a new member joins the guild
- Weekly registration message every Saturday at 00:00
- Dynamic registration results posted in a separate channel
- Reminder system to create scheduled alerts
- Siege start announcement
- Quick and simple announcement system for staff

## Weekly Registration System

Every Saturday at 00:00:
- A registration message is posted automatically
- Members can interact to register (reactions, buttons, or commands)
- The bot tracks all participants
- A dynamic summary (list or statistics) is generated
- Results are posted in a dedicated channel

## Reminder System

- Create reminders using time or date
  - Examples: 10 minutes, 2 hours, specific date/time
- Supports:
  - Direct messages
  - Channel notifications
- Can be stored in memory or in a database for persistence

## Siege Notification

- Allows staff to announce the start of a siege
- Sends a formatted message in the announcement channel
- Can be linked to a scheduled time or triggered manually

## Security

- Restrict sensitive commands to trusted roles only
- Never expose the bot token
- Validate and sanitize all user input before posting
