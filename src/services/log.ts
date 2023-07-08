export enum LogLevel {
  TRACE = 0,
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

type Colors = {
  [key in LogLevel]: string;
};

export class log {
  private static level: LogLevel = LogLevel.TRACE;

  private static colors: Colors = {
    [LogLevel.TRACE]: 'gray',
    [LogLevel.DEBUG]: 'green',
    [LogLevel.INFO]: 'blue',
    [LogLevel.WARN]: 'orange',
    [LogLevel.ERROR]: 'red',
  };

  static setLevel(level: LogLevel) {
    this.level = level;
  }

  static trace(message: string, ...arguments_: unknown[]) {
    this.log(LogLevel.TRACE, message, ...arguments_);
  }

  static debug(message: string, ...arguments_: unknown[]) {
    this.log(LogLevel.DEBUG, message, ...arguments_);
  }

  static info(message: string, ...arguments_: unknown[]) {
    this.log(LogLevel.INFO, message, ...arguments_);
  }

  static warn(message: string, ...arguments_: unknown[]) {
    this.log(LogLevel.WARN, message, ...arguments_);
  }

  static error(message: string, ...arguments_: unknown[]) {
    this.log(LogLevel.ERROR, message, ...arguments_);
  }

  private static log(
    level: LogLevel,
    message: string,
    ...arguments_: unknown[]
  ) {
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
  }
}
