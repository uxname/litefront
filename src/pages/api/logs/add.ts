import type { NextApiRequest, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';

export enum LogLevel {
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

export type LogObject = {
  id: string;
  createdAt: Date;
  level: LogLevel;
  message: string;
};

export class LogService {
  private readonly maxChannels: number;
  private readonly maxLogsPerChannel: number;
  private readonly maxLogSize: number;
  private readonly channels: Map<string, LogObject[]>;

  constructor(maxChannels: number, maxLogsPerChannel: number, maxLogSize: number) {
    this.maxChannels = maxChannels;
    this.maxLogsPerChannel = maxLogsPerChannel;
    this.maxLogSize = maxLogSize;
    this.channels = new Map();
  }

  createLog(
    channelName: string,
    level: LogLevel,
    message: string,
  ) {
    if (
      !this.channels.has(channelName) &&
      this.channels.size >= this.maxChannels
    ) {
      this.removeOldestChannel();
    }

    if (message.length > this.maxLogSize) {
      throw new Error(`Message too long, max size is ${this.maxLogSize}, got ${message.length}`);
    }

    const logs = this.channels.get(channelName) || [];
    const log: LogObject = {
      id: uuidv4(),
      createdAt: new Date(),
      level,
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
    level?: LogLevel,
    limit?: number,
  ): LogObject[] | undefined {
    let logs = this.channels.get(channelName);

    if (logs) {
      if (level) {
        logs = logs.filter((log) => log.level === level);
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

  public getChannels(): string[] {
    return [...this.channels.keys()];
  }
}

type ResponseData = { status: 'OK' | 'ERROR'; message: string };

const MAX_CHANNELS = 1000;
const MAX_LOGS_PER_CHANNEL = 1000;
const MAX_LOG_SIZE = 50000;

export const logService = new LogService(MAX_CHANNELS, MAX_LOGS_PER_CHANNEL, MAX_LOG_SIZE);

export default function handler(
  request: NextApiRequest,
  response: NextApiResponse<ResponseData>,
) {
  if(request.method !== 'POST'){
    response.status(405).json({
      status: 'ERROR',
      message: 'Only POST requests are allowed',
    });
    return;
  }

  const { channel, level, message } = request.body;

  if (!channel || !Number.isInteger(level) || !message) {
    response.status(400).json({
      status: 'ERROR',
      message: 'Missing required parameters',
    });
    return;
  }

  try {
    logService.createLog(channel, level,  message);

    response.status(200).json({
      status: 'OK',
      message: 'Log created',
    });
  } catch (error) {
    response.status(500).json({
      status: 'ERROR',
      message: (error as Error).message,
    });
  }
}
