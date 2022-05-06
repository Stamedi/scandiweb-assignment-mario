import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DataContext from '../context';
import propTypes from 'prop-types';

export default class Product extends Component {
  render() {
    const { products } = this.props;
    const { setCurrentProduct, currentCurrency, addToCartPLP } = this.context;
    return (
      <>
        {products.map((singprod) =>
          singprod.inStock === true ? (
            <div key={singprod.id} className="product__container">
              <Link onClick={() => setCurrentProduct(singprod.id)} to={`/product/${singprod.id}`}>
                <img className="product__container__img" src={singprod.gallery[0]} alt="" />
              </Link>

              <div onClick={() => addToCartPLP(singprod)} className="product__cart"></div>

              <div className="product__content">
                <p className="product__content__title">{`${singprod.brand} ${singprod.name}`}</p>
                <p className="product__content__price">
                  {singprod.prices.map(
                    (price) => price.currency.symbol === currentCurrency && `${price.currency.symbol} ${price.amount}`
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div key={singprod.id} className="product__container__disabled">
              <Link to={`/product/${singprod.id}`}>
                <img className="product__container__img__disabled" src={singprod.gallery[0]} alt="" />
              </Link>
              <p>OUT OF STOCK</p>
              <div className="product__cart"></div>

              <div className="product__content__disabled">
                <p className="product__content__title__disabled">{`${singprod.brand} ${singprod.name}`}</p>
                <p className="product__content__price__disabled">
                  {singprod.prices.map(
                    (price) => price.currency.symbol === currentCurrency && `${price.currency.symbol} ${price.amount}`
                  )}
                </p>
              </div>
            </div>
          )
        )}
      </>
    );
  }
}

Product.contextType = DataContext;

Product.propTypes = {
  products: propTypes.array
}

