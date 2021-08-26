import fs from "fs";
import path from "path";
import mime from "mime";
import aws, { S3 } from "aws-sdk";
import IStorageProvider from "../models/IStorageProvider";
import uploadConfig from "@config/upload";
import AppError from "@shared/errors/AppError";

class S3StorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: uploadConfig.config.aws.region,
    });
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file);

    const ContentType = mime.getType(originalPath);

    if (!ContentType) throw new AppError("Arquivo não encontrado", 400);

    const fileContent = await fs.promises.readFile(originalPath);

    try {
      await this.client
        .putObject({
          Bucket: uploadConfig.config.aws.bucket,
          Key: file,
          ACL: "public-read",
          Body: fileContent,
          ContentType,
        })
        .promise();

      await fs.promises.unlink(originalPath);

      return file;
    } catch (e) {
      throw new AppError("Erro ao salvar arquivo");
    }
  }

  public async deleteFile(file: string): Promise<void> {
    try {
      await this.client
        .deleteObject({
          Bucket: uploadConfig.config.aws.bucket,
          Key: file,
        })
        .promise();
    } catch (e) {
      throw new AppError("Erro ao deletar arquivo");
    }
  }
}

export default S3StorageProvider;
