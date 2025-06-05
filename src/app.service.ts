import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppService {
  constructor(
    @InjectConnection() private readonly connection: Connection,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getCollection(): Promise<any>{
    try {
      const collections = await this.connection.collections;
      const dataCollections = {}

      for await (const i of Object.keys(collections)){
        const collection = collections[i];
        const indexes = await collection.getIndexes()
      
        const {name, collectionName} = collection;
        dataCollections[i] = {key: i, name, indexes, collectionName};

      }
      return dataCollections
    } catch (error) {
      console.error('Erro getting collection');
      console.error({error});
      throw error;
    }
  }

  async removeIndexFromCollection({keyCollection, indexName} : {keyCollection: string, indexName: string}) : Promise<any> {
    try {
      const collection = await this.connection.collections[keyCollection];
      const removeIndex = collection.dropIndex(indexName);
      return removeIndex;
    } catch (error) {
      console.error('Error removing collection');
      console.error({error});
      throw error;
    }
  }
}
