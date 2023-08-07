import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

export enum LogLevel {
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

type LogObject = {
  id: string;
  createdAt: Date;
  level: LogLevel;
  tag: string;
  message: string;
};

export class LogService {
  private readonly maxChannels: number;
  private readonly maxLogsPerChannel: number;
  private readonly channels: Map<string, LogObject[]>;

  constructor(maxChannels: number, maxLogsPerChannel: number) {
    this.maxChannels = maxChannels;
    this.maxLogsPerChannel = maxLogsPerChannel;
    this.channels = new Map();
  }

  createLog(
    channelName: string,
    level: LogLevel,
    tag: string,
    message: string,
  ) {
    if (
      !this.channels.has(channelName) &&
      this.channels.size >= this.maxChannels
    ) {
      this.removeOldestChannel();
    }

    const logs = this.channels.get(channelName) || [];
    const log: LogObject = {
      id: uuidv4(),
      createdAt: new Date(),
      level,
      tag,
      message,
    };

    if (logs.length >= this.maxLogsPerChannel) {
      logs.shift();
    }

    logs.push(log);
    this.channels.set(channelName, logs);
  }

  getLogs(
    channelName: string,
    tag?: string,
    limit?: number,
  ): LogObject[] | undefined {
    console.log('getLogs', channelName, tag, limit);
    let logs = this.channels.get(channelName);

    if (logs) {
      if (tag) {
        logs = logs.filter((log) => log.tag === tag);
      }

      if (limit && logs.length > limit) {
        logs = logs.slice(logs.length - limit);
      }

      return [...logs];
    } else {
      return undefined;
    }
  }

  private removeOldestChannel() {
    let oldestChannelName: string | undefined;
    let oldestLogTime: string | undefined;

    for (const [channel, logs] of this.channels) {
      if (logs[0] && (!oldestLogTime || logs[0].id < oldestLogTime)) {
        oldestLogTime = logs[0].id;
        oldestChannelName = channel;
      }
    }

    if (oldestChannelName) {
      this.channels.delete(oldestChannelName);
    }
  }
}

type ResponseData = { status: 'OK' | 'ERR'; message: string };

const MAX_CHANNELS = 1000;
const MAX_LOGS_PER_CHANNEL = 1000;

export const logService = new LogService(MAX_CHANNELS, MAX_LOGS_PER_CHANNEL);

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse<ResponseData>,
) {
  if(request.method !== 'POST'){
    response.status(405).json({
      status: 'ERR',
      message: 'Only POST requests are allowed',
    });
    return;
  }

  const { channel, level, tag, message } = request.body;

  if (!channel || !level || !tag || !message) {
    response.status(400).json({
      status: 'ERR',
      message: 'Missing required parameters',
    });
    return;
  }

  logService.createLog(channel, level, tag, message);

  response.status(200).json({
    status: 'OK',
    message: 'Log created',
  });
}
