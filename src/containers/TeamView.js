import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet } from 'react-native';
import { Container, Content, Text, Button } from 'native-base';
import { getPlayers, makeTeams, getTeams } from '../actions/games';
import PlayerCard from '../components/PlayerCard';

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
      reserve: [],
    };
    this.addToTeam = this.addToTeam.bind(this);
    this.setTeams = this.setTeams.bind(this);
  }

  componentWillMount() {
    const { gameId } = this.props;
    this.props.getPlayers({ gameId: this.props.gameId });
    this.props.getTeams({ gameId });
  }

  componentWillReceiveProps(nextProps) {
    const { teams } = nextProps;
    this.processSavedTeams(nextProps.teams);
  }

  processSavedTeams(teams) {
    const { red, black, white } = this.state;
    let redTeam = this.state.red;
    let blackTeam = this.state.black;
    let whiteTeam = this.state.white;

    teams.forEach((team) => {
      console.log('team', team);
      if (team.red) {
        redTeam = team.red;
      } else if (team.black) {
        blackTeam = team.black;
      } else {
        whiteTeam = team.white;
      }
    });
    return this.setState({ red: redTeam, black: blackTeam, white: whiteTeam });
  }

  addToTeam({ name, team, previous }) {
    const prevTeam = this.state[previous];
    const idx = prevTeam.indexOf(name);
    const updatedTeam = [];
    if (idx > -1) {
      prevTeam.splice(idx, 1);
    }
    const player = { [name]: true };
    const newTeam = this.state[team];
    newTeam.push(name);
    if (updatedTeam.length > 0) {
      this.setState({ [team]: newTeam, [previous]: updatedTeam });
    } else {
      this.setState({ [team]: newTeam });
    }
  }

  setTeams() {
    const { red, black, white } = this.state;
    const { gameId } = this.props;
    this.props.makeTeams({
      red, black, white, gameId,
    });
  }

  render = () => {
    let player;
    const { players, teams } = this.props;
    const { red, white, black } = this.state;
    const redTeam = [];
    const blackTeam = [];
    const whiteTeam = [];
    const reserves = [];
    const reservedPlayerList = [];

    // <PlayerCard player={playerStats} key={idx} team='reserve' addToTeam={this.addToTeam}/>
    players.forEach((playerStats, idx) => {
      const isRedTeam = this.state.red.length > 0 && this.state.red.indexOf(playerStats.name) > -1;
      const isWhiteTeam = this.state.white.length > 0 && this.state.white.indexOf(playerStats.name) > -1;
      const isBlackTeam = this.state.black.length > 0 && this.state.black.indexOf(playerStats.name) > -1;
      if (isRedTeam) {
        redTeam.push(<PlayerCard player={playerStats} key={idx} team="red" addToTeam={this.addToTeam} />);
      } else if (isWhiteTeam) {
        whiteTeam.push(<PlayerCard player={playerStats} key={idx} team="white" addToTeam={this.addToTeam} />);
      } else if (isBlackTeam) {
        blackTeam.push(<PlayerCard player={playerStats} key={idx} team="black" addToTeam={this.addToTeam} />);
      } else {
        reserves.push(playerStats);
      }
    });

    let lastAListIdx = 0;
    reserves.forEach((player, idx) => {
      const list = player.list || 'nube';
      if (list && list.toLowerCase() === 'a' || list.toLowerCase() === 'platinum') {
        reservedPlayerList.unshift(<PlayerCard player={player} key={idx} team="reserve" addToTeam={this.addToTeam} />);
        lastAListIdx++;
      } else if (list && list.toLowerCase() === 'b') {
        reservedPlayerList.splice(lastAListIdx, 0, <PlayerCard player={player} key={idx} team="reserve" addToTeam={this.addToTeam} />);
      } else {
        reservedPlayerList.push(<PlayerCard player={player} key={idx} team="reserve" addToTeam={this.addToTeam} />);
      }
    });

    return (
      <Container padder>
        <Content padder>
          <Text>Red Team</Text>
          {redTeam}
          <Text>Black Team</Text>
          {blackTeam}
          <Text>White Team</Text>
          {whiteTeam}
          <Text>Reserves</Text>
          {reservedPlayerList}
        </Content>
        <Button block onPress={this.setTeams}>
          <Text>Set Teams</Text>
        </Button>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    marginBottom: 30,
  },
});

function mapStateToProps(state) {
  const { players, teams } = state.games;
  return { players, teams };
}

export { TeamView };
export default connect(mapStateToProps, { getPlayers, makeTeams, getTeams })(TeamView);
