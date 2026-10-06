import assert from 'node:assert/strict'
import test from 'node:test'
import { generateKeyPairSync } from 'node:crypto'
import { getPort, getFirebaseConfig, validateEnvironment } from '../config/env.js'

test('Puerto por defecto y límites válidos', () => {
  assert.equal(getPort({}), 3000)
  for (const port of ['1', '3000', '65535']) assert.equal(getPort({ PORT: port }), Number(port))
})

test('Rechaza puertos vacíos, decimales, negativos y fuera de rango', () => {
  for (const port of ['', 'abc', '0', '-1', '3000.5', '65536', '3e3']) {
    assert.throws(() => getPort({ PORT: port }), /PORT/)
  }
})

test('Sin Firebase se permite arrancar; una configuración parcial se rechaza', () => {
  assert.deepEqual(validateEnvironment({}), { port: 3000, firebase: null })
  assert.throws(() => getFirebaseConfig({}), /FIREBASE_PROJECT_ID/)
  assert.throws(() => validateEnvironment({ FIREBASE_PROJECT_ID: 'proyecto' }), /FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY/)
})

test('Valida el correo y rechaza claves inválidas sin mostrar su contenido', () => {
  const env = { FIREBASE_PROJECT_ID: 'proyecto', FIREBASE_CLIENT_EMAIL: 'incorrecto', FIREBASE_PRIVATE_KEY: 'secreto' }
  assert.throws(() => getFirebaseConfig(env), /FIREBASE_CLIENT_EMAIL/)
  env.FIREBASE_CLIENT_EMAIL = 'cuenta@proyecto.iam.gserviceaccount.com'
  assert.throws(() => getFirebaseConfig(env), (error) => error.message.includes('FIREBASE_PRIVATE_KEY') && !error.message.includes('secreto'))
})

test('Acepta una clave RSA y normaliza saltos de línea escapados', () => {
  const { privateKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    publicKeyEncoding: { type: 'spki', format: 'pem' },
  })
  const config = getFirebaseConfig({
    FIREBASE_PROJECT_ID: 'proyecto',
    FIREBASE_CLIENT_EMAIL: 'cuenta@proyecto.iam.gserviceaccount.com',
    FIREBASE_PRIVATE_KEY: privateKey.replace(/\n/g, '\\n'),
  })
  assert.equal(config.privateKey, privateKey.trim())
})
