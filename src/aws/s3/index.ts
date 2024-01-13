import S3 from 'aws-sdk/clients/s3';
import fs from 'fs';

import config from '../../config/config.ts';

export const { bucketName, region, accessKeyId, secretAccessKey } =
  config.aws.s3;

export const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

//upload a file to s3
export const uploadToS3 = (file: any) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams: any = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };

  return s3.upload(uploadParams).promise();
};
