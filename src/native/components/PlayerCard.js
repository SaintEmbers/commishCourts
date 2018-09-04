
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Content } from 'native-base';
import Spacer from './Spacer';

class PlayerCard extends Component{

  constructor(props) {
    super(props);
    this.state = {
      colors: ['black', 'red', 'white'],
      currentTeam: 'black'
    }
    this.assignTeam = this.assignTeam.bind(this)
  }

  componentWillMount(){
    // const idx = this.props.key;
    this.setState({currentTeam: this.props.team})
    // switch(true){
    //   case idx > 9:
    //     this.setState({currentTeam: 'red'})
    //     break;
    //   case idx > 4:
    //     this.setState({currentTeam: 'white'})
    //     break;
    // }
  }

  assignTeam(){
    const {name} = this.props.player;
    const idx = this.state.colors.indexOf(this.props.team);
    const nextIdx = idx+1;
    const nextColor = this.state.colors[nextIdx] || this.state.colors[0];

    this.setState({currentTeam: nextColor})
    this.props.addToTeam({name, team: nextColor, previous: this.state.currentTeam})
  }

  render(){
    const {player} = this.props;
    return(
      <TouchableOpacity onPress={this.assignTeam}>
        <View style={[styles.card, {backgroundColor: this.props.team}]}>
          <Text style={styles.text}>{player.name}</Text>
          <Text style={styles.text}>{player.position}</Text>
          <Text style={styles.text}>{player.list}</Text>
        </View>
      </TouchableOpacity>
    )
    
  }
};

const styles = StyleSheet.create({
 card: {
  marginBottom: 10,
  flexDirection: 'row',
  justifyContent: 'space-around',
  paddingTop: 20,
  paddingBottom: 20,
  width: '90%',
  marginLeft: 'auto',
  marginRight: 'auto',
  borderColor: 'black',
  borderWidth: 1,
 },
 
 text: {
  color: '#36454f',
  fontWeight: '100',
  fontSize: 23,
 }, 
 icon: {
  color: '#a0d6b4',
  fontSize: 30,
 } 
})

PlayerCard.propTypes = {
  player: PropTypes.object,
};

export default PlayerCard;