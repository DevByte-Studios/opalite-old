import { db } from "../db/database";

export async function isPaymentClaimed(paymentID: string, callback) {
  db.get("SELECT claimedAt FROM transactions WHERE id=?", [paymentID], (err, row) => {
      if (row == undefined)
          callback();
  });
}


//Add payment as claimed to database
export async function claimPayment(paymentID: string, user: string) {
  db.run("INSERT INTO transactions(id, claimedAt, user) VALUES(?, ?, ?)", [paymentID, Math.floor(Date.now() / 1000), user]);
}