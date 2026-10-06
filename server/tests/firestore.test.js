import assert from 'node:assert/strict'
import test from 'node:test'
import { checkFirestoreConnection } from '../services/test.service.js'
import { getFirestoreTest } from '../controllers/test.controller.js'

test('Firestore consulta clientes con límite 1 y acepta una colección vacía', async () => {
  const database = {
    collection(name) {
      assert.equal(name, 'clientes')
      return { limit(count) {
        assert.equal(count, 1)
        return { get: async () => ({ size: 0 }) }
      } }
    },
  }
  assert.deepEqual(await checkFirestoreConnection(database), {
    ok: true, message: 'Conexión a Firestore verificada', documentsRead: 0,
  })
})

test('Firestore propaga el fallo de lectura', async () => {
  const database = { collection: () => ({ limit: () => ({
    get: async () => { throw new Error('permission denied') },
  }) }) }
  await assert.rejects(checkFirestoreConnection(database), /permission denied/)
})

test('La ruta devuelve 503 sin exponer credenciales cuando falta configuración', async () => {
  const names = ['FIREBASE_PROJECT_ID', 'FIREBASE_CLIENT_EMAIL', 'FIREBASE_PRIVATE_KEY']
  const previous = names.map((name) => process.env[name])
  names.forEach((name) => { process.env[name] = '' })
  try {
    let status
    let body
    const response = {
      status(value) { status = value; return this },
      json(value) { body = value },
    }
    await getFirestoreTest({}, response)
    assert.equal(status, 503)
    assert.equal(body.ok, false)
    assert.equal(typeof body.message, 'string')
  } finally {
    names.forEach((name, index) => {
      if (previous[index] === undefined) delete process.env[name]
      else process.env[name] = previous[index]
    })
  }
})
