import * as core from "@actions/core";
import {ICommonInputs} from "./ICommonInputs";


export async function getCommonInputs(): Promise<ICommonInputs> {
    const result = ({} as unknown) as ICommonInputs;
    result.dir = core.getInput('directory', { required: false });
    result.repositories = core.getMultilineInput('repositories', { required: true });
    result.verbose = core.getBooleanInput('verbose', { required: false });
    return result;
}