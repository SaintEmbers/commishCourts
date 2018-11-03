import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Permissions, Notifications } from 'expo';
import { Container, Content, Text, Button } from 'native-base';

import { Actions } from 'react-native-router-flux';
import { getGames, joinGame } from '../actions/games';
import { getMemberData, registerForPushNotifications } from '../actions/member';

const styles = StyleSheet.create({
  view: {
    marginBottom: 30,
  },
  cardsView: {
    marginTop: 10,
  },
  button: {
    flex: 0.9,
  },
});

class GamesContainer extends Component {
  static propTypes = {
    Layout: PropTypes.func.isRequired,
    games: PropTypes.shape({}),
    getGames: PropTypes.func.isRequired,
    userData: PropTypes.shape({}),
  }

  constructor(props) {
    super(props);
    this.state = {
      notification: {},
    };
  }

  componentWillMount() {
    this.props.getGames();
    this.props.getMemberData().then(() => {
      this.registerForPushNotifications();
    });
  }

  _handleNotification = (notification) => {
    this.setState({ notification });
  };

  comonentDidMount() {
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  async registerForPushNotifications() {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    const token = await Notifications.getExpoPushTokenAsync();
    // alert(`Heres yours token ${token}`)
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      console.log('ask for permissions');
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      console.log('ask for push');

      finalStatus = status;
    }
    console.log('finalStatus', finalStatus);
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      alert('you need to enable permissions in settings');
    }

    // Get the token that uniquely identifies this device
    // let token = await Notifications.getExpoPushTokenAsync();
    // console.log('token', token)
    // // POST the token to your backend server from where you can retrieve it to send push notifications.
    // const updates = {};
    // updates['/expoToken'] = token;
    // const UID = Firebase.auth().currentUser.uid;
    // console.log('usid', UID)
    // FirebaseRef.child(`users/${UID}`).update(updates)
  }

  createGame() {
    Actions.gameCreator();
  }

  joinGame(gameId) {
    const { userData } = this.props;
    const player = {
      name: `${userData.firstName}-${userData.lastName}`,
      list: userData.list,
      position: userData.position,
      rating: userData.rating,
    };
    this.props.joinGame({ gameId, userId: userData.uid, player });
  }

  makeTeams(gameId) {
    Actions.teamView({ gameId });
  }

  render() {
    const { Layout, games, userData } = this.props;
    const { isCommish } = userData;
    const cards = [];

    _.forIn(games.games, (value, key) => {
      cards.push(<Layout
        game={key}
        details={value}
        key={key}
        isCommish={isCommish}
        joinGame={this.joinGame.bind(this)}
        makeTeams={this.makeTeams.bind(this)}
      />);
    });

    const button = isCommish &&
      <Button
        block
        onPress={this.createGame}
        style={styles.button}
      >
        <Text>Create Game</Text>
      </Button>;
    return (
      <Container padder>
        <Content style={styles.view}>
          <View style={styles.cardsView}>
            {cards}
          </View>
          <View style={{
 flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
}}
          >
            <View style={{ flexDirection: 'row' }}>
              {button}
            </View>
          </View>
        </Content>
      </Container>

    );
  }
}

const mapStateToProps = state => ({
  userData: state.member || {},
  games: state.games || {},
});

export { GamesContainer };
export default connect(mapStateToProps, {
  getGames, getMemberData, joinGame, registerForPushNotifications,
})(GamesContainer);
