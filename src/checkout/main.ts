import * as core from "@actions/core";
import { checkoutRepos } from "./index";

(async () => {
  try {
    await checkoutRepos();
  } catch (err) {
    core.setFailed(`Action failed with error ${err}`);
  }
})();
