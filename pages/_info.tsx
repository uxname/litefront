import React, {ReactNode} from 'react';
import util from 'util';
import {exec as _exec} from 'child_process';
import packageJson from '../package.json';

type Props = {
    stdout?: string;
    stderr?: string;
}

const exec: (args: string) => Promise<Props> = util.promisify(_exec);

export default function _InfoPage(props: Props): ReactNode {
    return (
        <div>
            {
                props.stdout ? `Commit: ${props.stdout}` : `Commit error: ${props.stderr}`
            }
            <br/>
            {
                `${packageJson.name} ${packageJson.version}`
            }
            <hr/>
            {
                `Date: ${new Date().toISOString()}`
            }
        </div>
    );
}

export const getServerSideProps: () => Promise<{ props: Props }> = async () => {
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
