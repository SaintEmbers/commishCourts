import React, { Component } from 'react';
import { View, StyleSheet, } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Container, Content, Text, Button } from 'native-base';

import Spacer from '../native/components/Spacer';
import { Actions } from 'react-native-router-flux';
import { getGames, joinGame } from '../actions/games';
import { getMemberData } from '../actions/member';

class GamesContainer extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    games: PropTypes.object,
    getGames: PropTypes.func,
    getUserData: PropTypes.func,
  }

  componentWillMount(){
    this.props.getGames();
    this.props.getMemberData();
  }

  createGame(){
    Actions.gameCreator();
  }

  joinGame(){
    console.log('join game')
    Actions.joinGame()
  }

  render = () => {
    const { Layout, games, userData } = this.props;
    const {isCommish} = userData;
    const cards = [];

    _.forIn(games.games, (value, key) => {
      cards.push(<Layout game={key} details={value} key={key} isCommish={isCommish} joinGame={this.joinGame.bind(this)}/>)
    })
    const button = isCommish && <Button block onPress={this.createGame}><Text>Create Game</Text></Button>;
    return (
    <Container>
      <Content padder>
        <View>
          {cards}
        </View>
        {button}
      </Content>
    </Container>

    );
  }
}

const mapStateToProps = state => ({
  userData: state.member || {},
  games: state.games || {},
});

export {GamesContainer};
export default connect(mapStateToProps, {getGames, getMemberData})(GamesContainer);
