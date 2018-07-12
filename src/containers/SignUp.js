import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { signUp, login } from '../actions/member';

const SignUp = ({
  Layout,
  signUp,
  member,
  isLoading,
  infoMessage,
  errorMessage,
  successMessage,
  login,
}) => (
  <Layout
    member={member}
    loading={isLoading}
    info={infoMessage}
    error={errorMessage}
    success={successMessage}
    signUp={signUp}
    login={login}
  />
);

SignUp.propTypes = {
  Layout: PropTypes.func.isRequired,
  member: PropTypes.shape({}).isRequired,
  signUp: PropTypes.func.isRequired,
  login: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  infoMessage: PropTypes.string,
  errorMessage: PropTypes.string,
  successMessage: PropTypes.string,
};

SignUp.defaultProps = {
  infoMessage: null,
  errorMessage: null,
  successMessage: null,
};

const mapStateToProps = state => ({
  member: state.member || {},
  isLoading: state.status.loading || false,
  infoMessage: state.status.info || null,
  errorMessage: state.status.error || null,
  successMessage: state.status.success || null,
});

const mapDispatchToProps = {
  signUp,
  login,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
