import { HttpError } from 'wasp/server';
import { type File } from 'wasp/entities';
import {
  type CreateFile,
  type GetDownloadFileSignedURL,
} from 'wasp/server/operations';

import {
  getUploadFileSignedURLFromS3,
  getDownloadFileSignedURLFromS3
} from './s3Utils';

type FileDescription = {
  fileType: string;
  name: string;
  recipeId: string;
};

export const createFile: CreateFile<FileDescription, File> = async ({ fileType, name, recipeId }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const userInfo = context.user.id;

  const { uploadUrl, key } = await getUploadFileSignedURLFromS3({ fileType, userInfo });

  return await context.entities.File.create({
    data: {
      name,
      key,
      uploadUrl,
      type: fileType,
      recipe: { connect: { id: recipeId } },
    },
  });
};

export const getDownloadFileSignedURL: GetDownloadFileSignedURL<{ key: string }, string> = async (
  { key },
  _context
) => {
  return await getDownloadFileSignedURLFromS3({ key });
};