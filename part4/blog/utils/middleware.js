const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  if ('password' in request.body) {
    /// filtering out the password in the logs in case there is
    let { password, ...rest } = request.body
    logger.info('Body:  ', { ...rest, password: '***' })
  } else {
    logger.info('Body:  ', request.body)
  }
  logger.info('---')
  next()
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  next()
}

module.exports = {
  requestLogger,
  tokenExtractor
}
