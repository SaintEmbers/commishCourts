
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Container, Content, Form, Item, Label, Input, Text, Button, View } from 'native-base';
import CalendarPicker from 'react-native-calendar-picker';
import { createGame } from '../actions/games';
import Spacer from '../components/Spacer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 0,
  },
  input: {
    fontSize: 20,
    marginBottom: 5,
  },
  day: {
    marginLeft: 15,
    marginBottom: 30,
    borderBottomColor: '#D9D5DC',
    borderBottomWidth: 1,
  },
  date: {
    fontSize: 30,
  },
});

class GameCreator extends React.Component {
  static propTypes = {
    createGame: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      date: '',
      time: '',
      location: '',
      isDatePickerVisible: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.showCalendar = this.showCalendar.bind(this);
  }


  onDateChange = (date) => {
    this.setState({ date, isDatePickerVisible: false });
  }
  handleSubmit = () => {
    const { location, time } = this.state;
    const day = this.state.date ? new Date(this.state.date.toString()) : '';
    const dateText = day && day.toDateString().slice(0, -5);
    this.props.createGame({ location, day: dateText, time });
  }
  handleChange = (type, value) => {
    this.setState({ [type]: value });
  }

  showCalendar = () => {
    this.setState({ isDatePickerVisible: true });
  }


  render() {
    const { isDatePickerVisible } = this.state;
    const date = this.state.date ? new Date(this.state.date.toString()) : '';
    const dateText = date && date.toDateString();

    return (
      <Container>
        <Content padder>
          {isDatePickerVisible ? <CalendarPicker onDateChange={this.onDateChange} /> :

          <View style={styles.container}>
            <Form>
              <TouchableOpacity onPress={this.showCalendar}>
                <View style={styles.day}>
                  <Text style={styles.input}>Day</Text>
                  <Text style={styles.date}>{dateText}</Text>
                </View>
              </TouchableOpacity>
              <Item stackedLabel>
                <Label style={styles.input}>Time</Label>
                <Input
                  onChangeText={v => this.handleChange('time', v)}
                />
              </Item>
              <Item stackedLabel>
                <Label style={styles.input}>Location</Label>
                <Input
                  onChangeText={v => this.handleChange('location', v)}
                />
              </Item>
              <Spacer size={20} />
              <Button block onPress={this.handleSubmit}>
                <Text>Set Game</Text>
              </Button>
            </Form>
          </View>
      }
        </Content>
      </Container>
    );
  }
}


export { GameCreator };
export default connect({}, { createGame })(GameCreator);
