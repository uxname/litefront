import React from 'react';
import NextHead from 'next/head';

interface IProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}
const defaults = {
  title: 'LiteFront',
  description: 'LiteFront App',
  image: 'http://localhost:3000/api/logo?titleFirst=Lite&titleSecond=Front',
  url: 'http://localhost:3000',
};

export const Meta = (props: IProps) => (
  <NextHead>
    <title>{props.title || defaults.title}</title>
    <meta
      name="description"
      key={'desc'}
      content={props.description || defaults.description}
    />

    {/*<!-- Google / Search Engine Tags -->*/}
    <meta itemProp="name" content={props.title || defaults.title} />
    <meta
      itemProp="description"
      content={props.description || defaults.description}
    />
    <meta itemProp="image" content={props.image || defaults.image} />

    {/*<!-- Facebook Meta Tags -->*/}
    <meta property="og:locale" content="en_US" />
    <meta property="og:site_name" content={'LiteFront'} />
    <meta property="og:title" content={props.title || defaults.title} />
    <meta
      property="og:description"
      content={props.description || defaults.description}
    />
    <meta property="og:image" content={props.image || defaults.image} />
    <meta property="og:url" content={props.url || defaults.url} />
    <meta property="og:type" content="website" />
    <meta property="og:image:width" content="467" />
    <meta property="og:image:height" content="263" />
    {/*<!-- Twitter Meta Tags -->*/}
    <meta
      name="twitter:title"
      key={'ttitle'}
      content={props.title || defaults.title}
    />
    <meta
      name="twitter:description"
      key={'tdesc'}
      content={props.description || defaults.description}
    />
    <meta
      name="twitter:image"
      key={'timg'}
      content={props.image || defaults.image}
    />
    <meta name="twitter:card" key={'tcard'} content="summary_large_image" />
    <meta name="twitter:site" content={props.url || defaults.url} />
    <meta name="twitter:creator" content={props.url || defaults.url} />
  </NextHead>
);
