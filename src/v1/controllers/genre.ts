import { Request, Response } from "express";
import prismaClient from "../utils/prisma";
import { CreateGenreSchema, UpdateGenreSchema } from "../schema/genre";
import { User } from "@prisma/client";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { BadRequestException } from "../exceptions/bad-requests";

export const create = async (req: Request, res: Response) => {
  // validate the incoming data
  const validatedData = CreateGenreSchema.parse(req.body);

  // check if the same genre already exists
  let genre = await prismaClient.genre.findFirst({
    where: { name: validatedData.name },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  if (genre) {
    throw new BadRequestException(
      "Genre already exists",
      ErrorCode.GENRE_ALREADY_EXISTS
    );
  }

  // create the genre
  genre = await prismaClient.genre.create({
    data: validatedData,
  });

  // send response
  res.json({ genre });
};

export const update = async (req: Request, res: Response) => {
  // validate the incoming data
  const validatedData = UpdateGenreSchema.parse(req.body);

  // check if the genre exists
  let genre = await prismaClient.genre.findFirst({
    where: { id: req.params.id },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  if (!genre) {
    throw new NotFoundException("Genre not found", ErrorCode.GENRE_NOT_FOUND);
  }

  // check if the same genre already exists
  let existingGenre = await prismaClient.genre.findFirst({
    where: { name: validatedData.name, NOT: { id: req.params.id } },
  });

  if (existingGenre) {
    throw new BadRequestException(
      "Genre already exists",
      ErrorCode.GENRE_ALREADY_EXISTS
    );
  }

  // update the genre
  genre = await prismaClient.genre.update({
    where: { id: req.params.id },
    data: validatedData,
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  // send response
  res.json({ genre });
};

export const list = async (req: Request, res: Response) => {
  let where = {};
  let limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  let skip = req.query.skip ? parseInt(req.query.skip as string) : 0;

  // get total users count and users
  const count = await prismaClient.genre.count({ where });
  const genres = await prismaClient.genre.findMany({
    where,
    take: limit,
    skip,
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  // send response
  res.json({ genres, count });
};

export const get = async (req: Request, res: Response) => {
  const genre = await prismaClient.genre.findFirst({
    where: { id: req.params.id },
    select: {
      id: true,
      name: true,
      createdAt: true,
    },
  });

  if (!genre) {
    throw new NotFoundException("Genre not found", ErrorCode.GENRE_NOT_FOUND);
  }

  res.json({ genre });
};

export const remove = async (req: Request, res: Response) => {
  const genre = await prismaClient.genre.findFirst({
    where: { id: req.params.id },
  });

  if (!genre) {
    throw new NotFoundException("Genre not found", ErrorCode.GENRE_NOT_FOUND);
  }

  await prismaClient.genre.delete({ where: { id: req.params.id } });

  res.json({ success: true });
};
