import React, { Component } from 'react';
import ProductCart from './ProductCart';
import DataContext from '../context';
import propTypes from 'prop-types';

export default class CartPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      items: [],
      totalPrice: 0,
    };
  }

  async componentDidMount() {
    const items = (await JSON.parse(localStorage.getItem('products')))
      ? JSON.parse(localStorage.getItem('products'))
      : [];
    this.setState({
      items: items,
    });

    const total = this.state.items.map((item) =>
      item.prices
        .filter((price) => price.currency.symbol === this.props.currentCurrency && price.amount)
        .map((price) => price.amount)
    );
    const amounts = this.state.items.map((item) => item.amount);
    let sum = 0;
    for (let i = 0; i < total.length; i++) {
      sum += total[i] * amounts[i];
    }
    this.setState({ totalPrice: sum });
  }

  async componentDidUpdate(prevProps, prevState) {
    const items = (await JSON.parse(localStorage.getItem('products')))
      ? JSON.parse(localStorage.getItem('products'))
      : [];
    if (prevState.items.length !== items.length) {
      this.setState({
        items: items,
      });
    }

    if (prevState.items !== this.state.items || prevProps.currentCurrency !== this.props.currentCurrency) {
      const total = this.state.items.map((item) =>
        item.prices
          .filter((price) => price.currency.symbol === this.props.currentCurrency && price.amount)
          .map((price) => price.amount)
      );

      const amounts = this.state.items.map((item) => item.amount);
      let sum = 0;
      for (let i = 0; i < total.length; i++) {
        sum += total[i] * amounts[i];
      }
      this.setState({ totalPrice: sum });
    }
    const currentAmount = JSON.stringify(items.map((item) => item.amount));
    const prevAmount = JSON.stringify(this.state.items.map((item) => item.amount));
    if (prevAmount !== currentAmount) {
      this.setState({
        items: items,
      });
    }
  }

  render() {
    return (
      <div className="cart-page">
        <h1>CART</h1>
        <ProductCart/>
        <div className="cart-page__result">
          <p>Tax: <span>{this.context.currentCurrency}{(this.state.totalPrice * 0.075).toFixed(2)}
          </span></p>
          <p className='result-qty'>Qty: <span>{this.context.itemAmountCart}</span></p>
          <p>Total: <span>{this.context.currentCurrency}{this.state.totalPrice.toFixed(2)}
          </span></p>
          <button>ORDER</button>
        </div>
      
      </div>
    );
  }
}

CartPage.contextType = DataContext;

CartPage.propTypes = {
  currentCurrency: propTypes.string.isRequired
}