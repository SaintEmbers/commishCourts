import React, { Component } from 'react';
import PropTypes from 'prop-types';

class GameCreatorContainer extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
  }

  render = () => {
    const { Layout } = this.props;
    return (
      <Layout/>
    );
  }
}

export default GameCreatorContainer;
