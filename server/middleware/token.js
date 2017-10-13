const jwt = require('jsonwebtoken');

const getVerify = function (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, 'app.get(user)', function (err, decoded) {
      if (err) {
        reject(100);
      } else {
        resolve(decoded);
      }
    });
  })
}

const resolveToken = async function (ctx, next) {
  let token = ctx.request.body.token || ctx.request.query.token || ctx.request.header['x-access-token'];
  if (token) {
    try {
      const result = await getVerify(token);
      ctx.api_user = result;
      await next();
    } catch(e) {
      if (e === 100) {
        ctx.status = 401;
        ctx.body = {
          success: false,
          message: 'token过期',
          errCode: 100,
        }
      } else {
        ctx.status = 500;
        ctx.body = {
          success: false,
          message: e.message,
        }
      }
    }
  } else {
    ctx.status = 403;
    ctx.body = {
      success: false,
      message: '缺少token',
    }
  }
}

module.exports = resolveToken;