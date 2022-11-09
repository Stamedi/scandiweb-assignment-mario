import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import DataContext from '../context';
import propTypes from 'prop-types';

export default class Product extends Component {
  constructor(props) {
    super(props);

    this.state = {
      urlPropsKey: '',
      urlPropsVal:'',
    };
  }

  componentDidMount() {
    // const url = new URL(window.location);
    const searchParams = new URLSearchParams(window.location.search)
    const keys = searchParams.keys();
    const values = searchParams.values();

    for (const key of keys) this.setState({ 
      urlPropsKey: key
    })
    for (const value of values) this.setState({ 
      urlPropsVal: value
    })

  }

  componentDidUpdate(prevProps) {
    if (this.props.urlVal !== prevProps.urlVal) {
      const searchParams = new URLSearchParams(window.location.search)
      const keys = searchParams.keys();
      const values = searchParams.values();
      if (searchParams !== '') {
        for (const key of keys) this.setState({ 
          urlPropsKey: key
        })
        for (const value of values) this.setState({ 
          urlPropsVal: value
        })
      }
      if (this.props.urlVal === '') {
        this.setState({ 
          urlPropsKey : '',
          urlPropsVal: ''
        })
      }
    }


  }

  render() {
    const { products } = this.props;
    const { setCurrentProduct, currentCurrency, addToCartPLP } = this.context;
    return (
      <>
        {
          this.state.urlPropsVal == '' ?
          (products.map((singprod) =>
          (singprod.inStock === true ? (
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
          ))
        ))
        :
        (
          products.map((singprod) => (JSON.stringify((singprod.attributes.map((attribute) => attribute.id)).includes(this.state.urlPropsKey) && JSON.stringify(singprod.attributes.map((attribute) => attribute.items))).includes(this.state.urlPropsVal)) &&
          (singprod.inStock === true ? (
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
        ))
        ))
      }
      </>
    );
  }
}

Product.contextType = DataContext;

Product.propTypes = {
  products: propTypes.array,
  urlVal: propTypes.string
}

