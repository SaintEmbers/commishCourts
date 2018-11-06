import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { View, StyleSheet, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Container, Content, List, ListItem, Body, Left, Text, Icon, Button } from 'native-base';
import { getMemberData, saveMemberPhoto, getMemberPhoto, addPlayerNote, resetNote, updateList } from '../actions/member';
import _ from 'lodash';
import ImagePickerComponent from '../components/ImagePicker';
import Spacer from '../components/Spacer';
import Header from '../components/Header';

class ProfileDetailsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
    };
  }

  componentWillMount() {
    this.props.resetNote();
    !this.props.member && this.props.getMemberData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.member.noteAdded && !this.props.member.noteAdded) {
      this.props.resetNote();
      Actions.profileHome();
    }
  }

  getProfilePhoto() {
    this.props.getMemberPhoto();
  }

  savePhoto({ image }) {
    this.props.saveMemberPhoto({ image });
  }
  addNotes() {
    this.props.addPlayerNote(this.state.text, this.props.member.uid);
  }

  addToList(list) {
    if (list === 'update') {
      return this.setState({ listUpdate: true });
    }
    this.props.updateList({ list });
    this.setState({ listUpdate: false });
  }

  render() {
    const { member, profilePhoto } = this.props;
    const {
      firstName, lastName, email, profile, isCommish,
    } = member;
    const {
      ballHandlingRating, threePointRating, postRating, personalRating, frequency, adultLevel, highestLevel, notes, list,
    } = profile;
    const note = (<TextInput
      style={{
 height: 300, borderColor: 'gray', borderWidth: 1, fontSize: 30, padding: 20, paddingTop: 20, color: 'white',
}}
      onChangeText={(text) => { this.setState({ text }); }}
      value={this.state.text}
      multiline
    />);
    const button = this.state.text.length > 0 &&
    <Button style={styles.button} onPress={this.addNotes.bind(this)}>
      <Text style={styles.buttonText}>SUBMIT</Text>
    </Button>;

    const noteBook = _.values(notes).reduce((accum, current) => `${accum + current} `, '');

    const listName = list || 'Pay as you go';

    const listButton = !this.state.listUpdate ?
      (<Button style={{ backgroundColor: 'transparent', marginLeft: -17, paddingLeft: 0 }} onPress={this.addToList.bind(this, 'update')}>
        <Text style={{ backgroundColor: 'transparent', color: 'black', fontSize: 20 }}>List: {listName}</Text>
       </Button>) :
      (<View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
        <Button style={{ backgroundColor: 'transparent', marginLeft: -17, paddingLeft: 0 }} onPress={this.addToList.bind(this, 'Platinum')}>
          <Text style={{ backgroundColor: 'transparent', color: 'black', fontSize: 20 }}>Platinum</Text>
        </Button>;
        <Button style={{ backgroundColor: 'transparent', marginLeft: -17, paddingLeft: 0 }} onPress={this.addToList.bind(this, 'A-List')}>
          <Text style={{ backgroundColor: 'transparent', color: 'black', fontSize: 20 }}>A</Text>
        </Button>;
        <Button style={{ backgroundColor: 'transparent', marginLeft: -17, paddingLeft: 0 }} onPress={this.addToList.bind(this, 'B-List')}>
          <Text style={{ backgroundColor: 'transparent', color: 'black', fontSize: 20 }}>B</Text>
        </Button>;
       </View>);
    return (
      <Container style={{ backgroundColor: 'black' }}>
        <Content padder>
          <View style={{
 flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 0,
}}
          >
            <ImagePickerComponent savePhoto={this.savePhoto.bind(this)} profilePhoto={profilePhoto} getProfilePhoto={this.getProfilePhoto.bind(this)} />;
          </View>
          <Body style={{
 flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 0,
}}
          >
            {listButton}
            <Text style={styles.text}>Name: {member.firstName} {member.lastName}</Text>
            <Text style={styles.text}>Email: {member.email}</Text>
            <Text style={styles.text}>Ball handling: {member.profile.ballHandlingRating}</Text>
            <Text style={styles.text}>Three Pointers: {member.profile.threePointRating}</Text>
            <Text style={styles.text}>Post Rating: {member.profile.postRating}</Text>
            <Text style={styles.text}>Personal Rating: {member.profile.personalRating}</Text>
            <Text style={styles.text}>Frequency of current play: {frequency}</Text>
            <Text style={styles.text}>As an adult has played in a: {adultLevel}</Text>
            <Text style={styles.text}>Highest level Played: {highestLevel}</Text>
            <Text style={styles.text}>Notes: {noteBook}</Text>

          </Body>
          <Spacer />
          <Text style={styles.text}>NOTES:</Text>
          {note}
          <View style={{
 flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 0,
}}
          >
            <View style={{ flex: 1, justifyContent: 'center' }}>
              {button}
            </View>
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1, alignItems: 'flex-start', justifyContent: 'center', marginTop: 0,
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
    paddingTop: 20,
  },
  button: {
    width: 200,
    height: 60,
    backgroundColor: 'red',
    marginTop: 25,
    flex: 1,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'black',
  },

});

const mapStateToProps = state => ({
  member: state.member || {},
  profilePhoto: state.member.profilePhoto || '',
});

const mapDispatchToProps = {
  getMemberData,
  saveMemberPhoto,
  getMemberPhoto,
  addPlayerNote,
  resetNote,
  updateList,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDetailsContainer);
