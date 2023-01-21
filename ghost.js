import fetch from "node-fetch";
import config from "./config.js";
globalThis.fetch = fetch;

import Discord from "discord-user-bots";
const client = new Discord.Client(config.token);
import cron from "cron";
console.log("+++ Memulai inisiasi");

client.on.ready = function () {
  let channels = config.channelId;
  console.log("+++ Client online! Created by awala.me");
  try {
    // How to read the cron asterisk notation: https://crontab.guru/
    let go = new cron.CronJob(
      "*/1 * * * *",
      async () => {
        let randomTimer = Math.floor(Math.random() * 5000) + 10000;
        setTimeout(() => {
          client.send("Hello!", channels).then((msg) => {
            console.log("+++ Pesan dikirimkan dan langsung dihapus");
            setTimeout(() => {
              client.delete_message(msg.id, channels);
            }, 100);
          });
        }, randomTimer);
      },
      null,
      true,
      config.timezone
    );
  } catch (error) {
    console.log(error.message);
  }
};
