import React from 'react';
import PropTypes from 'prop-types';
import Rating from 'react-native-rating';
import { CheckBox } from 'react-native-elements'
import { Easing } from 'react-native';
import { Container, Content, Form, Item, Label, Input, Text, Button } from 'native-base';
import { Actions } from 'react-native-router-flux';
import Loading from './Loading';
import Messages from './Messages';
import Header from './Header';
import Spacer from './Spacer';

import {evaluationSubmit} from '../../actions/member';

const images = {
  starFilled: require('../../images/filled-star.png'),
  starUnfilled: require('../../images/empty-star.png')
}

class EvalForm extends React.Component {
  static propTypes = {
    member: PropTypes.shape({
      email: PropTypes.string,
    }),
    error: PropTypes.string,
  }

  static defaultProps = {
    error: null,
    member: {},
  }

  constructor(props) {
    super(props);
    this.state = {
      email: (props.member && props.member.email) ? props.member.email : '',
      password: '',
      checked: true,
      personalRating: '',
      postRating: '',
      ballHandlingRating: '',
      threePointRating: '',
      multiplePerWeek: '',
      oncePerWeek: '',
      infrequently: '',
      professionalLevel: '',
      collegeLevel: '',
      highSchoolLevel: '',
      leagueBall: '',
      pickup: '',
      recLeague: '',
      privateGames: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(name, val){
    this.setState({
      ...this.state,
      [name]: val,
    });
  }

  handleSubmit(){
    const details = this.state
    this.props.handleSubmit(details)
  }

  render() {
    const { loading, error } = this.props;
    // Loading
    if (loading) return <Loading />;

    return (
      <Container>
        <Content padder>
          <Header
            title="Commish Courts"
            content="Evaluation Form"
          />
          {error && <Messages message={error} />}
          <Form>
            <Item stackedLabel>
              <Label>How good do you think you are?</Label>
              <Spacer size={20} />
              <Rating
                initial={0}
                onChange={rating => this.handleChange('personalRating', rating)}
                selectedStar={images.starFilled}
                unselectedStar={images.starUnfilled}
                config={{
                  easing: Easing.inOut(Easing.ease),
                  duration: 350
                }}
                stagger={80}
                maxScale={1.4}
                starStyle={{
                  width: 40,
                  height: 40
                }}
              />
              <Spacer size={20} />
            </Item>
            <Item stackedLabel>
              <Label>How's your post game?</Label>
              <Spacer size={20} />
              <Rating
                onChange={rating => this.handleChange('postRating', rating)}
                selectedStar={images.starFilled}
                unselectedStar={images.starUnfilled}
                config={{
                  easing: Easing.inOut(Easing.ease),
                  duration: 350
                }}
                stagger={80}
                maxScale={1.4}
                starStyle={{
                  width: 40,
                  height: 40
                }}
              />
              <Spacer size={20} />
            </Item>
            <Item stackedLabel>
              <Label>How's your ball handling?</Label>
              <Spacer size={20} />

              <Rating
                onChange={rating => this.handleChange('ballHandlingRating', rating)}
                selectedStar={images.starFilled}
                unselectedStar={images.starUnfilled}
                config={{
                  easing: Easing.inOut(Easing.ease),
                  duration: 350
                }}
                stagger={80}
                maxScale={1.4}
                starStyle={{
                  width: 40,
                  height: 40
                }}
              />
              <Spacer size={20} />
            </Item>
            <Item stackedLabel>
              <Label>How's your (high school line) 3 point shooting?</Label>
              <Spacer size={20} />
              <Rating
                onChange={rating => this.handleChange('threePointRating', rating)}
                selectedStar={images.starFilled}
                unselectedStar={images.starUnfilled}
                config={{
                  easing: Easing.inOut(Easing.ease),
                  duration: 350
                }}
                stagger={80}
                maxScale={1.4}
                starStyle={{
                  width: 40,
                  height: 40
                }}
              />
              <Spacer size={20} />
            </Item>
            <Item stackedLabel>
              <Label>How often do you play?</Label>
              <CheckBox
                title='Multiple times a week'
                checked={this.state.multiplePerWeek}
                onPress={() => this.handleChange('multiplePerWeek', !this.state.multiplePerWeek)}
                checkedColor='black'
              />
               <CheckBox
                title='Once a week'
                checked={this.state.oncePerWeek}
                onPress={() => this.handleChange('oncePerWeek', !this.state.oncePerWeek)}
                checkedColor='black'
              />
              <CheckBox
                title='Once a month'
                checked={this.state.oncePerMonth}
                onPress={() => this.handleChange('oncePerMonth', !this.state.oncePerMonth)}
                checkedColor='black'
              />
              <CheckBox
                title='Less than once a month'
                checked={this.state.infrequently}
                onPress={() => this.handleChange('infrequently', !this.state.infrequently)}
                checkedColor='black'
                left
              />
            </Item>

            <Item stackedLabel>
              <Label>Have you played at the following levels?</Label>
                            <CheckBox
                title='Professional'
                checked={this.state.professionalLevel}
                onPress={() => this.handleChange('professionalLevel', !this.state.professionalLevel)}
                checkedColor='black'
              />
               <CheckBox
                title='Collegiate'
                checked={this.state.collegeLevel}
                onPress={() => this.handleChange('collegeLevel', !this.state.collegeLevel)}
                checkedColor='black'
              />
              <CheckBox
                title='High School'
                checked={this.state.highSchoolLevel}
                onPress={() => this.handleChange('highSchoolLevel', !this.state.highSchoolLevel)}
                checkedColor='black'
              />
              <CheckBox
                title='League as a kid'
                checked={this.state.leagueBall}
                onPress={() => this.handleChange('leagueBall', !this.state.leagueBall)}
                checkedColor='black'
                left
              />
            </Item>
            <Item stackedLabel>
              <Label>As an adult have you played at any of the following?</Label>
              <CheckBox
                title='Pickup games'
                checked={this.state.pickup}
                onPress={() => this.handleChange('pickup', !this.state.pickup)}
                checkedColor='black'
              />
               <CheckBox
                title='Organized rec leagues'
                checked={this.state.recLeague}
                onPress={() => this.handleChange('recLeague', !this.state.recLeague)}
                checkedColor='black'
              />
              <CheckBox
                title='Private group games'
                checked={this.state.privateGames}
                onPress={() => this.handleChange('privateGames', !this.state.privateGames)}
                checkedColor='black'
              />
            </Item>
            <Spacer size={20} />
            <Button block onPress={this.handleSubmit}>
              <Text>Submit</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default EvalForm;
