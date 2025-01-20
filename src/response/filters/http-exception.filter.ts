import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status: number;
    let message: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse();
    } else if (exception instanceof QueryFailedError) {
      // SQL hataları için özel durum
      status = HttpStatus.BAD_REQUEST;
      var mes = exception.message;
      if(mes.indexOf('duplicate key')!==-1){
        mes = 'Ayni kayit mevcuttur.'
      }else if(mes.indexOf('violates foreign key constraint')!==-1){
        mes = 'Gonderdiginiz bilgi verilerle uyusmamaktadir.'
      }
      message = {
        message: 'A database error occurred',
        error: mes,
      };
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception;
    }

    response.status(status).json({
      message: message['message'] || null,
      error: message['error'] || exception,
      data: null,
      statusCode: status,
    });
  }
}
