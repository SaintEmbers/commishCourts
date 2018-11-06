
import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, H1, Icon } from 'native-base';
import Spacer from './Spacer';

const GameCard = (props) => {
  const {
    joinGame, details, game, isCommish, makeTeams,
  } = props;
  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={makeTeams.bind(null, game)}>
        <View style={styles.textDiv}>
          <Text style={styles.text}>{details.day} @ {details.time}</Text>
          <Text style={styles.text}>{details.location}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={joinGame.bind(null, game)}>
        <View style={styles.rsvpContent}>
          <Icon name="add-circle" style={styles.icon} />
          <Text style={styles.rsvp}>RSVP</Text>
        </View>
      </TouchableOpacity>
    </View>

  );
};


const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#898989',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  textDiv: {
    marginTop: 12,
  },

  text: {
    color: 'black',
    fontWeight: '100',
    fontSize: 21,
    marginLeft: -20,

  },
  icon: {
    marginTop: 0,
    color: 'white',
    fontSize: 40,
    marginLeft: 3,
  },
  rsvpContent: {
    marginRight: -22,
  },

  rsvp: {
    color: 'black',
    fontWeight: '100',
    fontSize: 21,
  },
});

GameCard.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
};

GameCard.defaultProps = {
  title: 'Missing title',
  content: '',
};

export default GameCard;
