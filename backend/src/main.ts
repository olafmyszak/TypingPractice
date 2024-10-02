import { NestFactory } from '@nestjs/core';
import {
    SwaggerModule,
    DocumentBuilder,
    SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import * as crypto from 'node:crypto';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use((req: any, res: any, next: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        res.locals.cspNonce = crypto.randomBytes(32).toString('hex');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        next();
    });

    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    scriptSrc: [
                        "'self'",
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
                        (req, res: any) => `'nonce-${res.locals.cspNonce}'`,
                    ],
                    'trusted-types': 'angular',
                    'require-trusted-types-for': ["'script'"],
                },
            },
        }),
    );

    app.enableCors({
        origin: ['http://localhost:4200', 'http://[::1]:4200'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });

    const config = new DocumentBuilder()
        .setTitle('Typing Practice')
        .setDescription('API for the typing practice game')
        .setVersion('1.0')
        .build();

    const options: SwaggerDocumentOptions = {
        operationIdFactory: (controllerKey: string, methodKey: string) =>
            methodKey,
    };

    const document = SwaggerModule.createDocument(app, config, options);

    SwaggerModule.setup('api', app, document);

    app.useGlobalPipes(new ValidationPipe());

    await app.listen(3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}

void bootstrap();
