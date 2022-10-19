import { getCommonInputs } from "../input-helper";
import { shell } from "../git-helper";
import * as core from "@actions/core";
import * as fs from "fs";

export async function checkoutRepos(): Promise<void> {
    const ci: ICommonInputs = await getCommonInputs();
    const promises: Array<Promise> = [];
    for(let repository of ci.repositories) {
        if (repository.split("|").length < 3 ) {
            core.setFailed(`Not enough arguments for repositories`);
            break
        }
        const [ repo, ref, dst, depth, token ] = repository.split("|").map(item => item.trim());
        let dirExist: boolean = false;
        let dstPath = dst.startsWith('/') ? dst : `${ci.dir}/${dst}/`;
        dstPath = dstPath.endsWith('/') ? dstPath : `${dstPath}/`;
        try {
            let data = await fs.promises.readFile(`${dstPath}/.git/config`, { encoding: "utf8"});
            if(token && typeof token !== "undefined") {
                data = data.replace(new RegExp("url\\s?=\\s?https://(.+@)?github.com", 'g'), `url = https://${token}@github.com`);
                await fs.promises.writeFile(`${dstPath}.git/config`, data, { encoding: "utf8"});
            }
            dirExist = true;
        } catch (err) {
            if(ci.verbose) {
                console.log(`Check if dir exists:`, err);
            }
        }
        const fullRepoPath = ( token && typeof token !== "undefined" )? `https://${token}@github.com/${repo}` : `https://github.com/${repo}`;
        let gitArgs: string[];
        if(dirExist) {
            let HEAD: string = await fs.promises.readFile(`${dstPath}/.git/HEAD`, { encoding: "utf8"});
            let branch: string = "";
            try {
                branch = HEAD.match(new RegExp(".+\\srefs/heads/(.*)",""))[1];
            } catch(err) {
                if (ci.verbose) {
                    console.log("Fail to read HEAD", err);
                }
            }
            gitArgs = ["cd", dst, ";"];
            if (branch != ref || !ci.nocheckout ) {
                gitArgs =  gitArgs.concat(["git", "checkout" , ref, ";"]);
            }
            gitArgs = gitArgs.concat([ "git", "fetch", ";", "git", "reset", "--hard", `origin/${ref}`, ";", "git", "clean", "-d", "-f"]);
        } else {
            gitArgs = ["git", "clone", fullRepoPath, "-b", ref];
            if (depth && typeof depth !== "undefined") {
                gitArgs = gitArgs.concat(["--depth", depth]);
            }
            gitArgs = gitArgs.concat([dst]);
        }
        promises.push(shell(gitArgs));
    }
    await Promise.all(promises)
}