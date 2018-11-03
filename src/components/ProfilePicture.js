import React from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import Spacer from './Spacer';

const defaultImg = require('../images/player.png');

const ProfilePicture = url => (
  <View>
    <Spacer />
    <Image source={defaultImg} style={{ width: 80, height: 135, alignSelf: 'center' }} />
  </View>
);

ProfilePicture.propTypes = {

};

ProfilePicture.defaultProps = {

};

export default ProfilePicture;
