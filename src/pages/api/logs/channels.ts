import { NextApiRequest, NextApiResponse } from 'next';
import { logService } from '@pages/api/logs/add';

export default function handler(
  _: NextApiRequest,
  response: NextApiResponse<unknown>
) {
  const channels = logService.getChannels();

  if (!channels || channels.length === 0) {
    response.status(404).json({ error: 'Channels not found' });
  } else {
    const html = channelsToHtml(channels);
    response.status(200).send(html);
  }
}

function channelsToHtml(channels: string[]): string {
  const selfUrlBase = process.env.NEXT_PUBLIC_SELF_URL_BASE as string;
  return channels.map(channel => {
    const url = `${selfUrlBase}/api/logs?channel=${channel}`;
    return `
      <a href="${url}" id="${channel}" style="padding: 0;">
        <strong>${channel}</strong>
      </a>
      <hr>
    `;
  }).join('\n');
}

