const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const  _  = require('lodash');

const User = require('./../models/user');
const Topic = require('./../models/topic');
const Comment = require('./../models/comment');

const findOne = (query, filter={}) => {
  return new Promise((resolve,reject) => {
    User.find(query, filter, function(err, user) {
      if (err) reject(err);
      resolve(user);
    });
  });
};

const createOne = (body) => {
  return new Promise((resolve, reject) => {
    const newUser = new User(Object.assign(body, { avatar_url: `https:${gravatar.url(body.email)}` }));
    newUser.save(function(err, info) {
      if (err) reject(err);
    
      resolve(info);
    });
  });
};

const findTopic = (query) => {
  return new Promise((resolve, reject) => {
    Topic.find(query, (err, result) => {
      if (err) reject(err);

      resolve(result);
    }).sort({ create_at: -1 });
  });
};

const findById = user_id => {
  return new Promise((resolve, reject) => {
    User.findById(user_id, (err, result) => {
      if (err) reject(err);

      resolve(result);
    })
  });
};

const saveUser = (newUser) => {
  return new Promise((resolve, reject) => {
    newUser.save((err, result) => {
      if (err) reject(err);

      resolve(result);
    })
  });
};

const findComment = (query) => {
  return new Promise((resolve, reject) => {
    Comment.find(query, (err, result) => {
      if (err) reject(err);

      resolve(result);
    }).sort({ last_reply_at: -1, create_at: -1 });
  })
};

const userCtrl = {
  async createUser(ctx) {
    const { loginname, email } = ctx.request.body;
    try {
      const findResult = await findOne({ loginname });
      if(!findResult.length) {
        const createResult = await createOne(Object.assign(ctx.request.body, {
          creat_time: new Date(),
        }));
        ctx.status = 200;
        ctx.body = {
          user_id: createResult.id,
          succ: true,
        };
      } else {
        ctx.status = 410;
        ctx.body = {
          message: 'loginname已存在',
          succ: false,
          errCode: 101,
        };
      }
    } catch (e) {
      ctx.status = 500;
      ctx.body = e.message;
    }
  },

  async login (ctx) {
    const { loginname, password } = ctx.request.body;
    try {
      const findResult = await findOne({ loginname });
      if(findResult.length) {
        if(findResult[0].password === password) {
          ctx.status = 200;
          var token = jwt.sign({ id: findResult[0].id }, 'app.get(user)', {
            expiresIn: '8h'
          });
          ctx.body = {
            message: '登陆成功',
            token: token,
            succ: true,
          };
        } else {
          ctx.status = 400;
          ctx.body = {
            message: '密码错误',
            succ: false,
            errCode: 102,
          };
        }
      } else {
        ctx.status = 400;
        ctx.body = {
          message: '用户不存在',
          succ: false,
          errCode: 103,
        };
      }
    } catch (e) {
      ctx.status = 500;
      ctx.body = e.message;
    }
  },

  async getInfo(ctx) {
    const {
      loginname
    } = ctx.params;
    try {
      const findResult = await findOne({ loginname }, {password: 0});
      if (findResult.length) {
        const userInfo = _.pick(findResult[0], ['id', 'loginname', 'email', 'web', 'signature', 'avatar_url', 'creat_time']);
        const recent_topics = await findTopic({ author_id: userInfo.id });
        userInfo.recent_topics = recent_topics.map(item => _.pick(item, ['id', 'author', 'title', 'last_reply_at', 'reply_count', 'visit_count']));
        const replies = await findComment({ author_id: userInfo.id });
        let replyTopicIds = replies.map(item => item.topic_id.toString());
        replyTopicIds = _.uniq(replyTopicIds);
        const recent_replies = await findTopic({ _id: {'$in': replyTopicIds} });
        userInfo.recent_replies = recent_replies.map(item => _.pick(item, ['id', 'author', 'title', 'last_reply_at', 'reply_count', 'visit_count']));
        ctx.status = 200;
        ctx.body = userInfo;
      } else {
        ctx.status = 200;
        ctx.body = {
          succ: false,
          message: '用户不存在',
          errCode: 103,
        };
      }
    } catch (e) {
      ctx.status = 500;
      ctx.body = e.message;
    }
  },

  async getAuth(ctx) {
    const { id } = ctx.api_user;
    try {
      const findResult = await findOne({ _id: id }, {password: 0});
      if (findResult.length) {
        ctx.status = 200;
        ctx.body = _.pick(findResult[0], ['id', 'avatar_url', 'creat_time', 'email', 'loginname', 'signature', 'web']);
      } else {
        ctx.status = 200;
        ctx.body = {
          succ: false,
          message: '用户不存在',
          errCode: 103,
        };
      }
    } catch (e) {
      ctx.status = 500;
      ctx.body = e.message;
    }
  },

  async changeSetting(ctx) {
    const reqBody = ctx.request.body;
    const author_id = ctx.api_user.id;
    try {
      const author = await findById(author_id);
      const updateResult = await saveUser(Object.assign(author, reqBody));
      ctx.status = 200;
      ctx.body = {
        success: true,
        message: '更新成功',
      };
    } catch (e) {
      throw new Error(e);
    }
  },

  async setNewPassword(ctx) {
    const reqBody = ctx.request.body;
    const author_id = ctx.api_user.id;
    try {
      const author = await findById(author_id);
      if (author.password !== reqBody.oldpass) {
        ctx.status = 200;
        ctx.body = {
          success: false,
          message: '原始密码错误',
          errCode: 104,
        };
      } else {
        author.password = reqBody.newpass;
        const changeResult = await saveUser(author);
        ctx.body = {
          success: true,
          message: '修改密码成功',
        }
      }
    } catch (e) {
      throw new Error(e);
    }
  }
};

module.exports = userCtrl;
