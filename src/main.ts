import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ResponseInterceptor } from './response/interceptors/response.interceptor';
import { RequestInterceptor } from './response/interceptors/request.interceptor';
import { HttpExceptionFilter } from './response/filters/http-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WsAdapter } from '@nestjs/platform-ws'; 
import { join } from 'path';
import { fork } from 'child_process';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.enableCors({
    //origin: configService.get('CORS_ORIGIN'),
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor(), new RequestInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix('api');

  app.useStaticAssets(join(__dirname, '..', 'public'));
  //app.useWebSocketAdapter(new WsAdapter());
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  const swaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
    customJs: [
      '/swagger-custom.js',
    ],
  };
  SwaggerModule.setup('swagger', app, document, swaggerCustomOptions);

  const tileserverPath = join(__dirname, '..', 'tileserver', 'index.js');
  const tileserver = fork(tileserverPath);

  tileserver.on('error', (err) => {
    console.error('Tileserver başlatılırken hata oluştu:', err);
  });

  tileserver.on('exit', (code) => {
    console.log('Tileserver kapandı, çıkış kodu:', code);
  });

  await app.listen(2003);
}
bootstrap();
