const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const topicCollect = new Schema({
  author_id: Schema.Types.ObjectId,
  topic_id: { type: Schema.Types.ObjectId, required: true },
  create_at: { type: Date, default: new Date() },
});

const TopicCollect = mongoose.model('TopicCollect', topicCollect);

module.exports = TopicCollect;