import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet, TextInput } from 'react-native';
import { Container, Content, List, ListItem, Body, Left, Text, Icon, Button } from 'native-base';
import Header from '../native/components/Header';

import { getMemberData, saveMemberPhoto, getMemberPhoto } from '../actions/member';
import ImagePickerComponent from '../native/components/ImagePicker';
import Spacer from '../native/components/Spacer';

class ProfileDetailsContainer extends Component {
  constructor(props){
    super(props);

    this.state ={
      text: '',
    }
  }

  componentWillMount(){
    !this.props.member && this.props.getMemberData();
  }

  getProfilePhoto(){
    this.props.getMemberPhoto();
  }

  savePhoto({image}){
    this.props.saveMemberPhoto({image});
  }
  addNotes(){
    console.log('add notes')
  }

  render(){
    const { member, profilePhoto } = this.props;
    const { firstName, lastName, email, profile, isCommish } = member;
    const { ballHandlingRating, threePointRating, postRating, personalRating, frequency, adultLevel, highestLevel } = profile;
    const notes = <TextInput
        style={{height: 300, borderColor: 'gray', borderWidth: 1, fontSize: 30, padding: 20, paddingTop: 20}}
        onChangeText={(text) => {this.setState({text})}}
        value={this.state.text}
        multiline={true}
      />
    const button = this.state.text.length > 0 && 
    <Button style={styles.button} onPress={this.addNotes.bind(this)}>
      <Text style={styles.buttonText}>SUBMIT</Text>
    </Button>

    return(
      <Container>
        <Content padder>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 0 }}>
            <ImagePickerComponent savePhoto={this.savePhoto.bind(this)} profilePhoto={profilePhoto} getProfilePhoto={this.getProfilePhoto.bind(this)}/>;
          </View>
          <Body >
            <Text style={styles.text}>Name: {member.firstName} {member.lastName}</Text>
            <Text style={styles.text}>Email: {member.email}</Text>
            <Text style={styles.text}>Ball handling: {member.profile.ballHandlingRating}</Text>
            <Text style={styles.text}>Three Pointers: {member.profile.threePointRating}</Text>
            <Text style={styles.text}>Post Rating: {member.profile.postRating}</Text>
            <Text style={styles.text}>Personal Rating: {member.profile.personalRating}</Text>
            <Text style={styles.text}>Frequency of current play: {frequency}</Text>
            <Text style={styles.text}>As an adult has played in a: {adultLevel}</Text>
            <Text style={styles.text}>Highest level Played: {highestLevel}</Text>
          </Body>
          <Spacer/>
          <Text style={styles.text}>NOTES:</Text>
          {notes}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 0 }}>
            <View style={{flex: 1, justifyContent: 'center', textAlign: 'center'}}>
              {button}
            </View>
          </View>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1, alignItems: 'flex-start', justifyContent: 'center', marginTop: 0
  },
  text: {
    fontSize: 20,
    paddingBottom: 3,
  },
  notes: {
    height: 300, 
    borderColor: 'gray', 
    borderWidth: 1, 
    fontSize: 30, 
    padding: 20, 
    paddingTop: 20
  },
  button:{
    width: 200,
    height: 60,
    backgroundColor: 'red',
    color: 'black',
    marginTop: 25,
    flex: 1,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
  }

});

const mapStateToProps = state => ({
  member: state.member || {},
  profilePhoto: state.member.profilePhoto || '',
});

const mapDispatchToProps = {
  getMemberData,
  saveMemberPhoto,
  getMemberPhoto
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDetailsContainer);