import React from 'react';
import { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';

import { logoStyles } from './logo.styles';

// Should be exported for OG image
export const config = {
  runtime: 'experimental-edge',
};

const font = fetch(
  new URL('../../../../public/fonts/sf.ttf', import.meta.url),
  // eslint-disable-next-line unicorn/prefer-top-level-await
).then((response) => response.arrayBuffer());

export default async function handler(request: NextRequest) {
  try {
    const fontData = await font; // todo replace by await
    const { searchParams } = new URL(request.url);

    const hasTitleFirst = searchParams.has('titleFirst');
    const titleFirst = hasTitleFirst
      ? searchParams.get('titleFirst')
      : 'Unknown';

    const hasTitleSecond = searchParams.has('titleSecond');
    const titleSecond = hasTitleSecond
      ? searchParams.get('titleSecond')
      : 'Unknown';

    return new ImageResponse(
      (
        <div style={logoStyles.wrapper}>
          <p style={logoStyles.textFirst}>{titleFirst}</p>
          <p style={logoStyles.textSecond}>{titleSecond}</p>
        </div>
      ),
      {
        width: 600,
        height: 200,
        fonts: [
          {
            name: 'San Francisco',
            data: fontData,
            style: 'normal',
            weight: 100,
          },
        ],
      },
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`${error.message}`);
    return new Response(
      JSON.stringify({
        message: 'Render error',
        error: error.message,
      }),
      {
        status: 500,
      },
    );
  }
}
