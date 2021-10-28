import { Request, Response } from "express";

const genKey = () => {
  return [...Array(10)]
    .map((e) => (Math.random() * 36 || 0).toString(36))
    .join("")
    .replace(/\./g, "");
};

export const registerKey = (req: Request, res: Response) => {
  if (req.body.username === undefined) {
    res.status(500).send({ message: "Missing username" });
  }
  const username = req.body.username;

  const apiKey = genKey();

  res.send({ username, apiKey });
};
