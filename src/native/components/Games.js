
import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { Text, H1 } from 'native-base';
import Spacer from './Spacer';

const GamesView = ({game}) => (
  
  <View>
    <Spacer size={25} />
    <H1>Games</H1>
      <View>
        <Spacer size={10} />
        <Text>{game.games.saturday.gameTime}</Text>
      </View>
    <Spacer size={20} />
  </View>
);

GamesView.propTypes = {
  title: PropTypes.string,
  content: PropTypes.string,
};

GamesView.defaultProps = {
  title: 'Missing title',
  content: '',
};

export default GamesView;