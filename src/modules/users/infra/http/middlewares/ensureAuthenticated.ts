import { NextFunction, Request, Response } from "express";
import authConfig from "@config/auth";
import AppError from "@shared/errors/AppError";
import { verify } from "jsonwebtoken";

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  _: Response,
  next: NextFunction
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) throw new AppError("JWT não encontrando", 401);

  const [, token] = authHeader.split(" ");

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as ITokenPayload;

    request.user = { id: sub };

    return next();
  } catch (e) {
    throw new AppError("JWT invalido", 401);
  }
}
