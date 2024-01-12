import { NextFunction, Request, Response } from 'express'
import path from 'path'
import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR, UPLOAD_VIDEO_TEMP_DIR } from '~/constants/dir'
import httpStatus from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import mediasService from '~/services/media.services'
import fs from 'fs'

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadImage(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}

export const serveImageController = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params

  return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
    console.log(err)
    if (err) {
      res.status(err as any).json('Not Found')
    }
  })
}

export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadVideo(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}

export const uploadVideoHLSController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadVideoHLS(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}

export const serveVideoStreamController = async (req: Request, res: Response, next: NextFunction) => {
  const mime = (await import('mime')).default
  const range = req.headers.range
  if (!range) {
    return res.status(httpStatus.FORBIDDEN).send('require range header')
  }
  const { name } = req.params
  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name)
  // 1MB = 10^6 bytes ( tính theo hệ thập phân, đây là thứ mà chúng ta thấy trên UI )
  // nếu tính theo hệ nhị phân thì 1MB = 2^20 bytes (1024 * 1024)

  //Dung lượng video : (bytes)
  const videoSize = fs.statSync(videoPath).size
  // Dung lượng video cho mỗi phân đoạn stream
  const chunkSize = 30 * 10 ** 6 // 30mb
  // lấy giá trị byte bắt đầu từ header range (vd: bytes = 1048576-)
  const start = Number(range.replace(/\D/g, ''))
  // lấy giá trị bytes kết thúc, vượt quá dung lượng video thì lấy giá trị videoSize:
  const end = Math.min(start + chunkSize, videoSize - 1)

  //dung lượng thực tế cho mỗi đoạn video stream.
  // thường đây sẽ là chunkSize, ngoại trừ đoạn cuối cùng.
  const contentLength = end - start + 1
  const contentType = mime.getType(videoPath) || 'video/*' // video/* nghĩa là mình không biết định dạng của video này

  /**
   * Format của header Content-Range: bytes <start>-<end>/<videoSize>
   * Ví dụ: Content-Range: bytes 1048576-3145727/3145728
   * Yêu cầu là `end` phải luôn luôn nhỏ hơn `videoSize`
   * ❌ 'Content-Range': 'bytes 0-100/100'
   * ✅ 'Content-Range': 'bytes 0-99/100'
   *
   * Còn Content-Length sẽ là end - start + 1. Đại diện cho khoản cách.
   * Để dễ hình dung, mọi người tưởng tượng từ số 0 đến số 10 thì ta có 11 số.
   * byte cũng tương tự, nếu start = 0, end = 10 thì ta có 11 byte.
   * Công thức là end - start + 1
   *
   * ChunkSize = 50
   * videoSize = 100
   * |0----------------50|51----------------99|100 (end)
   * stream 1: start = 0, end = 50, contentLength = 51
   * stream 2: start = 51, end = 99, contentLength = 49
   */

  // dont ask to much about this shit. google it
  const headers = {
    'Content-Range': `bytes ${start} - ${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(httpStatus.PARTIAL_CONTENT, headers)
  const videoStream = fs.createReadStream(videoPath, { start, end })
  videoStream.pipe(res)
}

export const serveM3u8Controller = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  return res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, id, 'master.m3u8'), (err) => {
    if (err) {
      return res.status((err as any).status).send('not found')
    }
  })
}

export const serveSegmentController = async (req: Request, res: Response, next: NextFunction) => {
  const { id, v, segment } = req.params
  //segment : 0.ts, 1.ts, 2.ts, ...
  return res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, id, v, segment), (err) => {
    if (err) {
      return res.status((err as any).status).send('not found')
    }
  })
}
