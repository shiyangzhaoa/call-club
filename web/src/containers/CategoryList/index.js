import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Spin, Card, Pagination } from 'antd';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import * as actions from './../../actions';
import TopicItem from './../../components/TopicItem';

class CategoryList extends Component {
  componentWillReceiveProps(nextProps) {
    const { actions } = this.props;
    const { match } = nextProps;
    const page = parseInt(match.params.pageNum, 10);
    const nextPage = isNaN(page) ? 1 : page;
    const slug = match.params.categorySlug;
    const nextSlug = slug ? slug : 'all';

    if (this.getPageNow() !== nextPage) {
      actions.getTopics({
        page: nextPage,
        tab: nextSlug,
        limit: this.getLimit(),
      })
    }
    if (this.getSlug() !== nextSlug) {
      actions.getTopics({
        tab: nextSlug,
        limit: this.getLimit()
      })
    }
  }
  componentDidMount() {
    const { actions } = this.props;
    actions.getTopics({
      page: this.getPageNow(),
      tab: this.getSlug()
    });
  }
  getPageNow = () => {
    const { match } = this.props;
    let pageParam = parseInt(match.params.pageNum, 10);
    pageParam = isNaN(pageParam) ? 1 : pageParam;
    return pageParam;
  }
  getSlug = () => {
    const { match } = this.props;
    let slugParam = match.params.categorySlug;
    slugParam = slugParam ? slugParam : 'all';
    return slugParam;
  }
  getLimit = () => {
    const { limit } = this.props
    return limit;
  }
  onShowSizeChange = (current, size) => {
    const { actions } = this.props;
    actions.getTopics({
      page: this.getPageNow(),
      tab: this.getSlug(),
      limit: size,
    });
  }
  onChange = (page) => {
    if (this.getSlug()) {
      this.props.history.push(`/category/${this.getSlug()}/${page}`);
      return;
    }
    this.props.history.push(`/page/${page}`);
  }
  render() {
    const { topics, getTopicStatus } = this.props;
    if (getTopicStatus === 'pending') {
      return (
        <Spin tip="Loading...">
          <Card loading style={{ width: '100%' }}>
          正在加载~
          </Card>
        </Spin>
      );
    } else if (getTopicStatus === 'succ') {
      const { list, count } = topics;
      if (list.length) {
        return (
          <div>
            <ReactCSSTransitionGroup
              transitionName="topic"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={300}>
              {list.map(item => {
                switch (item.tab) {
                  case 'share':
                    item.kind = '分享';
                    break;
                  case 'ask':
                    item.kind = '问答';
                    break;
                  case 'job':
                    item.kind = '招聘';
                    break;
                  default:
                    item.kind = '未知';
                }
                if (item.good) item.kind = '精华';
                if (item.top) item.kind = '置顶';
                return (
                  <TopicItem key={item._id} info={item}/>
                );
              })}
            </ReactCSSTransitionGroup>
            <Pagination showSizeChanger pageSize={this.getLimit()} current={this.getPageNow()} onChange={this.onChange} onShowSizeChange={this.onShowSizeChange} defaultCurrent={1} total={count} />
          </div>
        );
      } else {
        return <TopicItem info={{kind: '无'}}/>
      }
    } else {
      return (<div>出错</div>)
    }
  }
}
CategoryList.propTypes = {
  topics: PropTypes.object,
  getTopicStatus: PropTypes.string,
  limit: PropTypes.number,
}

function mapStateToProps(state) {
  const props = {
    topics: state.topic.topics,
    getTopicStatus: state.topic.getTopicStatus,
    limit: state.topic.limit
  };
  return props;
}
function mapDispatchToProps(dispatch) {
  const actionMap = { actions: bindActionCreators(actions, dispatch) };
  return actionMap;
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CategoryList));
