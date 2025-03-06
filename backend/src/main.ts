import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CategorySeedService } from './seed/category.seed';
import { FournisseurSeedService } from './seed/fournisseur.seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const seedService = app.get(CategorySeedService);
  await seedService.seed();

  const fournisseurSeedService = app.get(FournisseurSeedService);
  await fournisseurSeedService.seed();
  app.setGlobalPrefix('api');

  app.enableCors({
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
  });

  await app.listen(3000);
}
bootstrap();
