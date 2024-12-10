import { DataSource, DataSourceOptions } from 'typeorm';
import { config as envConfig } from 'dotenv';
import { registerAs } from '@nestjs/config';

envConfig({ path: '.env' });

const dbConfig = {
  type: 'postgres',
  database: process.env.DB,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT as unknown as number,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  synchronize: true,
  autoLoadEntities: true,
  entities: ['/dist/**/*.entity.{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  logging: true,
};

export default registerAs('typeorm', () => dbConfig);

export const connection = new DataSource(dbConfig as DataSourceOptions);
