
import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, H1 } from 'native-base';
import Spacer from './Spacer';

const GameCard = ({details, joinGame}) => (
  <View style={styles.card}>
    <TouchableOpacity onPress={joinGame}>
      <View>
        <Text style={styles.text}>{details.day}</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={joinGame}>
      <View>
        <Text style={styles.text}>{details.location}</Text>
      </View>
    </TouchableOpacity>
    <TouchableOpacity onPress={joinGame}>
      <View>
        <Text style={styles.text}>{details.time}</Text>
      </View>
    </TouchableOpacity>
  </View>
);


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