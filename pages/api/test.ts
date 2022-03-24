import { NextApiRequest, NextApiResponse } from "next";
import AppError from "../../src/errors/AppError";
import { verify } from "jsonwebtoken";
import authConfig from "../../src/config/auth";

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

// TODO segregate this into separated files
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    const { message, statusCode } = new AppError("JWT Token is missing");
    res.status(statusCode).json({ message });
    return;
  }

  const [, token] = authHeader.split(" ");

  try {
    const decodedToken = verify(token, authConfig.jwt.secret);

    const { sub } = decodedToken;

    res.status(200).json({
      user: sub,
    });
  } catch (err) {
    res.status(400).json({ message: err });
  }
}
