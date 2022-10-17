import { getCommonInputs } from "../input-helper";
import { git } from "../git-helper";
import * as core from "@actions/core";

export async function checkoutRepos(): Promise<void> {
    const ci: ICommonInputs = await getCommonInputs();
    const promises: Array<Promise> = [];
    for(let repository of ci.repositories) {
        if (repository.split("|").length < 4 ) {
            core.setFailed(`Action failed with error ${err}`);
        }
        const { repo, ref, dst, depth } = repository.split("|");
        const gitArgs: string[] = ["git", "clone", repo, "-b", ref, "--depth", depth, dst];
        promises.push(git(gitArgs));
    }
    await Promise.all(promises)
}