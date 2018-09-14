
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Content, Icon } from 'native-base';
import Spacer from './Spacer';

class PlayerCard extends Component{

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

  render(){
    const {player, team} = this.props;
    const fullHTML = 
      <View style={styles.card}>
        <View style={styles.player}>
          <Text style={[styles.text, styles.blackTeam]}>{player.name}</Text>
          <Text style={[styles.text, styles.blackTeam]}>{player.position}</Text>
          <Text style={[styles.text, styles.blackTeam]}>{player.list}</Text>
         </View>
          <View style={styles.player}>
          <TouchableOpacity onPress={this.assignTeam.bind(null, 'black')}>
            <Icon name="basketball" style={styles.blackTeam}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.assignTeam.bind(null, 'white')}>
            <Icon name="basketball" style={styles.whiteTeam}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.assignTeam.bind(null, 'red')}>
            <Icon name="basketball" style={styles.redTeam}/>
          </TouchableOpacity>
          </View>
        </View>

    const teamMember =  
      <TouchableOpacity onPress={this.assignTeam.bind(null, 'reserve')}>
        <View style={styles.player}>
          <Text style={[styles.text, styles.blackTeam]}>{player.name}</Text>
          <Text style={[styles.text, styles.blackTeam]}>{player.position}</Text>
          <Text style={[styles.text, styles.blackTeam]}>{player.list}</Text>
        </View>
      </TouchableOpacity>

    const markup = team === 'reserve' ? fullHTML : teamMember 
    return markup

  }
};

const styles = StyleSheet.create({
 card: {
  marginBottom: 10,
  backgroundColor: '#898989',
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
  color: 'black',
  fontWeight: '100',
  fontSize: 23,
 }, 
 icon: {
  color: '#a0d6b4',
  fontSize: 30,
 },
 blackTeam: {
  color: 'black',
 },
 whiteTeam: {
  color: 'white',

 },
 redTeam: {
  color: 'red',
 },
 teamIcon: {
  color: 'white',
 }
})

PlayerCard.propTypes = {
  player: PropTypes.object,
};

export default PlayerCard;