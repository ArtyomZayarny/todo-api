import S3 from 'aws-sdk/clients/s3';
import fs from 'fs';
import { injectable } from 'inversify';

import config from '../../config/config.ts';

export const { bucketName, region, accessKeyId, secretAccessKey } =
  config.aws.s3;

@injectable()
export class S3Service {
  private s3: any;
  private bucketName!: any;

  constructor() {
    this.s3 = new S3({
      region,
      accessKeyId,
      secretAccessKey,
    });
    this.bucketName = bucketName;
  }

  async uploadImage(file: any) {
    const fileStream = fs.createReadStream(file.path);

    const uploadParams: any = {
      Bucket: bucketName,
      Body: fileStream,
      Key: file.filename,
    };

    return this.s3.upload(uploadParams).promise();
  }

  async getImage(key: string, cb: any) {
    const params: any = { Bucket: this.bucketName, Key: key };
    await this.s3.getObject(params, cb);
  }
}
