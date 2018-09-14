
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { logout, getMemberData, buyCredits, evaluationSubmit } from '../actions/member';

class EvalFormContainer extends Component {
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

  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount(){
    return this.props.getMemberData();
  } 

  handleSubmit(details){
    this.props.evaluationSubmit({details})
    .then(() => Actions.tabbar())
    .catch(e => console.log(`Error: ${e}`));
  }

  render(){
    const { Layout, member, memberLogout, buyCredits } = this.props;

    return <Layout member={member} logout={memberLogout} buy={buyCredits} handleSubmit={this.handleSubmit} />;
  }
}

const mapStateToProps = state => ({
  member: state.member || {},
});

const mapDispatchToProps = {
  memberLogout: logout,
  getMemberData,
  buyCredits,
};

export default connect(mapStateToProps, mapDispatchToProps)(EvalFormContainer);
