import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  production: true,
  baseUrl: 'http://ec2-18-216-47-132.us-east-2.compute.amazonaws.com:8081/api/v1',
  logLevel: NgxLoggerLevel.OFF,
  serverLogLevel: NgxLoggerLevel.ERROR
};
