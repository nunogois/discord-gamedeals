# discord-gamedeals

Periodically sends free / highly scored posts from r/GameDeals to Discord.

# 🛠 Setup on your own Discord server

Make sure you have Node.js installed.

You'll need to create a Webhook for the channel you want to populate:

Right click on the channel > Edit Channel > Integrations > Webhooks > Create Webhook

1.  `git clone https://github.com/nunogois/discord-gamedeals.git`
2.  `yarn` or `npm install`
3.  Add a new `.env` file in the folder with the following format: `WEBHOOK=https://discord.com/api/webhooks/...` with your webhook
4.  `yarn start` or `npm run start`

# 📌 To Do

- [x] Create repo;
- [x] Get r/GameDeals JSON;
- [x] Add local scan.json file for config and keeping track of sentPosts;
- [x] Add minScore filter;
- [x] Add freeRegex filter;
- [x] Add Webhook;
- [x] Send posts embedded to Discord (https://www.npmjs.com/package/discord-webhook-node);
- [x] Add setup to README;
