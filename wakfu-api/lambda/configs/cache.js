const AWS = require('aws-sdk');
const nodefs = require('fs');
const path = require('path');

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  S3_BUCKET_NAME,
  AWS_REGION,
  NODE_ENV
} = process.env;

const uploadPath = path.join('.','.','cache');
console.log(uploadPath);

let fs = {
  access: Key => nodefs.access(`${uploadPath}/${Key.replace(/\//, '-')}`),
  readFile: Key => nodefs.readFile(`${uploadPath}/${Key.replace(/\//, '-')}`),
  writeFileSync: (Key, payload) => nodefs.writeFileSync(`${uploadPath}/${Key.replace(/\//, '-')}`, payload)
}

if(NODE_ENV !== 'development'){
  const S3_PARAMS = {
    Bucket: S3_BUCKET_NAME
  };

  const s3 = new AWS.S3({
    signatureVersion: 'v4',
    credentials: new AWS.Credentials(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY),
    region: AWS_REGION
  });

  fs = {
    access: Key => s3.headObject({ ...S3_PARAMS, Key }).promise(),
    readFile: Key => s3.getObject({ ...S3_PARAMS, Key }).promise(),
    writeFileSync: (Key, payload) => {
      const bufferObject = new Buffer.from(payload)
      return s3.putObject({...S3_PARAMS, Key, ContentType: 'application/json', Body: bufferObject }).promise()
    }

  };
}

exports.fs = fs;
