import React, { Component } from 'react';
import plus_square from '../images/plus_square.svg';
import minus_square from '../images/minus_square.svg';
import DataContext from '../context';
import vector_right from '../images/vector_right.svg';
import vector_left from '../images/vector_left.svg';

export default class ProductCart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      currentCurrency: '$',
      selectedAttr: '',
    };

    this.incrGallery = this.incrGallery.bind(this);
    this.decrGallery = this.decrGallery.bind(this);
  }

  incrGallery(currentItem) {
    if ((currentItem.gallery.length - 1) > currentItem.galleryIndex) {
      currentItem.galleryIndex = ++currentItem.galleryIndex
      const index = this.state.items
      .findIndex((item) => item.genItemId === currentItem.genItemId)
      this.state.items.splice(index, 1, currentItem)
      this.setState({
        items: this.state.items
      })
      localStorage.setItem('products',JSON.stringify(this.state.items))
    }
  }

  decrGallery(currentItem) {
    if (currentItem.galleryIndex !== 0) {
      currentItem.galleryIndex = --currentItem.galleryIndex
      const index = this.state.items
      .findIndex((item) => item.genItemId === currentItem.genItemId)
      this.state.items.splice(index, 1, currentItem)
      console.log(currentItem.galleryIndex)
      this.setState({
        items: this.state.items
      })
      localStorage.setItem('products',JSON.stringify(this.state.items))
    }
  }


  async componentDidMount() {
    const items = (await JSON.parse(localStorage.getItem('products')))
      ? JSON.parse(localStorage.getItem('products'))
      : [];
    this.setState({
      items: items,
    });

    this.setState({
      currentCurrency: JSON.parse(localStorage.getItem('currency')),
    });
  }

  async componentDidUpdate(prevProps, prevState) {
    const itemsString = JSON.stringify(this.state.items)
    if (itemsString !== JSON.stringify(prevState.items)) {
      localStorage.setItem('products', itemsString)
    }

    const items = (await JSON.parse(localStorage.getItem('products')))
      ? JSON.parse(localStorage.getItem('products'))
      : [];
    if (prevState.items.length !== items.length) {
      this.setState({
        items: items,
      });
    }

    if (this.state.currentCurrency !== JSON.parse(localStorage.getItem('currency'))) {
      this.setState({
        currentCurrency: JSON.parse(localStorage.getItem('currency')),
      });
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
    const { items, currentCurrency } = this.state;
    const { removeFromCart, increaseAmount } = this.context;
    return (
      <div className='product-cart__wrapper'>
        {items.map((item) => (
          <div
            key={JSON.stringify(item.attributeList.map((attribute) => attribute.e))}
            className="product-cart__container">
            <div className="product-cart__l-side">
              <div className="product-cart__l-side__title">
                <h2>{item.brand}</h2>
                <h3>{item.name}</h3>
              </div>

              <div className="product-cart__l-side__price">
                {item.prices.map(
                  (price) =>
                    price.currency.symbol === currentCurrency && (
                      <p key={price.currency}>{`${price.currency.symbol} ${price.amount}`}</p>
                    )
                )}
              </div>

              {item.attributeList.map((attribute) => (
                <div key={attribute.index} className="cart__attribute__container">
                  <p>{attribute.id.toUpperCase()}:</p>
                  <div key={attribute.index} className="product-cart__l-side__size">
                    {!attribute.e.includes('#') ? (
                      <p>{attribute.e}</p>
                    ) : (
                      <div className="attribute-color__cart-page" style={{ background: attribute.e }}></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="product-cart__r-side">
              <div className="product-cart__r-side__incr-decr">
                <button onClick={() => increaseAmount(item)}>
                  <img src={plus_square} alt="" />
                </button>
                <p>{item.amount}</p>
                <button onClick={() => removeFromCart(item)}>
                  <img src={minus_square} alt="" />
                </button>
              </div>
              <div className="product-img-container">
              <div className="product-img">
                {item.gallery.length > 1 ? (
                  <div className='image_arrows'>
                    <img src={vector_left} alt="" className="vector-left" onClick={() => this.decrGallery(item)} />
                    <img src={vector_right} alt="" className="vector-right" onClick={() => this.incrGallery(item)}/>
                  </div>
                ) : (
                  <></>
                )}
                <img src={item.gallery[item.galleryIndex]} alt="" />
              </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

ProductCart.contextType = DataContext;
