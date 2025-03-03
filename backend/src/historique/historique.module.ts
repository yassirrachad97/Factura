import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistoriqueService } from './historique.service';
import { HistoriqueController } from './historique.controller';
import { Historique, HistoriqueSchema } from './schema/historique.schema'; 

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Historique.name, schema: HistoriqueSchema }]), 
  ],
  providers: [HistoriqueService],
  controllers: [HistoriqueController],
})
export class HistoriqueModule {}
