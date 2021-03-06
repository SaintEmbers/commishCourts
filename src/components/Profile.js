import React from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
import { Container, Content, List, ListItem, Body, Left, Text, Icon } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Header from './Header';
import Spacer from './Spacer';
import ProfilePicture from './ProfilePicture';

const Profile = ({ member, logout, buy }) => {
  console.log('member', member);
  return (
    <Container>
      <Content>
        <List>
          {(member && member.email) ?
            <View>
              <Content style={styles.greeting}>
                <ProfilePicture />
                <Header
                  style={styles.header}
                  title={`Yo! ${member.firstName}`}
                  content={`You have ${member.credits} credits`}
                />
              </Content>
              <ListItem onPress={Actions.search} icon>
                <Left>
                  <Icon name="search" />
                </Left>
                <Body>
                  <Text>Search Players</Text>
                </Body>
              </ListItem>
              <ListItem onPress={Actions.profilePage} icon>
                <Left>
                  <Icon name="person-add" />
                </Left>
                <Body>
                  <Text>My Profile</Text>
                </Body>
              </ListItem>
              <ListItem onPress={buy} icon>
                <Left>
                  <Icon name="add" />
                </Left>
                <Body>
                  <Text>Buy Credits</Text>
                </Body>
              </ListItem>
              <ListItem onPress={Actions.commishBible} icon>
                <Left>
                  <Icon name="compass" />
                </Left>
                <Body>
                  <Text>Commish Courts Bible</Text>
                </Body>
              </ListItem>
              <ListItem onPress={logout} icon>
                <Left>
                  <Icon name="power" />
                </Left>
                <Body>
                  <Text>Logout</Text>
                </Body>
              </ListItem>
            </View>
        :
            <View>
              <Content styles={styles.greeting}>
                <Header
                  title="Commish Courts"
                  content="Please login to gain extra access"
                />
              </Content>

              <ListItem onPress={Actions.login} icon>
                <Left>
                  <Icon name="power" />
                </Left>
                <Body>
                  <Text>Login</Text>
                </Body>
              </ListItem>
              <ListItem onPress={Actions.signUp} icon>
                <Left>
                  <Icon name="add-circle" />
                </Left>
                <Body>
                  <Text>Sign Up</Text>
                </Body>
              </ListItem>
              <ListItem onPress={Actions.forgotPassword} icon>
                <Left>
                  <Icon name="help-buoy" />
                </Left>
                <Body>
                  <Text>Forgot Password</Text>
                </Body>
              </ListItem>
            </View>
        }
        </List>
      </Content>
    </Container>
  );
};
const styles = StyleSheet.create({
  greeting: {
    marginLeft: 20,
  },
  header: {
    textAlign: 'center',
  },
});

Profile.propTypes = {
  member: PropTypes.shape({}),
  logout: PropTypes.func.isRequired,
  buy: PropTypes.func,
};

Profile.defaultProps = {
  member: {},
};

export default Profile;
