
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';

import { logout, getMemberData, buyCredits, evaluationSubmit } from '../actions/member';

class EvalFormContainer extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    memberLogout: PropTypes.func.isRequired,
    getMemberData: PropTypes.func.isRequired,
    buyCredits: PropTypes.func.isRequired,
    evalComplete: PropTypes.bool.isRequired,
    evaluationSubmit: PropTypes.func.isRequired,
    member: PropTypes.shape({
      loading: PropTypes.bool,
      error: PropTypes.string,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  componentDidMount() {
    return this.props.getMemberData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.evalComplete && !this.props.evalComplete) {
      Actions.profilePage();
    }
  }

  handleSubmit(details) {
    this.props.evaluationSubmit({ details });
  }

  render() {
    const {
      Layout, member, memberLogout,
    } = this.props;
    return (<Layout
      member={member}
      logout={memberLogout}
      buy={this.props.buyCredits}
      handleSubmit={this.handleSubmit}
    />);
  }
}

const mapStateToProps = state => ({
  member: state.member,
  evalComplete: state.member.evalComplete || false,
});

const mapDispatchToProps = {
  memberLogout: logout,
  getMemberData,
  buyCredits,
  evaluationSubmit,
};

export default connect(mapStateToProps, mapDispatchToProps)(EvalFormContainer);
