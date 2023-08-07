import { NextApiRequest, NextApiResponse } from 'next';
import { logService } from '@pages/api/logs/add';

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse<unknown>,
) {
  const { channel,tag,limit} = request.query;
  console.log('getLogs', channel, tag, limit);
  const logs = logService.getLogs(channel as string, tag as string, Number(limit));

  if (logs) {
    response.status(200).json(logs);
  } else {
    response.status(404).json({ error: 'Channel not found' });
  }
}
