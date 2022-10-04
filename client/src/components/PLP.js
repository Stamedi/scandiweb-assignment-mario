import React, { Component } from 'react';
import Product from './Product';
import DataContext from '../context';
import getCategory from '../queries/getCategory';
import propTypes from 'prop-types';

export default class BodyPLP extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      categ: '',
      attributes: [],
      showAttributes: false,
    };
  }

  returnFilters = async () => {
    await this.state.products.map((product) => product.attributes.map((attribute) => {
      console.log(attribute)
    }))
    
  }

  async componentDidMount() {
    if (this.props.match.params.category === undefined) {
      const categ = 'all'
      const products = await (await getCategory(categ)).category.products.map((product) => product);
      this.setState({
        products,
        categ,
        attributes: products.map((product) => product.attributes)
      });
      this.returnFilters()
      // console.log(products.map((product) => product.attributes.map((attribute) => attribute.id)))
    }

    if (this.props.match.params.category) {
      const categ = this.props.match.params.category;
      const products = await (await getCategory(categ)).category.products.map((product) => product);
      this.setState({
        products,
        categ,
        attributes: products.map((product) => product.attributes)
      });
      this.returnFilters()
    }
 
  }

  async componentDidUpdate() {
    if (this.props.match.params.category) {
      const categ = this.props.match.params.category;
      if (this.state.categ !== categ) {
        const products = await (await getCategory(categ)).category.products.map((product) => product);
  
        this.setState({
          products,
          categ,
          attributes: products.map((product) => product.attributes)
        });
      }

      this.returnFilters()
    }
  }

  render() {
    const { categ, products } = this.state;
    return (
      <div className="plp">
        <div className="sidebar-container">
          Filters
          {products.map((product) => product.attributes.map((attribute, index) => (
            <div key={index} className="filter-container">
              <p>{attribute.id}</p>
              <div className="attribute-values">
                {attribute.items && attribute.items.map((item) =>
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
          )))}

          <button onClick={() => console.log(products.map((product) => product.attributes))}>Click Me</button>
        </div>
        <h1 className="plp__title">{categ.charAt(0).toUpperCase() + categ.slice(1)}</h1>
        <div className="plp__products">
          <Product products={this.state.products} />
        </div>
      </div>
    );
  }
}

BodyPLP.contextType = DataContext;

BodyPLP.propTypes = {
  match: propTypes.shape({
    params: propTypes.shape({
      category: propTypes.string
    })
  }),
}
