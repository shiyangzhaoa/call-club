const jwt = require('jsonwebtoken');

const getVerify = function (token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, 'app.get(user)', function (err, decoded) {
      if (err) {
        reject(00);
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
      if (e === 00) {
        await next();
      } else {
        ctx.status = 500;
        ctx.body = {
          success: false,
          message: e.message,
        }
      }
    }
  } else {
    await next();
  }
}

module.exports = resolveToken;