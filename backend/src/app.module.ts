import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FournisseursModule } from './fournisseurs/fournisseurs.module';
import { FacturesModule } from './factures/factures.module';
import { PaiementModule } from './paiement/paiement.module';
import { HistoriqueModule } from './historique/historique.module';
import { CategoryModule } from './category/category.module';
import { SeedModule } from './seed/seed.module';
import { StatisticsModule } from './statistics/statistics.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL),

    AuthModule,
    UsersModule,
    FournisseursModule,
    FacturesModule,
    PaiementModule,
    HistoriqueModule,
    CategoryModule,
    SeedModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService, ],
})
export class AppModule {}
