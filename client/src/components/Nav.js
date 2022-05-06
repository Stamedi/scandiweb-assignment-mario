import React, { Component } from 'react';
import Dropdown from './Dropdown';
import logo from '../images/brand_icon.svg';
import emptyCart from '../images/empty_cart.svg';
import currency_open from '../images/currency_open.svg';
import currency_close from '../images/currency_close.svg';
import CartDropdown from './CartDropdown';
import DataContext from '../context';
import NavCategories from './NavCategories';
import propTypes from 'prop-types';

export default class Nav extends Component {
  constructor(props) {
    super(props);


  }

  render() {
    const { currentCurrency, itemAmountCart } = this.context;
    return (
      <div className="navbar" ref={this.ref}>
        <div className="navbar__container">
          <div className="navbar__left">
            <NavCategories />
          </div>
          <div className="navbar__middle">
            <img src={logo} alt="Logo" />
          </div>
          <div className="navbar__right">
            <button onClick={this.context.openDropdown}>
              <p>{currentCurrency}</p>
              <img src={!this.context.isOpen ? currency_open : currency_close} alt="" className="currency_arrow" />
            </button>
            <Dropdown className="dropdown__index"/>
            <div className="navbar__right__cart" onClick={this.context.openCart}>
              <img src={emptyCart} alt="Cart" />

              {itemAmountCart !== 0 ? (
                <p className={itemAmountCart !== 0 && 'nav__right__cart__counter'}>{itemAmountCart}</p>
              ) : (
                ''
              )}
            </div>
            <CartDropdown currentCurrency={this.props.currentCurrency} />
          </div>
        </div>
      </div>
    );
  }
}

Nav.contextType = DataContext;

Nav.propTypes = {
  currentCurrency: propTypes.string.isRequired
}