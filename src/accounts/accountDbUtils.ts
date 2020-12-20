import { db } from "../database";
import { getSnowflake, getTimestamp } from "../utils/dataUtils";

export async function discordRegister(discordId: string, callback) {
  db.get("SELECT uid, permission FROM users WHERE discord=?", [discordId], (err, row) => {
      if (row == undefined) {
          let flake = getSnowflake();
          db.run("INSERT INTO users(uid, discord, credits, permission) VALUES (?, ?, ?, ?)", [flake, discordId, 0, 0]);
          callback(flake, 0);
      } else {
          callback(row.uid, row.permission);
      }
  });
}

export async function modifyCredits(userUid: string, amount: number) {
  db.run("INSERT INTO creditTransactions(uid, timestamp, user, amount) VALUES (?, ?, ?, ?)", [getSnowflake(), getTimestamp(), userUid, amount]);
  db.run("UPDATE users SET credits = credits + ? WHERE uid=?", [amount, userUid]);
}

//Get full user object from uid
export function getUser(uid: string, callback) {
  db.get("SELECT * FROM users WHERE uid=?", [uid], (err, row) => {
      callback(row);
  });
}