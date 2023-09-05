import winston from 'winston';
import DailyRotateFile = require('winston-daily-rotate-file');
const { format } = winston;

const errorFilter = winston.format((info, opts) => {
    return info.level === 'error' ? info : false;
});

const infoFilter = winston.format((info, opts) => {
    return info.level === 'info' ? info : false;
});
// Setup logging
const infoLogRotateTransport = new DailyRotateFile({
    filename: 'logs/info-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
    level: 'info',
    format: format.combine(
        infoFilter(),
        format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A'
        }),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    )
});
const errorLogRotateTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '14d',
    level: 'error',
    format: format.combine(
        errorFilter(),
        format.timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A'
        }),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    )
});

// Create the logger with the transports
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    transports: [infoLogRotateTransport, errorLogRotateTransport],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'logs/exception.log' })
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: 'logs/rejections.log' })
    ]
});

export default logger;
