import React from 'react';
import PropTypes from 'prop-types';
import { View, Image } from 'react-native';
import Spacer from './Spacer';

const ProfilePicture = () => (
  <View>
  	<Spacer/>
   	<Image source={require('../../images/player.png')} style={{width: 140, height: 240, alignSelf: 'center'}} />
  </View>
);

ProfilePicture.propTypes = {
  
};

ProfilePicture.defaultProps = {
  
};

export default ProfilePicture;

