
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Actions } from 'react-native-router-flux';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Content, Icon } from 'native-base';
import Spacer from './Spacer';

class PlayerSearchCard extends Component{

  constructor(props) {
    super(props);
    this.state = {
      currentTeam: 'black'
    }
    this.assignTeam = this.assignTeam.bind(this)
  }

  componentWillMount(){
    this.setState({currentTeam: this.props.team})
  }

  assignTeam(team){
    const {name} = this.props.player;
    this.props.addToTeam({name, team, previous: this.state.currentTeam})
    this.setState({currentTeam: team})
  }

  viewPlayer(){
   Actions.profilePage({member: this.props.player})
  }

  render(){
    //add icon to card as a circle
    const {player, team} = this.props;
    return(
      <View style={styles.card}>
        <TouchableOpacity onPress={this.viewPlayer.bind(this)}>
          <View style={styles.player}>
            <Text style={[styles.text, styles.black]}>{player.firstName} {player.lastName}</Text>
          </View>
        </TouchableOpacity>
      </View>
    )

  }
};

const styles = StyleSheet.create({
 card: {
  marginBottom: 10,
  backgroundColor: 'black',
  paddingTop: 20,
  paddingBottom: 20,
 },
 player: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  paddingTop: 5,
  paddingBottom: 5,
  width: '90%',
  marginLeft: 'auto',
  marginRight: 'auto',
 },
 text: {
  color: 'white',
  fontWeight: '100',
  fontSize: 23,
 }, 

})

PlayerSearchCard.propTypes = {
  player: PropTypes.object,
};

export default PlayerSearchCard;