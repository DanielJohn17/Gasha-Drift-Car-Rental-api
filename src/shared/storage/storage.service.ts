import { CreateBucketCommand, HeadBucketCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { UploadedObject } from './models/uploaded-object.interface';

const maxImageBytes: number = 5 * 1024 * 1024;

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly bucketName: string;
  private readonly publicBaseUrl: string;
  private readonly s3Client: S3Client;

  public constructor(private readonly configService: ConfigService) {
    const endpoint: string = this.configService.getOrThrow<string>('MINIO_ENDPOINT');
    const port: string = this.configService.get<string>('MINIO_PORT', '9000');
    const useSsl: boolean = this.configService.get<string>('MINIO_USE_SSL', 'false') === 'true';
    this.bucketName = this.configService.getOrThrow<string>('MINIO_BUCKET');
    const protocol: string = useSsl ? 'https' : 'http';
    const fullEndpoint: string = `${protocol}://${endpoint}:${port}`;
    const accessKeyId: string = this.configService.getOrThrow<string>('MINIO_ACCESS_KEY');
    const secretAccessKey: string = this.configService.getOrThrow<string>('MINIO_SECRET_KEY');
    this.publicBaseUrl = this.configService.get<string>('MINIO_PUBLIC_BASE_URL', fullEndpoint);
    this.s3Client = new S3Client({
      region: 'us-east-1',
      endpoint: fullEndpoint,
      credentials: { accessKeyId, secretAccessKey },
      forcePathStyle: true,
    });
  }

  public async onModuleInit(): Promise<void> {
    await this.ensureBucketExists();
  }

  public async uploadBase64Image(base64DataUrl: string, keyPrefix: string): Promise<UploadedObject> {
    const { buffer, contentType } = this.parseBase64DataUrl(base64DataUrl);
    const fileExtension: string = this.getFileExtension(contentType);
    const key: string = `${keyPrefix}/${randomUUID()}.${fileExtension}`;
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    );
    const url: string = `${this.publicBaseUrl.replace(/\/$/, '')}/${this.bucketName}/${key}`;
    return { key, url };
  }

  private async ensureBucketExists(): Promise<void> {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: this.bucketName }));
    } catch {
      await this.s3Client.send(new CreateBucketCommand({ Bucket: this.bucketName }));
    }
  }

  private parseBase64DataUrl(base64DataUrl: string): { readonly buffer: Buffer; readonly contentType: string } {
    const match: RegExpMatchArray | null = base64DataUrl.match(/^data:(image\/[^;]+);base64,(.+)$/);
    if (!match) {
      throw new BadRequestException('Invalid image format. Expected data:image/*;base64,...');
    }
    const contentType: string = match[1];
    const payload: string = match[2];
    const buffer: Buffer = Buffer.from(payload, 'base64');
    if (buffer.length === 0) {
      throw new BadRequestException('Invalid image payload.');
    }
    if (buffer.length > maxImageBytes) {
      throw new BadRequestException('Image payload is too large.');
    }
    return { buffer, contentType };
  }

  private getFileExtension(contentType: string): string {
    const subtype: string = contentType.split('/')[1] ?? 'png';
    if (subtype === 'jpeg') {
      return 'jpg';
    }
    return subtype;
  }
}
