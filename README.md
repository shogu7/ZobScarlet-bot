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

---

## Demo / Screenshots

Below are curated screenshots that illustrate the bot in action.

### Welcome message
![Welcome message](https://i.postimg.cc/Ssq9yqgc/Capture-d-e-cran-2026-01-08-a-09-42-36.png)  
*Example of the automated welcome message sent when a new member joins.*

### Reminder (scheduled alert)
![Reminder screenshot](https://i.postimg.cc/RZHJKq8Z/Capture-d-e-cran-2026-01-08-a-09-42-07.png)  
*Example of a scheduled reminder posted by the bot (DM or channel).*

### Siege registration (posting)
![Siege registration](https://i.postimg.cc/05Xz4p1z/Capture-d-e-cran-2026-01-08-a-09-41-20.png)  
*Automatic registration message posted for a siege event; members can interact to register.*

### Siege registration — results
![Registration results](https://i.postimg.cc/3wjyfV3h/Capture-d-e-cran-2026-01-08-a-09-41-34.png)  
*Dynamic summary of registrants and statistics posted to the results channel.*

### Expired registration
![Expired registration](https://i.postimg.cc/y8cWWtgS/Capture-d-e-cran-2026-01-08-a-09-40-44.png)  
*Example of an expired registration state and handling logic.*
