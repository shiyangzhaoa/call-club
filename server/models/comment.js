const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const comment = new Schema({
  author_id: Schema.Types.ObjectId,
  topic_id: { type: Schema.Types.ObjectId, required: true },
  content: String,
  create_at: { type: Date, default: new Date() },
  ups: [Schema.Types.ObjectId],
  reply_id: Schema.Types.ObjectId,
  is_uped: { type: Boolean, default: false },
});

comment.index({topic_id: 1});
comment.index({author_id: 1, create_at: -1});

const Comment = mongoose.model('Comment', comment);

module.exports = Comment;
