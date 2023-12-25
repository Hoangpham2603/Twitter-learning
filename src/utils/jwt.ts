import { error } from 'console'
import { config } from 'dotenv'
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import { TokenPayload } from '~/models/requests/User.request'
config()

export const signToken = ({
  payload,
  privateKey,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | object | Buffer
  privateKey: string
  options?: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) {
        throw reject(err)
      }
      resolve(token as string)
    })
  })
}

export const verifyToken = ({ token, secretKey }: { token: string; secretKey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        throw reject(error)
      }
      resolve(decoded as TokenPayload)
    })
  })
}
