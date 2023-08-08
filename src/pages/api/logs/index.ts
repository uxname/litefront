import { NextApiRequest, NextApiResponse } from 'next';
import { LogLevel, LogObject, logService } from '@pages/api/logs/add';

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse<unknown>,
) {
  const { channel,level,limit} = request.query;
  const logs = logService.getLogs(channel as string, level as unknown as LogLevel, limit as unknown as number);

  if (logs) {
    const html = logsToHtml(logs);
    response.status(200).send(html);
  } else {
    response.status(404).json({ error: 'Channel not found' });
  }
}

function colorByLogLevel(level: LogLevel): string {
  switch(level) {
    case LogLevel.DEBUG:
      return 'blue';
    case LogLevel.INFO:
      return 'green';
    case LogLevel.WARN:
      return 'orange';
    case LogLevel.ERROR:
      return 'red';
    default:
      return 'gray';
  }
}

function logsToHtml(logs: Array<LogObject>): string {
  return logs.map(log => {
    const parsedMessage = JSON.parse(log.message);
    console.log('TYPE', parsedMessage.arguments_)
    return `
      <div id="${log.id}" style="padding: 0; color: ${colorByLogLevel(log.level)}">
        <strong>${log.createdAt.toISOString()}</strong>
        <span>${parsedMessage.message}</span>
        <span>${JSON.stringify(parsedMessage.arguments_)}</span>
     </div>
    `;
  }).join("\n");
}
