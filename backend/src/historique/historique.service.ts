import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Historique } from './schema/historique.schema';


@Injectable()
export class HistoriqueService {
  constructor(
    @InjectModel(Historique.name) private readonly historiqueModel: Model<Historique>,
  ) {}

 

  async findMyHistory(currentUser: any): Promise<Historique[]> {
    return this.historiqueModel
      .find({ user: currentUser.userId }) 
      .populate('user') 
      .populate('factures') 
      .exec();
  }


}