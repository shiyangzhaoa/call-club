const Comment = require('./../models/comment');
const Topic = require('./../models/topic');
const Message = require('./../models/message');

const createComment = (body) => {
  return new Promise((resolve, reject) => {
    const newComment = new Comment(body);
    newComment.save((err, comment) => {
      if (err) reject(err);

      resolve(comment);
    });
  });
}

const findTopicById = topic_id => {
  return new Promise((resolve, reject) => {
    Topic.findById(topic_id, (err, result) => {
      if (err) reject(err);

      resolve(result);
    })
  });
};

const updateTopic = (topic_id, author_id, count) => {
  return new Promise((resolve, reject) => {
    Topic.update({ _id: topic_id }, {
      '$set': {
        "last_reply_at": new Date(),
        "last_reply": author_id,
      },
      '$inc': {"reply_count": count}
    }, (err, result) => {
      if (err) reject(err);

      resolve(result);
    })
  })
}

const findCommentById = reply_id => {
  return new Promise((resolve, reject) => {
    Comment.findById(reply_id, (err, result) => {
      if (err) reject(err);

      resolve(result);
    })
  })
}

const updateOne = (newReply) => {
  return new Promise((resolve, reject) => {
    newReply.save((err, result) => {
      if(err) reject(err);

      resolve(result);
    })
  })
}

const removeReply = (query) => {
  return new Promise((resolve, reject) => {
    Comment.remove(query, (err, result) => {
      if (err) reject(err);

      resolve(result);
    })
  });
}

const createMessage = (body) => {
  return new Promise((resolve, reject) => {
    const newMessage = new Message(body);
    newMessage.save((err, result) => {
      if (err) reject(err);

      resolve(result);
    })
  });
}

const commentCtrl = {
  async create(ctx) {
    const author_id = ctx.api_user.id;
    const req = ctx.request.body;
    if (!req.content) throw new Error('内容不能为空');
    const {
      topic_id,
    } = ctx.params;
    const body = Object.assign({}, req, {
      author_id,
    }, {
      topic_id,
    }, {
      create_at: new Date(),
    });
    const type = req.reply_id ? 'reply' : 'comment';
    try {
      const createResult = await createComment(body);
      const Topic = await findTopicById(topic_id);
      const newMessage = {
        reply_id: req.reply_id || null,
        create_at: new Date(),
        topic_author_id: Topic.author_id,
        topic_id,
        author_id,
        type,
      }
      await createMessage(newMessage);
      const updateResult = await updateTopic(topic_id, author_id, 1);
      if (!updateResult.ok) {
        throw new Error('更新失败');
      }
      ctx.status = 200;
      ctx.body = {
        id: createResult._id,
        message: '创建成功',
      }
    } catch (e) {
      throw new Error(e);
    }
  },

  async upReply(ctx) {
    const { reply_id } = ctx.params;
    const { id } = ctx.api_user;
    let action;
    try {
      const findResult = await findCommentById(reply_id);
      const index = findResult.ups.indexOf(id);
      if (index !== -1) {
        findResult.ups.splice(index, 1);
        action = 'down';
      } else {
        findResult.ups.push(id);
        action = 'up';
      }
      const updateResult = await updateOne(findResult);
      ctx.status = 200;
      ctx.body = { action };
    } catch (e) {
      throw new Error(e);
    }
  },

  async deleteReply(ctx) {
    const { reply_id } = ctx.params;
    try {
      const findResult = await findCommentById(reply_id);
      const removeResult = await removeReply({ _id: reply_id });
      const updateResult = await updateTopic(findResult.topic_id.toString(), findResult.author_id, -1);
      if (removeResult.result.ok && updateResult.ok) {
        ctx.status = 200;
        ctx.body = {
          success: true,
          message: '删除成功',
        };
      } else {
        throw new Error('失败');
      }
    } catch (e) {
      throw new Error(e);
    }
  },
};

module.exports = commentCtrl;
