import { Request, Response } from "express";
import { prismaClient } from "..";
import { ChangeAccountTypeSchema, UpdateUserSchema } from "../schema/user";
import { User } from "@prisma/client";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { BadRequestException } from "../exceptions/bad-requests";

export const update = async (req: Request, res: Response) => {
  // validate the incoming data
  const validatedData = UpdateUserSchema.parse(req.body);

  // we don't have to check if the user exists because its handled in the auth middleware
  const user = await prismaClient.user.update({
    where: { id: req.user.id },
    data: validatedData,
  });

  // send response
  res.json(user);
};

export const changeAccountType = async (req: Request, res: Response) => {
  const validatedData = ChangeAccountTypeSchema.parse(req.body);

  if (validatedData.userId == req.user.id) {
    throw new BadRequestException(
      "You cannot change your own account type",
      ErrorCode.YOU_CANT_CHANGE_YOUR_OWN_ACCOUNT_TYPE
    );
  }

  let user: User;

  try {
    // check is the user exists
    user = await prismaClient.user.findFirstOrThrow({
      where: { id: validatedData.userId },
    });

    // update the account type
    user = await prismaClient.user.update({
      where: { id: validatedData.userId },
      data: { accountType: validatedData.accountType },
    });

    // send response
    res.json(user);
  } catch (error) {
    throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND);
  }
};

export const listUsers = async (req: Request, res: Response) => {
  let where = {};

  if (req.query.accountType) {
    where = { accountType: req.query.accountType };
  }
  let limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  let skip = req.query.skip ? parseInt(req.query.skip as string) : 0;

  // get total users count and users
  const count = await prismaClient.user.count({ where });
  const users = await prismaClient.user.findMany({
    where,
    take: limit,
    skip,
  });

  // send response
  res.json({ users, count });
};
