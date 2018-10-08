
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
    member: PropTypes.shape({
      loading: PropTypes.bool,
      error: PropTypes.string,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.evalComplete && !this.props.evalComplete){
      console.log('go to profile page')
      Actions.profilePage();
    }
  }

  componentDidMount(){
    return this.props.getMemberData();
  } 

  handleSubmit(details){
    this.props.evaluationSubmit({details})
  }

  render(){
    const { Layout, member, memberLogout, buyCredits, evalComplete } = this.props;
    return <Layout member={member} logout={memberLogout} buy={buyCredits} handleSubmit={this.handleSubmit} />;
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
