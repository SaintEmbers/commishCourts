import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet, } from 'react-native';
import { Container, Content, Text, Button } from 'native-base';

import { getPlayers } from '../actions/games';
import PlayerCard from '../native/components/PlayerCard';

class TeamView extends Component {
  static propTypes = {
    players: PropTypes.array,
    getPlayers: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      red: [],
      black: [],
      white: [],

    }
    this.addToTeam = this.addToTeam.bind(this);
    this.orderTeams = this.orderTeams.bind(this);

  }

  componentWillMount(){
    this.props.getPlayers({gameId : this.props.gameId});
  }

  orderTeams(){
    // Actions.setTeams({teams: this.state})
    console.log('setTeams', setTeams)
  }


  addToTeam({name, team, previous}){
    let prevTeam = this.state[previous]
    const idx = prevTeam.indexOf(name) > -1 && prevTeam.indexOf(name)
    const updatedTeam = idx && prevTeam.splice(idx,1);
    const player = {[name]: true};
    console.log('add to team', {name, team})
    let newTeam = this.state[team];
    newTeam.push(name)
    if(updatedTeam){
      this.setState({[team]: newTeam, [previous]: updatedTeam })
    } else{
      this.setState({[team]: newTeam })
    }
  } 

  render = () => {
    let player;
    const {players} = this.props;
    let redTeam = [];
    let blackTeam = [];
    let whiteTeam = [];
    const playerCards = players.forEach((playerStats, idx) => {
      const isRedTeam = this.state.red.length > 0 && this.state.red.indexOf(playerStats.name) > -1;
      const isWhiteTeam = this.state.white.length > 0 && this.state.white.indexOf(playerStats.name) > -1;
      if(isRedTeam){
        redTeam.push(<PlayerCard player={playerStats} key={idx} team='red' addToTeam={this.addToTeam}/>)
      } else if(isWhiteTeam){
        whiteTeam.push(<PlayerCard player={playerStats} key={idx} team='white' addToTeam={this.addToTeam}/>)
      } else{
        blackTeam.push(<PlayerCard player={playerStats} key={idx} team='black' addToTeam={this.addToTeam}/>)
      }
    })  

    return(
      <Container padder>
        <Content padder>
          {redTeam}
          {blackTeam}
          {whiteTeam}
        </Content>
        <Button block onPress={this.orderTeams}>
          <Text>Order Teams</Text>
        </Button>
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
  const { players } = state.games || {};
  return { players };
}

export {TeamView};
export default connect(mapStateToProps, {getPlayers})(TeamView);