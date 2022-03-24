import type { NextApiRequest, NextApiResponse } from "next";
import RouteNotFoundError from "../../../src/errors/RouteNotFoundError";
import { sign } from "jsonwebtoken";
import authConfig from "../../../src/config/auth";

type IData = {
  user: {
    id: string;
    name: string;
  };
  token: string;
};

// TODO segregate this into separated files
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { message, statusCode } = new RouteNotFoundError();

    res.status(statusCode).json({ message });
    return;
  }

  const { username, password } = req.body;

  if (username === "admin" && password === "admin") {
    const token = sign({}, authConfig.jwt.secret, {
      subject: username,
      expiresIn: authConfig.jwt.expiresIn,
    });

    const data: IData = {
      user: {
        id: "432436546452",
        name: username,
      },
      token: token,
    };

    res.status(200).json(data);
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
}
