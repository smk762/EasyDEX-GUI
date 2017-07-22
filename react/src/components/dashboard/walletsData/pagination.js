import React, { Component } from 'react';
import PaginationRender from './pagination.render';

export default class TablePaginationRenderer extends Component {
  constructor (props) {
    super();

    this.getSafePage = this.getSafePage.bind(this);
    this.changePage = this.changePage.bind(this);
    this.applyPage = this.applyPage.bind(this);

    this.state = {
      page: props.page
    }
  }

  componentWillReceiveProps (nextProps) {
    this.setState({ page: nextProps.page });
  }

  getSafePage (page) {
    if (isNaN(page)) {
      page = this.props.page;
    }
    return Math.min(Math.max(page, 0), this.props.pages - 1);
  }

  changePage (page) {
    page = this.getSafePage(page);
    this.setState({ page });
    if (this.props.page !== page) {
      this.props.onPageChange(page);
    }
  }

  applyPage (e) {
    e && e.preventDefault();
    const page = this.state.page;
    this.changePage(page === '' ? this.props.page : page);
  }

  render () {
    return PaginationRender.call(this);
  }
}