import { Request, Response } from 'express'
import { File } from 'formidable'
import fs from 'fs'
import path from 'path'
import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'

// check to see if we have image/video folder. if not init one.
export const initFolder = () => {
  ;[UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true // mục đích để tạo folder nested
      })
    }
  })
}

export const handleUploadSingleImage = async (req: Request) => {
  const formidable = (await import('formidable')).default
  //formidable lib
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 4,
    keepExtensions: true,
    maxFieldsSize: 300 * 1024, //300KB
    maxTotalFileSize: 300 * 1024 * 4,
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'image' && Boolean(mimetype?.includes('image/'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        throw reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.image)) {
        return reject(new Error('File is Empty'))
      }
      resolve(files.image as File[])
    })
  })
}

export const getNameFromFullName = (fullname: string) => {
  const namearr = fullname.split('.')
  namearr.pop()
  return namearr.join('')
}

export const getExtension = (fullname: string) => {
  const namearr = fullname.split('.')
  return namearr[namearr.length - 1]
}

// cách 1: tạo unique id cho video ngay từ đầu.
// cách 2: đợi video upload xong rồi tạo folder, move video vào

// cách xử lý khi upload video và encode
// có 2 giai đoạn:
//Upload Video: Upload video thành công thì result về cho người dùng.
//Encode video: khai báo thêm 1 url endpoint để check xem cái video đó đa encode xong chưa.
export const handleUploadVideo = async (req: Request) => {
  const formidable = (await import('formidable')).default

  const nanoId = (await import('nanoid')).nanoid
  const idName = nanoId()
  const folderPath = path.resolve(UPLOAD_VIDEO_DIR, idName)
  fs.mkdirSync(path.resolve(UPLOAD_VIDEO_DIR, idName))
  const form = formidable({
    uploadDir: folderPath,
    maxFiles: 1,
    maxFieldsSize: 50 * 1024 * 1024, // 50mb
    filter: function ({ name, originalFilename, mimetype }) {
      const valid = name === 'video' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'))
      if (!valid) {
        form.emit('error' as any, new Error('File type is not valid') as any)
      }
      return valid
    },
    filename: function () {
      return idName
    }
  })
  return new Promise<File[]>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        throw reject(err)
      }
      // eslint-disable-next-line no-extra-boolean-cast
      if (!Boolean(files.video)) {
        return reject(new Error('File is Empty'))
      }
      const videos = files.video as File[]
      videos.forEach((video) => {
        //keeping the extention for videos file. in this case mp4
        const ext = getExtension(video.originalFilename as string)
        fs.renameSync(video.filepath, video.filepath + '.' + ext)
        video.newFilename = video.newFilename + '.' + ext
        video.filepath = video.filepath + '' + ext
      })

      resolve(files.video as File[])
    })
  })
}
