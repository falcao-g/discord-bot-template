# Bot template

<p align="center">
    <a title="Version discord.js" href="https://www.npmjs.com/package/discord.js">
        <img src="https://img.shields.io/badge/discord.js-v14.9.0-blue.svg?logo=npm" alt="Version discord.js">
    </a>
    <a title="Stars" href="https://github.com/falcao-g/discord-bot-template">
        <img src="https://img.shields.io/github/stars/falcao-g/discord-bot-template" alt="Stars">
    </a>
</p>

This is a unopinionated, lightweight and easy to use bot template for discord bots.

It is designed to be a good starting point for anyone who wants to create a discord bot with discord.js, but also have helpful features.

If you want to learn more about discord.js, you can check the [documentation](https://discord.js.org/#/docs/main/stable/general/welcome), I also recommend the [discord.js guide](https://discordjs.guide/) which has a lot of examples and explanations.

## 🚀 Features

- 🌎 Built-in message system for easy localization
- 🧠 Sharding support
- ⚙️ Easy to use command and events handler
- 🎲 Helpful functions and utilities
- 🗃️ MongoDB integration


## ⚡ How to run

### 👷 Requirements

- Node.js
- A MongoDB database

### 🧹 Preparing the enviroment

Clone this git repository somewhere in your OS, then open the cloned folder with a terminal of your choice and run `npm i`

When all of the dependencies finish installing, you will need to create a `config.json` file inside the `src` folder and paste this on it:

```json
{
	"devs": [""],
	"testGuilds": [""]
}
```

- "devs": put here the discord id of all developers of the bot, this will be important to manage slash commands
- "testGuilds": your guilds for testing, developer commands will only register here

In addition, you will also need to remove the `.example` from the `.env.example` file and fill it like this:

- "TOKEN": your discord bot token
- "MONGODB_URI": your mongodb connection uri

### 🏃‍♂️ Running

If everything was done correctly, you just need to open a terminal on the folder and run `npm start` and the bot should be up and running!

I put a lot of comments and insights on the code, hope this is helpful por people that want to learn how to buil bots!


## ❓ Want to contribute?

If you want to contribute, please read the [contributing guide](CONTRIBUTING.md).
