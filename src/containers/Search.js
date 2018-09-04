import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet, } from 'react-native';
import { Container, Content, Text, Button } from 'native-base';

import { getAllPlayers } from '../actions/games';
import PlayerCard from '../native/components/PlayerCard';
class SearchContainer extends Component {
  static propTypes = {
    players: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount(){
    this.props.getAllPlayers();
  }

  handleChange(type, value){
    this.setState({[type]: value})
  }


  render = () => {
    let player;
    const {players} = this.props;
    const playerCards = players.map((playerStats, key) => {
      return <PlayerCard player={playerStats}/>
    })
    return(
      <Container padder>
        <Content padder>
          <Input onChangeText={v => this.handleChange('player', v)}/>
          {playerCards}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    marginBottom: 30,
  }
});

function mapStateToProps(state) {
  const { allPlayers } = state.games || {};
  return { allPlayers };
}

export {SearchContainer};
export default connect(mapStateToProps, {getAllPlayers})(SearchContainer);