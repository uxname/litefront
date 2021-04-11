import React, {ReactNode} from 'react';
import util from 'util';
import {exec as _exec} from 'child_process';
import packageJson from '../package.json';

const exec: (arg1: string) => Promise<string> = util.promisify(_exec);

type Props = {
    props: {
        stdout: string;
        stderr: string;
    }
}

export default function _InfoPage(props: Props): ReactNode {
    return (
        <div>
            {
                props.stdout ? `Commit: ${props.stdout}` : `Commit error: ${props.stderr}`
            }
            <br/>
            {
                `App ver.:${packageJson.version}`
            }
            <hr/>
            {
                `Date: ${new Date().toISOString()}`
            }
        </div>
    );
}

export const getServerSideProps: () => Promise<Props> = async () => {
    try {
        const {stdout, stderr} = await exec('git rev-parse HEAD');
        return {
            props: {
                stdout, stderr
            }
        };
    } catch (e) {
        return {
            props: {
                stderr: e.message
            }
        };
    }
};
