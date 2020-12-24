import { db } from "../db/database";

export async function isPaymentClaimed(paymentID: string, callback) {
  db.query("SELECT claimedAt FROM transactions WHERE id=?", [paymentID], (error, results, fields) => {
      if (!results[0])
          callback();
  });
}


//Add payment as claimed to database
export async function claimPayment(paymentID: string, user: string) {
  db.query("INSERT INTO transactions(id, claimedAt, user) VALUES(?, ?, ?)", [paymentID, Math.floor(Date.now() / 1000), user]);
}