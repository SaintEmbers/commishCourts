import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getGames } from '../actions/games';

class GamesContainer extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    games: PropTypes.object,
    getGames: PropTypes.func,
  }


  componentDidMount = () => this.props.getGames();

  render = () => {
    const { Layout, games } = this.props;

    return (
      <Layout game={games}/>
    );
  }
}

const mapStateToProps = state => ({
  games: state.games || {},
});

const mapDispatchToProps = {
  getGames,
  // getMeals,
  // setError,
};

export default connect(mapStateToProps, mapDispatchToProps)(GamesContainer);
