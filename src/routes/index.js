import React from 'react';
import { Scene, Tabs, Stack } from 'react-native-router-flux';
import { Icon } from 'native-base';

import DefaultProps from '../constants/navigation';
import AppConfig from '../constants/config';

import GamesContainer from '../containers/Games';
import GameCreator from '../containers/GameCreator';

import GameCard from '../components/GameCard';

import TeamView from '../containers/TeamView';

import SignUpContainer from '../containers/SignUp';
import SignUpComponent from '../components/SignUp';
import EvalFormContainer from '../containers/EvalForm';
import EvalFormComponent from '../components/EvalForm';

import LoginContainer from '../containers/Login';
import LoginComponent from '../components/Login';

import ForgotPassword from '../containers/ForgotPassword';

import UpdateProfileContainer from '../containers/UpdateProfile';
import UpdateProfileComponent from '../components/UpdateProfile';
import ProfileDetailsContainer from '../containers/ProfileDetails';

import MemberContainer from '../containers/Member';
import ProfileComponent from '../components/Profile';

import Bible from '../components/Bible';

import SearchContainer from '../containers/Search';

const Index = (
  <Stack>
    <Scene hideNavBar>
      <Tabs
        key="tabbar"
        swipeEnabled
        type="replace"
        showLabel={false}
        {...DefaultProps.tabProps}

      >
        <Stack
          key="profile"
          title="PROFILE"
          icon={() => <Icon name="contact" {...DefaultProps.icons} />}
          {...DefaultProps.navbarProps}
          navigationBarStyle={{ height: 0 }}
        >
          <Scene key="profileHome" component={MemberContainer} navigationBarStyle={{ backgroundColor: 'white', height: 0, display: 'none' }} titleStyle={{ color: 'white', fontSize: 25 }} Layout={ProfileComponent} />
          <Scene key="profilePage" navigationBarStyle={{ marginTop: -40 }} component={ProfileDetailsContainer} />
          <Scene key="commishBible" component={Bible} navigationBarStyle={{ marginTop: -40 }} />
          <Scene key="search" navigationBarStyle={{ marginTop: -40 }} component={SearchContainer} />
          <Scene
            back
            key="signUp"
            title="SIGN UP"
            {...DefaultProps.navbarProps}
            component={SignUpContainer}
            Layout={SignUpComponent}
          />
          <Scene
            back
            key="playerEvalForm"
            title="Player Details"
            {...DefaultProps.navbarProps}
            component={EvalFormContainer}
            Layout={EvalFormComponent}
            navigationBarStyle={{ marginTop: -40 }}
          />
          <Scene
            back
            key="login"
            title="LOGIN"
            {...DefaultProps.navbarProps}
            component={LoginContainer}
            Layout={LoginComponent}
          />
          <Scene
            back
            key="forgotPassword"
            title="FORGOT PASSWORD"
            {...DefaultProps.navbarProps}
            component={ForgotPassword}
          />
          <Scene
            back
            key="updateProfile"
            title="UPDATE PROFILE"
            {...DefaultProps.navbarProps}
            component={EvalFormContainer}
            Layout={EvalFormComponent}
          />
        </Stack>
        <Stack
          key="games"
          title="Games"
          icon={() => <Icon name="basketball" {...DefaultProps.icons} />}
          {...DefaultProps.navbarProps}
        >
          <Scene key="games" component={GamesContainer} Layout={GameCard} />
          <Scene key="gameCreator" component={GameCreator} />
          <Scene key="teamView" component={TeamView} />

        </Stack>

      </Tabs>
    </Scene>
  </Stack>
);

export default Index;
