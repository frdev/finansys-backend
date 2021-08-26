import multer, { StorageEngine } from "multer";
import crypto from "crypto";
import path from "path";
import AppError from "@shared/errors/AppError";

const tmpFolder = path.resolve(__dirname, "..", "..", "tmp");

interface IUploadConfig {
  driver: "disk" | "s3";
  tmpFolder: string;
  uploadFolder: string;
  multer: {
    storage: StorageEngine;
  };
  config: {
    [key: string]: { bucket: string; region: string };
  };
}

export default {
  driver: process.env.STORAGE_DRIVER,
  tmpFolder,
  uploadFolder: path.resolve(tmpFolder, "uploads"),
  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(_, file, callback) {
        const fileHash = crypto.randomBytes(10).toString("hex");
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
    fileFilter: (_: any, file: any, callback: any) => {
      if (
        "image/png" === file.mimetype ||
        "image/jpg" === file.mimetype ||
        "image/jpeg" === file.mimetype
      ) {
        callback(null, true);
      } else {
        callback(null, false);
        return callback(
          new AppError(
            "Somente arquivos .png, .jpg e .jpeg são permitidos!",
            400
          )
        );
      }
    },
  },
  config: {
    aws: {
      bucket: "app-finansys",
      region: "us-east-2",
    },
  },
} as IUploadConfig;
