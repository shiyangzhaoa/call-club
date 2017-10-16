const mongoose = require('mongoose');
const  _  = require('lodash');

const Message = require('./../models/message');
const Topic = require('./../models/topic');

const ObjectId = mongoose.Types.ObjectId;

const getMessageCount = (query) => {
  return new Promise((resolve, reject) => {
    Message.find(query, (err, count) => {
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
    }).sort({ create_at: -1 }).count();
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

const markOneMessage = (query) => {
  return new Promise((resolve, reject) => {
    Message.update(query, {
      '$set': {
        'has_read': true
      }
    }, {  multi: true  }, (err, result) => {
      if (err) reject(err);

      resolve(result);
    })
  });
};

const messageCtrl = {
  async getCount(ctx) {
    const ropic_author_id = ctx.api_user.id;
    const query = {
      '$or': [
        { 'reply_id': ObjectId(ropic_author_id) },
        { 'topic_author_id': ObjectId(ropic_author_id), 'reply_id': null },
      ],
      'has_read': false,
    }
    try {
      const countResult = await findMessage(query);
      ctx.status = 200;
      ctx.body = {
        count: countResult.length
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
        { 'topic_author_id': ObjectId(author_id), 'reply_id': null  },
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
      const markResult = await markOneMessage({ _id: msg_id });
      if (markResult.ok) {
        ctx.status = 200;
        ctx.body = {
          success: true,
          message: '已阅',
        }
      } else {
        throw new Error('标记失败');
      }
    } catch (e) {
      throw new Error(e);
    }
  },

  async markAll(ctx) {
    const author_id = ctx.api_user.id;
    const query = {
      '$or': [
        { 'reply_id': ObjectId(author_id) },
        { 'topic_author_id': ObjectId(author_id) },
      ],
    }
    try {
      const messages = await findMessage(query);
      const msg_ids = messages.map(item => {
        return item._id;
      })
      const updateQuery = {
        '_id': {
          '$in': msg_ids
        }
      }
      const result = await markOneMessage(updateQuery);
      if (result.ok) {
        ctx.status = 200;
        ctx.body = {
          success: true,
          message: '标记全部已阅成功',
        }
      } else {
        throw new Error('标记全部失败');
      }
    } catch (e) {
      throw new Error(e);
    }
  }
};

module.exports = messageCtrl;