import fs from 'fs'
import crypto from 'crypto'
import { pipeline, Transform } from 'stream'

const encrypt = (message) => {
  // Generate a secret key for encryption and decryption.
  const secretKey = crypto.randomBytes(32)

  // Generate an initialization vector
  const iv = crypto.randomBytes(16)

  // create cipher object
  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv)

  // encrypt the data
  let encryptedText = cipher.update(message, 'utf-8', 'hex')

  // finalize the encryption
  return encryptedText += cipher.final('hex')
}

const readStream = fs.createReadStream('./lorem.txt')
const writeStream = fs.createWriteStream('./encrypted-data.txt')

const encryptTransform = new Transform({
  transform(chunk, encoding, callback) {
    console.log('Encrypting chunk ...')
    let encryptedChunk = encrypt(chunk)
    callback(null, encryptedChunk)
  },
})

pipeline(readStream, encryptTransform, writeStream, (err) => {
  if (err) {
    console.error(err)
  } else {
    console.log('Encryption successful!')
  }
})