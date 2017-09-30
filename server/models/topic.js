const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const topicSchema = new Schema({
  author_id: { type: Schema.Types.ObjectId, required: true },
  tab: { type: String, required: true },
  content: String,
  title: { type: String, required: true },
  last_reply: { type: Schema.Types.ObjectId },
  last_reply_at: { type: Date, default: new Date() },
  good: { type: Boolean, default: false },
  top: { type: Boolean, default: false },
  reply_count: { type: Number, default: 0 },
  visit_count: { type: Number, default: 0 },
  create_at: { type: Date, default: new Date() },
  author: {
    loginname: String,
    avatar_url: String,
  },
});


topicSchema.index({create_at: -1});
topicSchema.index({top: -1, last_reply_at: -1});

const Topic = mongoose.model('Topics', topicSchema);

module.exports = Topic;
