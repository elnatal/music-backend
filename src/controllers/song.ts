import { Request, Response } from "express";
import { cloudinary, prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { CreateSongSchema, UpdateSongSchema } from "../schema/song";
import { UnprocessableEntityException } from "../exceptions/validation";
import fs from "fs";
import { UnauthorizedException } from "../exceptions/unauthorized";

export const create = async (req: Request, res: Response) => {
  // validate the incoming data
  const validatedData = CreateSongSchema.parse(req.body);

  // create the song
  let song = await prismaClient.song.create({
    data: {
      title: validatedData.title,
      fileUrl: validatedData.fileUrl,
      artistId: req.user.id,
      genres: {
        create: validatedData.genres.map((genreId) => {
          return {
            genre: {
              connect: {
                id: genreId,
              },
            },
          };
        }),
      },
    },
  });

  // send response
  res.json(song);
};

export const get = async (req: Request, res: Response) => {
  const song = await prismaClient.song.findFirst({
    where: { id: req.params.id },
  });

  if (!song) {
    throw new NotFoundException("Song not found", ErrorCode.SONG_NOT_FOUND);
  }

  res.json(song);
};

export const update = async (req: Request, res: Response) => {
  // validate the incoming data
  const validatedData = UpdateSongSchema.parse(req.body);

  // check if the song exists
  let song = await prismaClient.song.findFirst({
    where: { id: req.params.id },
    include: {
      genres: {
        select: {
          genre: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  if (!song) {
    throw new NotFoundException("Song not found", ErrorCode.SONG_NOT_FOUND);
  }

  // check if the user is the owner of the song
  if (song.artistId !== req.user.id) {
    throw new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED);
  }

  // update genre if present
  if (validatedData.genres) {
    let existingGenres = song.genres.map((songGenre) => songGenre.genre.id);

    // delete genres that are not in the new list
    await prismaClient.songGenre.deleteMany({
      where: {
        songId: req.params.id,
        NOT: { genreId: { in: validatedData.genres } },
      },
    });

    // attach new genres
    await prismaClient.songGenre.createMany({
      data: validatedData.genres
        .filter((genreId) => !existingGenres.includes(genreId))
        .map((genreId) => {
          return {
            songId: req.params.id,
            genreId,
          };
        }),
    });
  }

  // update song
  song = await prismaClient.song.update({
    where: { id: req.params.id },
    data: {
      title: validatedData.title,
      fileUrl: validatedData.fileUrl,
    },
    include: {
      genres: {
        select: {
          genre: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  // send response
  res.json(song);
};

export const list = async (req: Request, res: Response) => {
  let where = {};
  let limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  let skip = req.query.skip ? parseInt(req.query.skip as string) : 0;

  // get total songs count and songs
  let count = await prismaClient.song.count({ where });
  let songs = await prismaClient.song.findMany({
    where,
    take: limit,
    skip,
    include: {
      genres: {
        select: {
          genre: {
            select: { id: true, name: true },
          },
        },
      },
      artist: {
        select: { id: true, name: true },
      },
    },
  });

  // return songs
  res.json({ songs, count });
};

export const remove = async (req: Request, res: Response) => {
  const song = await prismaClient.song.findFirst({
    where: { id: req.params.id },
  });

  if (!song) {
    throw new NotFoundException("Song not found", ErrorCode.SONG_NOT_FOUND);
  }

  // check if the user is the owner of the song
  if (song.artistId !== req.user.id) {
    throw new UnauthorizedException("Unauthorized", ErrorCode.UNAUTHORIZED);
  }

  await prismaClient.song.delete({ where: { id: req.params.id } });

  res.json({ success: true });
};

export const upload = async (req: Request, res: Response) => {
  if (!req.file) {
    throw new UnprocessableEntityException(
      "File is required",
      ErrorCode.FILE_REQUIRED,
      { file: "File is required" }
    );
  }

  const file = req.file;

  // only allow audio files
  if (!file.mimetype.includes("audio")) {
    // delete the file from the server
    fs.unlinkSync(file.path);
    throw new UnprocessableEntityException(
      "Invalid file type",
      ErrorCode.INVALID_FILE_TYPE,
      { file: "Invalid file type" }
    );
  }

  const fileName = file.originalname.split(".")[0];
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "raw",
      public_id: `songs/${new Date().getTime()} - ${fileName}`,
    });

    res.json({ fileUrl: result.secure_url });
  } catch (error) {
    throw new UnprocessableEntityException(
      "Error uploading file",
      ErrorCode.ERROR_UPLOADING_FILE,
      error
    );
  } finally {
    // delete the file from the server
    fs.unlinkSync(file.path);
  }
};
