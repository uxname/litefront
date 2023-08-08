import { NextApiRequest, NextApiResponse } from 'next';
import { LogLevel, logService } from '@pages/api/logs/add';

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse<unknown>,
) {
  const { channel,level,limit} = request.query;
  const logs = logService.getLogs(channel as string, level as unknown as LogLevel, limit as unknown as number);

  if (logs) {
    response.status(200).json(logs.map((log) => {
      const message = JSON.parse(log.message);
      return ({
        ...log,
        level: LogLevel[log.level],
        message: message.message,
        arguments: message.arguments_,
      });
    }));
  } else {
    response.status(404).json({ error: 'Channel not found' });
  }
}
