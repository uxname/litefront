import React from 'react';
import {NextRequest} from 'next/server';
import {ImageResponse} from '@vercel/og';

import {logoStyles} from './logo.styles';

// Should be exported for OG image
export const config = {
    runtime: 'edge'
};

const font = (fetch(new URL('../../../../public/fonts/sf.ttf', import.meta.url)).then(res => res.arrayBuffer()));

export default async function handler(req: NextRequest) {
    try {
        const fontData = await font; // todo replace by await
        const {searchParams} = new URL(req.url);

        const hasTitleFirst = searchParams.has('titleFirst');
        const titleFirst = hasTitleFirst ? searchParams.get('titleFirst') : 'Unknown';

        const hasTitleSecond = searchParams.has('titleSecond');
        const titleSecond = hasTitleSecond ? searchParams.get('titleSecond') : 'Unknown';

        return new ImageResponse((
            <div style={logoStyles.wrapper}>
                <p style={logoStyles.textFirst}>{titleFirst}</p>
                <p style={logoStyles.textSecond}>{titleSecond}</p>
            </div>
        ), {
            width: 600,
            height: 200,
            fonts: [
                {
                    name: 'San Francisco',
                    data: fontData,
                    style: 'normal',
                    weight: 100
                }
            ]
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        console.error(`${e.message}`);
        return new Response(JSON.stringify({
            message: 'Render error',
            error: e.message
        }), {
            status: 500
        });
    }
}
