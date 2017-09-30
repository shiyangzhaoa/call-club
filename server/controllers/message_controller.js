const mongoose = require('mongoose');
const  _  = require('lodash');

const Message = require('./../models/message');
const Topic = require('./../models/topic');

const ObjectId = mongoose.Types.ObjectId;

const getMessageCount = (query) => {
  return new Promise((resolve, reject) => {
    Message.count(query, (err, count) => {
      if (err) reject(err);

      resolve(count);
    })
  });
};

const findMessage = (query) => {
  return new Promise((resolve, reject) => {
    Message.find(query, (err, result) => {
      if(err) reject(err);

      resolve(result);
    }).sort({ create_at: -1 });
  });
};

const findTopicById = topic_id => {
  return new Promise((resolve, reject) => {
    Topic.findById(topic_id, (err, result) => {
      if (err) reject(err);

      resolve(result);
    })
  });
};

const markOne = msg_id => {
  return new Promise((resolve, reject) => {
    Message.update({ _id: msg_id }, {
      '$set': {
        'has_read': true
      }
    }, (err, result) => {
      if (err) reject(err);

      resolve(result);
    })
  });
};

const messageCtrl = {
  async getCount(ctx) {
    const author_id = ctx.api_user.id;
    try {
      const countResult = await getMessageCount({ author_id, has_read: false });
      ctx.status = 200;
      ctx.body = {
        count: countResult
      };
    } catch (e) {
      throw new Error(e);
    }
  },

  async getMessages(ctx) {
    const author_id = ctx.api_user.id;
    const query = {
      '$or': [
        { 'reply_id': ObjectId(author_id) },
        { 'author_id': ObjectId(author_id) },
      ],
    }
    try {
      let messages = await findMessage(query);
      const promises = messages.map(item => {
        item = _.pick(item, ['id', 'type', 'has_read', 'topic_id']);
        return findTopicById(item.topic_id).then(topic => {
          item.topic = _.pick(topic, [ 'id', 'title', 'last_reply_at', 'author' ]);
          return item;
        })
      });
      messages = await Promise.all(promises);
      const has_read_messages = messages.filter(item => item.has_read);
      const has_not_read_messages = messages.filter(item => !item.has_read);
      ctx.status = 200;
      ctx.body = {
        data: {
          has_read_messages,
          has_not_read_messages,
        }
      };
    } catch (e) {
      throw new Error(e);
    }
  },

  async markOne(ctx) {
    const { msg_id } = ctx.params;
    try {
      const markResult = await markOne(msg_id);
      if (markResult.ok) {
        ctx.status = 200;
        ctx.body = {
          success: true,
          message: '已阅',
        }
      } else {
        throw new Error('更新失败');
      }
    } catch (e) {
      throw new Error(e);
    }
  },

  async markAll(ctx) {
    console.log('收到');
  }
};

module.exports = messageCtrl;