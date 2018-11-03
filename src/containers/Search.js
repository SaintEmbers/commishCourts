import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { Container, Content, Text, Button, Input } from 'native-base';
import Fuse from 'fuse.js';
import { getAllPlayers } from '../actions/games';
import PlayerSearchCard from '../components/PlayerSearchCard';

class SearchContainer extends Component {
  static propTypes = {
    players: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.props.getAllPlayers();
  }

  handleChange(type, value) {
    const options = { keys: ['firstName', 'lastName'] };
    const { allPlayers } = this.props;
    this.setState({ [type]: value });
    const fuse = new Fuse(allPlayers, options);
    const results = fuse.search(value);
    this.setState({ searchResults: results });
  }

  render = () => {
    let player;
    const { allPlayers } = this.props;
    const { searchResults } = this.state;
    const playerCards = allPlayers.map((playerStats, key) => <PlayerSearchCard player={playerStats} key={key} />);

    const searchCards = searchResults.map((playerStats, key) => <PlayerSearchCard player={playerStats} key={key} />);

    const cards = searchResults.length > 0 ? searchCards : playerCards;

    return (
      <Container>
        <Content padder>
          <Input style={styles.searchInput} placeholder="search" onChangeText={v => this.handleChange('player', v)} />
          {cards}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    marginBottom: 5,
  },
  searchInput: {
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 40,
    marginTop: -20,
    fontSize: 25,
  },
});

function mapStateToProps(state) {
  const { allPlayers } = state.games || [];
  return { allPlayers };
}

export { SearchContainer };
export default connect(mapStateToProps, { getAllPlayers })(SearchContainer);
