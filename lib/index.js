// Packages
const Router = require('router')
const finalhandler = require('finalhandler')
const Cache = require('./cache')

/**
 * @typedef Config
 * @prop {string} url
 * @prop {number | string} interval
 * @prop {string} token
 * @prop {string} account
 * @prop {string} repository
 * @prop {string} pre
 *
 * @typedef {(req: import("@vercel/node").VercelRequest, res: import("@vercel/node").VercelResponse) => void} HandlerFunction
 */

/**
 * @param {Config} config
 * @returns {HandlerFunction}
 */
module.exports = config => {
  const router = Router()
  let cache = null

  try {
    cache = new Cache(config)
  } catch (err) {
    if (err instanceof Error) {
      // @ts-ignore
      const { code, message } = err

      if (code) {
        return (_, res) => {
          res.statusCode = 400

          res.end(
            JSON.stringify({
              error: {
                code,
                message
              }
            })
          )
        }
      }
    }

    throw err
  }

  const routes = require('./routes')({ cache, config })

  // Define a route for every relevant path
  router.get('/', routes.overview)
  router.get('/download', routes.download)
  router.get('/download/:platform', routes.downloadPlatform)
  router.get('/update/:platform/:version', routes.update)
  router.get('/update/win32/:version/:filename', routes.squirrelWindows)

  const handler = (req, res) => {
    router(req, res, finalhandler(req, res))
  }
  return handler
}
