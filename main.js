import fetch from "node-fetch";
import config from "./config.js";
globalThis.fetch = fetch;

import Discord from "discord-user-bots";
const client = new Discord.Client(config.token);
import cron from "cron";
import shill from "./words.js";

const rng = (arr) => {
  for (var i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

let shillWords = rng(shill);
let index = 0;
let maxIndex = shillWords.length;

console.log("+++ Memulai inisiasi");

client.on.ready = function () {
  let target = config.channelId;
  console.log("+++ Client online! Created by awala.me");

  try {
    // How to read the cron asterisk notation: https://crontab.guru/
    let q0 = new cron.CronJob(
      "*/1 * * * * *",
      async () => {
        if (index >= maxIndex) {
          index = 0;
          shillWords = rng(shillWords);
        }

        let randomTimer = Math.floor(Math.random() * 3000) + 2000;
        setTimeout(() => {
          try {
            let msg = shillWords[index]
              .replace(/\[ProjectName]/g, config.projectName)
              .replace(/\[TokenSymbol]/g, config.tokenSymbol);
            client.send(msg, target);

            console.log("+++ Pesan dikirimkan");
            console.log("+++ Isi pesan: ", msg);
            console.log("+++ Channel target: ", target);
            index++;
          } catch (er) {
            console.log(er);
          }
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
