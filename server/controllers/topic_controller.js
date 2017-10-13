//const path = require('path');
//const fs = require('fs');
//const os = require('os');
//const qiniu = require("qiniu");
const  _  = require('lodash');

const Topic = require('./../models/topic');
const User = require('./../models/user');
const Comment = require('./../models/comment');
const Message = require('./../models/message');
const TopicCollect = require('./../models/topic_collect');
//const gravatar = require('gravatar');

const findTopic = function (obj, filter, limit, skip) {
  return new Promise((resolve, reject) => {
    Topic.find(obj, filter, (err, topics) => {
      if (err) reject(err);
      resolve(topics);
    }).sort({ top: -1, good: -1, last_reply_at: -1, create_at: -1 }).skip(skip).limit(limit);
  });
};

const createTopic = (newTopic) => {
  return new Promise((resolve, reject) => {
    newTopic.save((err, result) => {
      if (err) reject(err);

      resolve(result);
    });
  });
}

const updateTopic = (_id) => {
  return new Promise((resolve, reject) => {
    Topic.update(_id, { '$inc': { 'visit_count': 1 } }, (err, tank) => {
      if (err) reject(err);

      resolve(tank);
    })
  });
}

const findUserById = (id) => {
  return new Promise((resolve, reject) => {
    User.findById(id, (err, user) => {
      if (err) reject(err);

      resolve(user);
    });
  });
}

const getCount = query => {
  return new Promise((resolve, reject) => {
    Topic.count(query, (err, count) => {
      if(err) reject(err);

      resolve(count);
    })
  })
}

const fintCollection = query => {
  return new Promise((resolve, reject) => {
    TopicCollect.find(query, (err, collection) => {
      if (err) reject(err);

      resolve(collection);
    })
  })
}

const getCommentByTopic = id => {
  return new Promise((resolve, reject) => {
    Comment.find(id, (err, replies) => {
      if (err) reject(err);

      resolve(replies);
    }).sort({ 'create_at': 1 });
  })
}

const collectTopic = query => {
  return new Promise((resolve, reject) => {
    const newCollect = new TopicCollect(query);
    newCollect.save((err, collection) => {
      if (err) reject(err);

      resolve(collection);
    })
  })
}

const cancelTopic = query => {
  return new Promise((resolve, reject) => {
    TopicCollect.remove(query, (err, coll) => {
      if (err) reject(err);

      resolve(coll);
    })
  })
}

const deleteTopic = (query) => {
  return new Promise((resolve, reject) => {
    Topic.remove(query, (err, result) => {
      if (err) reject(err);

      resolve(result);
    })
  });
};

const removeReply = (query) => {
  return new Promise((resolve, reject) => {
    Comment.remove(query, (err, result) => {
      if (err) reject(err);

      resolve(result);
    })
  });
}

const removeMessage = (query) => {
  return new Promise((resolve, reject) => {
    Message.remove(query, (err, result) => {
      if (err) reject(err);

      resolve(result);
    })
  });
}

const findTopicById = (topic_id) => {
  return new Promise((resolve, reject) => {
    Topic.findById(topic_id, (err, result) => {
      if (err) reject(err);

      resolve(result);
    })
  });
}

const userCtrl = {
  async getTopics(ctx) {
    const { page, limit, tab } = ctx.query;
    let query = {};
    if (tab === 'all') {
      query = {
        "tab": {
          "$nin": "job"
        },
      }
    } else if (tab === 'job' || tab === 'ask' || tab === 'share') {
      query = {
        "tab": `${tab}`,
      }
    } else {
      query = {
        "good": "true",
      } 
    }
    try {
      const data = await findTopic(query, {}, +limit, (page - 1) * limit);
      const count = await getCount(query);
      ctx.status = 200;
      ctx.body = {
        list: data,
        count,
      };
    } catch (e) {
      ctx.status = 500;
      ctx.body = e.message;
    }
  },

  async create(ctx) {
    const {
      id
    } = ctx.api_user;
    const req = ctx.request.body;
    try {
      const auth = await findUserById(id);
      if (auth.id) {
        ctx.status = 200;
        const newTopic = new Topic({
          author_id: auth._id,
          tab: req.tab,
          content: req.content,
          title: req.title,
          author: {
            loginname: auth.loginname,
            avatar_url: auth.avatar_url,
          },
          create_at: new Date(),
          last_reply_at: new Date(),
        });
        const createResult = await createTopic(newTopic);
        ctx.body = {
          message: '创建成功',
          topic: _.pick(createResult, ['id'])
        }
      } else {
        ctx.status = 200;
        ctx.body = {
          succ: false,
          message: '用户不存在'
        };
      }
    } catch (e) {
      ctx.status = 500;
      ctx.body = e.message;
    }
  },

  async getTopicDetail(ctx) {
    const { id } = ctx.params;
    try {
      let collections;
      if (ctx.api_user) {
        const author_id = ctx.api_user.id;
        collections = await fintCollection({ topic_id: id, author_id });
      }
      const updateResult = await updateTopic({_id: id});
      const detail = await findTopicById(id);
      const replies = await getCommentByTopic({topic_id: id});
      if (!detail) {
        ctx.status = 200;
        ctx.body = {
          success: false,
          message: '文章已经不存在',
        };
      } else {
        ctx.status = 200;
        const topic = _.pick(detail, ['id', 'author_id', 'tab', 'content', 'title', 'last_reply_at', 'last_reply','good', 'top', 'reply_count', 'visit_count', 'create_at', 'author', 'last_reply']);
        let promises = replies.map((reply) => {
          return findUserById(reply.author_id).then(author => {
            reply =  _.pick(reply, ['id', 'author', 'author_id', 'content', 'ups', 'create_at', 'reply_id']);
            reply.reply_id = reply.reply_id || null;
      
            if (reply.ups && id && reply.ups.includes(id)) {
              reply.is_uped = true;
            } else {
              reply.is_uped = false;
            }
            reply.author = _.pick(author, ['loginname', 'avatar_url']);
            return reply;
          })
        });
        topic.replies = await Promise.all(promises);
        topic.is_collect = !!collections && !!collections.length;
        ctx.body = {
          success: true,
          topic,
        };
      }
    } catch (err) {
      ctx.status = 500;
      ctx.body = err.message;
    }
  },

  async collect(ctx) {
    const { topic_id } = ctx.request.body;
    const { id } = ctx.api_user;
    try {
      const findResult = await fintCollection({ author_id: id, topic_id });
      if (findResult.length) {
        throw new Error('你已经收藏过该主题');
      }
      const collectResult = await collectTopic({ author_id: id, create_at: new Date(), topic_id });
      if (collectResult._id) {
        ctx.status = 200;
        ctx.body = {
          message: '收藏成功',
        }
      }
    } catch (e) {
      throw new Error(e);
    }
  },

  async cancelCollect(ctx) {
    const { topic_id } = ctx.request.body;
    const { id } = ctx.api_user;
    try {
      const findResult = await fintCollection({ author_id: id, topic_id });
      if (!findResult.length) {
        throw new Error('你未收藏过该主题');
      }
      const collectResult = await cancelTopic({ _id: findResult[0]._id });
      if (collectResult) {
        ctx.status = 200;
        ctx.body = {
          message: '已取消收藏',
        }
      }
    } catch (e) {
      throw new Error(e);
    }
  },

  async getNoReply(ctx) {
    const { topic_id } = ctx.query;
    const query = {
      reply_count: 0,
      _id: {
        '$ne': topic_id
      }
    };
    try {
      const findResult = await findTopic(query, {}, 5, 0);
      const topics = findResult.map(item => _.pick(item, ['id', 'author_id', 'tab', 'title', 'last_reply_at', 'visit_count', 'create_at', 'author']))
      ctx.status = 200;
      ctx.body = topics;
    } catch (e) {
      ctx.status = 500;
      ctx.body = e.message;
    }
  },

  async removeTopic(ctx) {
    const { topic_id } = ctx.params;
    const { id } = ctx.api_user;
    try {
      const findTopic = await findTopicById(topic_id);
      if (!findTopic) {
        ctx.status = 200;
        ctx.body = {
          success: false,
          message: '文章已不存在',
        };
      } else {
        const removeResult = await deleteTopic({ _id: topic_id, author_id: id });
        const removeCommet = await removeReply({ topic_id });
        const reomveMessage = await removeMessage({ topic_author_id: topic_id });
        if (removeResult.result.n && removeCommet.result.ok && reomveMessage.result.ok) {
          ctx.status = 200;
          ctx.body = {
            success: true,
            message: '删除成功',
          };
        }
      }
    } catch (e) {
      throw new Error(e);
    }
  },

  async updateTopic(ctx) {
    const { id } = ctx.api_user;
    const req = ctx.request.body;
    try {
      const findTopic = await findTopicById(req.id);
      if (findTopic.author_id.toString() === id) {
        const createResult = await createTopic(Object.assign(findTopic, req));
        ctx.status = 200;
        ctx.body = {
          success: true,
          message: '修改成功',
        };
      } else {
        ctx.status = 200;
        ctx.body = {
          success: false,
          message: '文章不存在'
        };
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  //图片上传，暂时不做😫
  /**
  async upload(ctx) {
    qiniu.conf.ACCESS_KEY = '';
    qiniu.conf.SECRET_KEY = '';
    //要上传的空间
    bucket = '';
    
    const tmpdir = os.tmpdir();
    const { file } = ctx.request.body.files;
    const filePath = path.join(tmpdir, file.name);
    key = file.nam;
    console.log(filePath);
  }
  */
};

module.exports = userCtrl;
