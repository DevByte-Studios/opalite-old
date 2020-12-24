import { db } from "../db/database";
import { getSnowflake, getTimestamp } from "../utils/data";

export async function discordRegister(discordId: string, callback) {
  db.query("SELECT uid, permission FROM users WHERE discord=?", [discordId], (error, results, fields) => {
      if (!results[0]) {
          let flake = getSnowflake();
          db.query("INSERT INTO users(uid, discord, credits, permission) VALUES (?, ?, ?, ?)", [flake, discordId, 0, 0]);
          callback(flake, 0);
      } else {
          callback(results[0].uid, results[0].permission);
      }
  });
}

export async function modifyCredits(userUid: string, amount: number) {
  db.query("INSERT INTO creditTransactions(uid, timestamp, user, amount) VALUES (?, ?, ?, ?)", [getSnowflake(), getTimestamp(), userUid, amount]);
  db.query("UPDATE users SET credits = credits + ? WHERE uid=?", [amount, userUid]);
}

//Get full user object from uid
export function getUser(uid: string, callback) {
  db.query("SELECT * FROM users WHERE uid=?", [uid], (error, results, fields) => {
      callback(results[0]);
  });
}