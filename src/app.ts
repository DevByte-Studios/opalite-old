import * as proxy from "./express/proxy";
import * as store from "./store/store";
import * as opalite from "./opalite/opalite";

proxy.init();
store.init();
opalite.init();