import React from 'react';
import NextHead from 'next/head';

import appInfo from '../../../app-info.json';

interface IProperties {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const defaults = {
  title: `${appInfo.name} ${appInfo.version}`,
  description: appInfo.name,
  image: `http://localhost:3000/api/logo?titleFirst=${appInfo.name}&titleSecond=${appInfo.version}`,
  url: 'http://localhost:3000',
};

export const Meta = (properties: IProperties) => (
  <NextHead>
    <title>{properties.title || defaults.title}</title>
    <meta
      name="description"
      key={'desc'}
      content={properties.description || defaults.description}
    />

    {/*<!-- Google / Search Engine Tags -->*/}
    <meta itemProp="name" content={properties.title || defaults.title} />
    <meta
      itemProp="description"
      content={properties.description || defaults.description}
    />
    <meta itemProp="image" content={properties.image || defaults.image} />

    {/*<!-- Facebook Meta Tags -->*/}
    <meta property="og:locale" content="en_US" />
    <meta property="og:site_name" content={'LiteFront'} />
    <meta property="og:title" content={properties.title || defaults.title} />
    <meta
      property="og:description"
      content={properties.description || defaults.description}
    />
    <meta property="og:image" content={properties.image || defaults.image} />
    <meta property="og:url" content={properties.url || defaults.url} />
    <meta property="og:type" content="website" />
    <meta property="og:image:width" content="467" />
    <meta property="og:image:height" content="263" />
    {/*<!-- Twitter Meta Tags -->*/}
    <meta
      name="twitter:title"
      key={'ttitle'}
      content={properties.title || defaults.title}
    />
    <meta
      name="twitter:description"
      key={'tdesc'}
      content={properties.description || defaults.description}
    />
    <meta
      name="twitter:image"
      key={'timg'}
      content={properties.image || defaults.image}
    />
    <meta name="twitter:card" key={'tcard'} content="summary_large_image" />
    <meta name="twitter:site" content={properties.url || defaults.url} />
    <meta name="twitter:creator" content={properties.url || defaults.url} />
  </NextHead>
);
