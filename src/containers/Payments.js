import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, View, Switch, Platform } from 'react-native';
import { Container, Content, Text, Form, Item, Label, Input, Button } from 'native-base';
import { logout, getMemberData, buyCredits, registerForPushNotifications, addPaymentSource, makePayment, checkPaymentSource } from '../actions/member';

const stripe = require('stripe-client')('pk_test_UfgL0N81Mvt3R1kmrGHT45in');

const information = {
  card: {
    number: '4242424242424242',
    exp_month: '02',
    exp_year: '21',
    cvc: '999',
    name: 'Billy Joe',
  },
};


class PaymentsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      number: '4242424242424242',
      exp_month: '02',
      exp_year: '21',
      cvc: '999',
      name: 'Billy Joe',
      type: 'credit-card',
      count: 1,
    };
    this.makePayment = this.makePayment.bind(this);
    this.handleIncrement = this.handleIncrement.bind(this);
  }

  componentWillMount() {
    this.props.checkPaymentSource();
  }

  async makePayment() {
    const {
      number, exp_month, exp_year, cvc, name, type,
    } = this.state;

    const payInfo = {
      card: {
        number,
        exp_month,
        exp_year,
        cvc,
        name,
      },
    };
    const card = await stripe.createToken(payInfo);
    const token = card.id;
    console.log('props has payment', this.props.member.hasPaymentMethod);
    // send token to backend for processing
    console.log('token', token);
    if (!this.props.member.hasPaymentMethod) {
      console.log('add paymddndt sourec');
      const payment = await this.props.addPaymentSource({ token, type: 'credit-card' });
    }
    return this.props.makePayment({ amount: this.state.count });
  }


  handleChange(name, val) {
    this.setState({
      ...this.state,
      [name]: val,
    });
  }

  handleIncrement(type) {
    let { count } = this.state;
    if (type === 'increment') {
      count++;
    } else {
      count--;
      if (count < 0) { count = 0; }
    }
    this.setState({ count });
  }

  render() {
    return (
      <Container>
        <Content padder>
          <Text>Add {this.state.count} games</Text>
          <View style={styles.buttonZone}>
            <Button style={styles.incrementButton} block onPress={this.handleIncrement.bind(null, 'decrement')}>
              <Text>-</Text>
            </Button>
            <Button style={styles.incrementButton} block onPress={this.handleIncrement.bind(null, 'increment')}>
              <Text>+</Text>
            </Button>
          </View>
          <Form>
            <Item stackedLabel>
              <Label>Credit Card Information</Label>
              <Input
                autoCapitalize="none"
                value={this.state.number}
                keyboardType="numeric"
                onChangeText={v => this.handleChange('number', v)}
              />
            </Item>

            <Item stackedLabel>
              <Label>Month</Label>
              <Input
                autoCapitalize="none"
                value={this.state.exp_month}
                keyboardType="numeric"
                onChangeText={v => this.handleChange('exp_month', v)}
              />
            </Item>

            <Item stackedLabel>
              <Label>Year</Label>
              <Input
                autoCapitalize="none"
                value={this.state.exp_year}
                keyboardType="numeric"
                onChangeText={v => this.handleChange('exp_year', v)}
              />
            </Item>
            <Item stackedLabel>
              <Label>CVC</Label>
              <Input
                autoCapitalize="none"
                value={this.state.cvc}
                keyboardType="numeric"
                onChangeText={v => this.handleChange('cvc', v)}
              />
            </Item>
            <Button block onPress={this.makePayment} ><Text>PAY</Text></Button>
          </Form>
        </Content>

      </Container>
    );
  }
}

const styles = StyleSheet.create({
  buttonZone: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  incrementButton: {
    width: 50,
    marginRight: 20,

  },

});

const mapStateToProps = state => ({
  member: state.member || {},
});

const mapDispatchToProps = {
  memberLogout: logout,
  getMemberData,
  buyCredits,
  registerForPushNotifications,
  addPaymentSource,
  makePayment,
  checkPaymentSource,
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentsContainer);
