const router = require('koa-router')();
const topicController = require('./../controllers/topic_controller');
const userController = require('./../controllers/user_controller');
const commentController = require('./../controllers/comment_controller');
const messageController = require('./../controllers/message_controller');
const resolveToken = require('./../middleware/token');
const shouldAuth = require('./../middleware/shouldAuth');


const routers = router
  .get('/topics', topicController.getTopics)
  .get('/topics/:id', shouldAuth, topicController.getTopicDetail)
  .get('/topic/no_reply', topicController.getNoReply)
  .post('/topic/create', resolveToken, topicController.create)
  .post('/topic/:topic_id/replies', resolveToken, commentController.create)
  .delete('/topic/:topic_id/delete', resolveToken, topicController.removeTopic)
  .put('/topic/update', resolveToken, topicController.updateTopic)
  .post('/reply/:reply_id/ups', resolveToken, commentController.upReply)
  .delete('/reply/:reply_id/delete',  resolveToken, commentController.deleteReply)
  .post('/topic/topic_collect/collect', resolveToken, topicController.collect)
  .post('/topic_collect/de_collect', resolveToken, topicController.cancelCollect)
  .post('/user/login', userController.login)
  .post('/user/register', userController.createUser)
  .get('/user-info/:loginname', userController.getInfo)
  .get('/user/auth', resolveToken, userController.getAuth)
  .put('/user/basic_setting', resolveToken, userController.changeSetting)
  .put('/user/set_password', resolveToken, userController.setNewPassword)
  .get('/message/count', resolveToken, messageController.getCount)
  .get('/messages', resolveToken, messageController.getMessages)
  .post('/message/mark_one/:msg_id', resolveToken, messageController.markOne)
  .post('/message/mark_all', resolveToken, messageController.markAll);

module.exports = routers;
