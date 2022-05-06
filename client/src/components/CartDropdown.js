import React, { Component } from 'react';
import plus_square from '../images/plus_square.svg';
import minus_square from '../images/minus_square.svg';
import { Link } from 'react-router-dom';
import DataContext from '../context';
import propTypes from 'prop-types';

export default class CartDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      totalPrice: 0,
    };

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }


  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.context.openCart()
    }
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

    if (this.context.isOpenCart) {
      document.addEventListener("mousedown", this.handleClickOutside);
    } else {
      document.removeEventListener("mousedown", this.handleClickOutside);
    }
  }

  render() {
    const { items, totalPrice } = this.state;
    const { isOpenCart, removeFromCart, increaseAmount } = this.context;
    const { currentCurrency } = this.props;
    if (isOpenCart) {
      return (
        <div ref={this.wrapperRef}>
          <div className="cart-dropdown__container">
            <div className="cart-dropdown__title">
              <span>My Bag</span>, {this.context.itemAmountCart} items
            </div>

            <div className={items.length > 3 ? 'cart-dropdown__product__list' : ''}>
              {items.map((item) => (
                <div
                  key={JSON.stringify(item.attributeList.map((attribute) => attribute.e))}
                  className="cart-dropdown__product"
                >
                  <div className="cart-dropdown__product__l-side">
                    <div className="cart-dropdown__product__l-side__title">
                      <h2>{item.brand}</h2>
                      <h2>{item.name}</h2>
                    </div>

                    <div className="cart-dropdown__product__l-side__price">
                      {item.prices.map(
                        (price) =>
                          price.currency.symbol === currentCurrency && (
                            <p key={price.currency}>{`${price.currency.symbol} ${price.amount}`}</p>
                          )
                      )}
                    </div>

                    <div className="cart-dropdown__product__l-side__size">
                      {item.attributeList.map((attribute) => (
                        <div key={attribute.id} className="attribute__container">
                          <p>{attribute.id}:</p>
                          <div className="attributes__cart-dropdown">
                            {!attribute.e.includes('#') ? (
                              <p className="attribute-name">{attribute.e}</p>
                            ) : (
                              <div className="attribute-color__dropdown" style={{ background: attribute.e }}></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="cart-dropdown__product__r-side">
                    <div className="cart-dropdown__product__incr-decr">
                      <button onClick={() => increaseAmount(item)}>
                        <img src={plus_square} alt="" />
                      </button>
                      <p>{item.amount}</p>
                      <button onClick={() => removeFromCart(item)}>
                        <img src={minus_square} alt="" />
                      </button>
                    </div>
                    <div className="cart-dropdown__product-img">
                      <img src={item.gallery[0]} alt="" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-dropdown__total">
              <div className="cart-dropdown__total__l-side">
                <p>Total</p>
              </div>

              <p>{`${this.props.currentCurrency} ${totalPrice.toFixed(2)}`}</p>
            </div>

            <div className="cart-dropdown__final-buttons">
              <Link to="/cart/cartpage">
                <div className="cart-dropdown__final-buttons__white">
                  <button onClick={this.context.openCart}>VIEW BAG</button>
                </div>
              </Link>

              <div className="cart-dropdown__final-buttons__green">
                <button onClick={this.context.openCart}>CHECK OUT</button>
              </div>
            </div>
          </div>
        </div>
      );
    } else return <div></div>;
  }
}

CartDropdown.contextType = DataContext;

CartDropdown.propTypes = {
  currentCurrency: propTypes.string.isRequired
}