import React, {ReactNode} from 'react';
import packageJson from '../../package.json';

export default function _InfoPage(): ReactNode {
    return (
        <div>
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
