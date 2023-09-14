import { v4 as uuidv4 } from 'uuid';
export enum LogLevel {
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

type Colors = {
  [key in LogLevel]: string;
};

const jsonCircular = (object: unknown): unknown => {
  const cache = new Set();

  return JSON.stringify(object, (_, value) => {
    if (value instanceof Error) {
      return {
        name: value.name,
        message: value.message,
        stack: value.stack
          ? // eslint-disable-next-line no-magic-numbers
            value.stack.split('\n').slice(0, 3).join('\n')
          : undefined,
      };
    }

    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        // eslint-disable-next-line unicorn/no-useless-undefined
        return undefined;
      }
      cache.add(value);
    }

    return value ?? undefined;
  });
};

function sendLog(
  level: LogLevel,
  message: string,
  ...arguments_: unknown[]
): void {
  const selfUrlBase = process.env.NEXT_PUBLIC_SELF_URL_BASE as string;
  const url = `${selfUrlBase}/api/logs/add`;
  const body = {
    channel: getBrowserId(),
    level,
    message: jsonCircular({
      message,
      arguments_,
    }),
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).catch((error) => {
    console.error('Send logs error:', error);
  });
}

export function getBrowserId(): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }
  const currentBrowserId = localStorage.getItem('browser-id');
  if (currentBrowserId) {
    return currentBrowserId;
  } else {
    const newBrowserId = uuidv4();
    localStorage.setItem('browser-id', newBrowserId);
    return newBrowserId;
  }
}

export class log {
  private static level: LogLevel = LogLevel.TRACE;

  private static colors: Colors = {
    [LogLevel.TRACE]: 'gray',
    [LogLevel.DEBUG]: 'green',
    [LogLevel.INFO]: 'blue',
    [LogLevel.WARN]: 'orange',
    [LogLevel.ERROR]: 'red',
  };

  static setLevel(level: LogLevel): void {
    this.level = level;
  }

  static trace(message: string, ...arguments_: unknown[]): void {
    this.log(LogLevel.TRACE, message, ...arguments_);
  }

  static debug(message: string, ...arguments_: unknown[]): void {
    this.log(LogLevel.DEBUG, message, ...arguments_);
  }

  static info(message: string, ...arguments_: unknown[]): void {
    this.log(LogLevel.INFO, message, ...arguments_);
  }

  static warn(message: string, ...arguments_: unknown[]): void {
    this.log(LogLevel.WARN, message, ...arguments_);
  }

  static error(message: string, ...arguments_: unknown[]): void {
    this.log(LogLevel.ERROR, message, ...arguments_);
  }

  private static log(
    level: LogLevel,
    message: string,
    ...arguments_: unknown[]
  ): void {
    if (level < this.level) {
      return;
    }

    // throw if level is not a valid LogLevel
    if (!Object.values(LogLevel).includes(level)) {
      throw new Error(`Invalid log level: ${level}`);
    }

    // eslint-disable-next-line security/detect-object-injection
    const color = this.colors[level] || 'black';
    // eslint-disable-next-line security/detect-object-injection
    const prefix = `[${LogLevel[level]}]`;
    console.log(`%c ${prefix} ${message}`, `color: ${color}`, ...arguments_);

    if (process.env.NEXT_PUBLIC_SELF_URL_BASE) {
      sendLog(level, message, ...arguments_);
    }
  }
}

if (typeof window !== 'undefined') {
  log.info('Browser ID:', getBrowserId());
}
