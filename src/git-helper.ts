import * as exec from "@actions/exec";
import { getCommonInputs } from "./input-helper";
import { ICommonInputs } from "./ICommonInputs";

export function getExecOpts(opt: object): object {
    const options = opt;
    const out = { data: ""};
    const err = { data: ""};
    options.listeners = {
      stdout: (data: Buffer) => {
        out.data += data.toString();
      },
      stderr: (data: Buffer) => {
        err.data += data.toString();
      },
    };
    return {out: out, err: err, options: options}
  }

export async function git(rsyncArgs: Array): Promise {
    const ci: ICommonInputs = await getCommonInputs();
    const opts = getExecOpts({cwd: ci.dir, env: { ...process.env }});
    return exec.exec("bash", ['-c', rsyncArgs.join(' ')], opts.options);
}