import * as db from "./db/database";
import * as router from "./routes/router";

export function init() {
  db.init();

  router.init();
}