/* global describe, it, afterEach */
const http = require('http')
const { serve } = require('micro')
const listen = require('test-listen')

const initialEnv = Object.assign({}, process.env)

afterEach(() => {
  process.env = initialEnv
})

describe('Server', () => {
  it('Should start without errors', async () => {
    process.env = {
      ACCOUNT: 'zeit',
      REPOSITORY: 'hyper'
    }

    const run = require('../lib/server')
    const server = new http.Server(serve(run))

    await listen(server)
    server.close()
  })
})
