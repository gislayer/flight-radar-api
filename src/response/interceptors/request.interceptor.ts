import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap } from 'rxjs/operators';
  
  @Injectable()
  export class RequestInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const request = context.switchToHttp().getRequest();
      const token = request.headers['authorization'];
      var language = request.headers['accept-language'];
      if(!language){
        language='en';
      }
      request.token = token;
      request.language = language;
  
      return next.handle().pipe(
        tap(() => {
          // Yanıt tamamlandığında yapılacak işlemler
        }),
      );
    }
  }
  