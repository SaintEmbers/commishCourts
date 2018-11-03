
import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, H1, Icon } from 'native-base';
import Spacer from './Spacer';

const GameCard = (props) => {
  const {joinGame, details, game, isCommish, makeTeams} = props;
  return(
    <View style={styles.card}>
      <TouchableOpacity onPress={makeTeams.bind(null, game)}>
      <View>
        <Text style={styles.text}>{details.day}</Text>
      </View>
      <View>
        <Text style={styles.text}>{details.location}</Text>
      </View>
      <View>
        <Text style={styles.text}>{details.time}</Text>
      </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={joinGame.bind(null, game)}>
        <View>
          <Icon name="add-circle" style={styles.icon}></Icon>
        </View>
      </TouchableOpacity>
    </View>

  )
};


const styles = StyleSheet.create({
 card: {
  marginBottom: 10,
  flexDirection: 'row',
  justifyContent: 'space-around',
  paddingTop: 20,
  paddingBottom: 20,
  backgroundColor: '#898989',
  width: '90%',
  marginLeft: 'auto',
  marginRight: 'auto'
 },
 
 text: {
  color: 'white',
  fontWeight: '100',
  fontSize: 23,
 }, 
 icon: {
  color: '#a0d6b4',
  fontSize: 30,
 } 
})

GameCard.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
};

GameCard.defaultProps = {
  title: 'Missing title',
  content: '',
};

export default GameCard;