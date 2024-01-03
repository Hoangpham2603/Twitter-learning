import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { getNameFromFullName, handleUploadSingleImage, handleUploadVideo } from '~/utils/file'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import { config } from 'dotenv'
import { MediaTypes } from '~/constants/enums'
import { Media } from '~/models/Other'
config()

class MediaService {
  async uploadImage(req: Request) {
    const files = await handleUploadSingleImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)

        const newPath = path.resolve(UPLOAD_IMAGE_DIR, `${newName}.jpg`)
        await sharp(file.filepath).jpeg().toFile(newPath)
        fs.unlinkSync(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/static/${newName}.jpg`
            : `http://localhost:${process.env.PORT}/static/${newName}.jpg`,
          type: MediaTypes.Image
        }
      })
    )
    return result
  }

  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = files.map((file) => {
      return {
        url: isProduction
          ? `${process.env.HOST}/static/${file.newFilename}`
          : `http://localhost:${process.env.PORT}/static/${file.newFilename}.jpg`,
        type: MediaTypes.Video
      }
    })
    return result
  }
}

const mediasService = new MediaService()

export default mediasService
