import React, { Component } from 'react';
import DOMPurify from 'dompurify';
import DataContext from '../context';
import getProduct from '../queries/getProduct';
import propTypes from 'prop-types';

export default class BodyPDP extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentProduct: '',
      currentImg: '',
      gallery: [],
      attributes: [],
      prices: [],
      attributeList: [],
    };


    this.descriptionRef = React.createRef();
    this.setCurrentImage = this.setCurrentImage.bind(this);
  }

  setCurrentImage(currentimg) {
    this.setState({
      currentImg: currentimg,
    });
  }

   selectedAttribute(e, index, id) {
    const findDuplicate = this.state.attributeList.map((item) => item.index).indexOf(index);

    if (findDuplicate !== -1) {
      const filteredOut = this.state.attributeList.filter((item) => item.index !== index);
      this.setState({
        attributeList: filteredOut.concat({ e, index, id }),
      });
    } else {
      this.setState({ attributeList: [...this.state.attributeList, { e, index, id }] });
    }
  }

  async componentDidMount() {
    const res = await (await getProduct(this.props.match.params.id)).product;
    this.setState({
      currentProduct: res,
      gallery: res.gallery,
      attributes: res.attributes,
      prices: res.prices,
    });

    this.descriptionRef.current.innerHTML = DOMPurify
    .sanitize(this.state.currentProduct.description);

  }

  render() {
    const { addToCart, currentCurrency } = this.context;
    const { currentImg, currentProduct, gallery, attributes, prices } = this.state;

    return (
      <div className="pdp">
        <div className="pdp__l-sidebar">
          {gallery.length > 1 &&
            gallery.map((pic) => 
            <img onClick={() => this.setCurrentImage(pic)} key={pic} src={pic} alt="" />
            )
          }
        </div>

        <div className="pdp__main-pic">
          <img src={currentImg.length > 0 ? currentImg : gallery[0]} alt="" />
        </div>

        <div className="pdp__r-sidebar">
          <div className="pdp__r-sidebar__title">
            <h2>{currentProduct.brand}</h2>
            <h3>{currentProduct.name}</h3>
          </div>

          {attributes.map((attribute, index) => (
            <div key={attribute.id} className="pdp__r-sidebar__attribute__container">
              <p>{attribute.id.toUpperCase()}:</p>

              <div className="pdp__r-sidebar__attribute">
                {attribute.items.map((item) =>
                  item.value.includes('#') ? (
                    <label key={item.id}>
                      <input
                        name={attribute.id}
                        value={item.value}
                        type="radio"
                     
                        onClick={(e) => this.selectedAttribute(e.target.value, index, attribute.id )}
                      />
                      <div className="attribute-color" style={{ background: item.value }}></div>
                    </label>
                  ) : (
                    <label key={item.id} className="default__attributes">
                      <input
                        name={attribute.id}
                        value={item.value}
                        type="radio"
                
                        onClick={(e) => this.selectedAttribute(e.target.value, index, attribute.id)}
                      />
                      <div className="attribute">{item.value}</div>
                    </label>
                  )
                )}
              </div>
            </div>
          ))}
          <div className="pdp__r-sidebar__price">
            <p>PRICE:</p>
            <span>
              {prices.map(
                (price) => price.currency.symbol === currentCurrency && `${price.currency.symbol} ${price.amount}`
              )}
            </span>
          </div>
          
          {currentProduct.inStock === true ? 
            <button className="pdp__r-sidebar__button" onClick={() =>
              addToCart(currentProduct, this.state.attributeList.map((attributes) => attributes)
              .sort((a, b) => a.index - b.index))}>ADD TO CART
            </button> 
            :
            <button className="pdp__r-sidebar__button">OUT OF STOCK</button>
          }

          

          <div ref={this.descriptionRef} className="pdp__r-sidebar__description"></div>
        </div>
      </div>
    );
  }
}

BodyPDP.contextType = DataContext;


BodyPDP.propTypes = {
  match: propTypes.shape({
    params: propTypes.shape({
      id: propTypes.string
    })
  }),
}