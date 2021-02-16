import { db } from "../db/database";
import { getSnowflake, getTimestamp } from "../utils/data";

export async function discordRegister(discordId: string, discordPfp: string, callback) {
  db.query("SELECT uid, permission_level FROM users WHERE discord=?", [discordId], (error, results, fields) => {
      if (!results[0]) {
          let flake = getSnowflake();
          db.query("INSERT INTO users(uid, discord, profile_picture, permission_level, role, credits) VALUES (?, ?, ?, ?, ?, ?)", [flake, discordId,  discordPfp, 0, 0, 0, 0]);
          callback(flake, 0);
      } else {
          db.query("UPDATE users SET profile_picture = ? WHERE discordid = ?", [discordPfp, discordId]);
          callback(results[0].uid, results[0].permission);
      }
  });
}

//Get full user object from uid
export function getUser(uid: string, callback) {
  db.query("SELECT * FROM users WHERE uid=?", [uid], (error, results, fields) => {
      callback(results[0]);
  });
}