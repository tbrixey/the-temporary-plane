import { Request, Response } from "express";

// This provies class info when requested

export const getClass = (req: Request, res: Response) => {
  if (!req.body.class) {
    res.status(400).json({ message: "Missing class" });
  }

  res.status(200).json({ ...req.body });
};
