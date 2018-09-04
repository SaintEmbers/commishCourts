
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { logout, getMemberData, buyCredits, registerForPushNotifications } from '../actions/member';

class Member extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    memberLogout: PropTypes.func.isRequired,
    getMemberData: PropTypes.func.isRequired,
    buyCredits: PropTypes.func.isRequired,
    member: PropTypes.shape({
      loading: PropTypes.bool.isRequired,
      error: PropTypes.string,
    }).isRequired,
  }

  componentWillMount(){
    this.props.getMemberData();
  }
  render = () => {
    const { Layout, member, memberLogout, buyCredits } = this.props;
    return <Layout member={member} logout={memberLogout} buy={buyCredits} />;
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
});

const mapDispatchToProps = {
  memberLogout: logout,
  getMemberData,
  buyCredits,
  registerForPushNotifications,
};

export default connect(mapStateToProps, mapDispatchToProps)(Member);
