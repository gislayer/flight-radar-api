// src/minio/minio.service.ts
import { Injectable } from '@nestjs/common';
import * as Minio from 'minio';
import * as dotenv from 'dotenv';
import * as streamToPromise from 'stream-to-promise';

dotenv.config();

@Injectable()
export class MinioService {
  private minioClient: Minio.Client;

  constructor() {
    this.minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: parseInt(process.env.MINIO_PORT || '9000', 10),
      useSSL: process.env.MINIO_USESSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });
  }

  async createBucket(bucketName: string): Promise<void> {
    try {
      const bucketExists = await this.minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(bucketName, 'us-east-1');
        console.log(`Bucket ${bucketName} created successfully.`);
      } else {
        console.log(`Bucket ${bucketName} already exists.`);
      }
    } catch (err) {
      console.error('Error creating bucket:', err);
      throw err;
    }
  }

  async uploadFile(file: Express.Multer.File, bucketName: string): Promise<any> {
    try {
      const etag = await this.minioClient.putObject(bucketName, file.originalname, file.buffer);
      console.log(`File ${file.originalname} uploaded successfully with etag ${etag.etag}.`);
      return etag.etag;
    } catch (err) {
      console.error('Error uploading file:', err);
      throw err;
    }
  }

  async getAFile(fileName: string, bucketName: string): Promise<Buffer> {
    try {
      const dataStream = await this.minioClient.getObject(bucketName, fileName);
      const buffer = await streamToPromise(dataStream);
      return buffer;
    } catch (err) {
      console.error('Error getting file:', err);
      throw err;
    }
  }

  async removeAFile(fileName: string, bucketName: string): Promise<boolean> {
    try {
      await this.minioClient.removeObject(bucketName, fileName);
      console.log(`File ${fileName} removed successfully.`);
      return true;
    } catch (err) {
      console.error('Error removing file:', err);
      return false;
    }
  }
}
