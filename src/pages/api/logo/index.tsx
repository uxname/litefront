import React from 'react';
import {NextRequest} from 'next/server';
import {ImageResponse} from '@vercel/og';

import S from './Logo.styles';

export const config = {
    runtime: 'experimental-edge'
};
const fontSF = fetch(new URL('../../../../public/fonts/sf.ttf', import.meta.url)).then(res =>
    res.arrayBuffer()
);

export default async function handler(req: NextRequest) {
    const fontSFData = await fontSF;
    try {
        const {searchParams} = new URL(req.url);

        const hasTitleFirst = searchParams.has('titleFirst');
        const titleFirst = hasTitleFirst ? searchParams.get('titleFirst') : 'Lite';

        const hasTitleSecond = searchParams.has('titleSecond');
        const titleSecond = hasTitleSecond ? searchParams.get('titleSecond') : 'Front';

        return new ImageResponse((
            <div style={S.wrapper}>
                <p style={S.textFirst}>{titleFirst}</p>
                <p style={S.textSecond}>{titleSecond}</p>
            </div>
        ), {
            width: 600,
            height: 200,
            fonts: [
                {
                    name: 'San Francisco',
                    data: fontSFData,
                    style: 'normal',
                    weight: 100
                }
            ]
        });
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response('Failed to generate the image', {
            status: 500
        });
    }
}
