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
      filteredAttributes: [],
      showAttributes: false,
    };
  }

  returnFilters = async () => {
    const stringifyArr = this.state.attributes.map((attribute) => JSON.stringify(attribute))
    const filterArr = [...new Set(stringifyArr)]
    if (this.state.categ === 'tech' || this.state.categ === 'all') {
      filterArr.splice(filterArr.length - 2, 2)
    }
    this.setState({
      filteredAttributes: filterArr.map((single) => JSON.parse(single))
    })
    console.log(this.state.filteredAttributes)
  }

  changeUrl = (e) => {
    this.props.history.replace({
      
    })
    console.log(e.target.value)
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

  async componentDidUpdate(prevProps) {
    if (this.props.match.params.category !== prevProps.match.params.category) {
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
    const { categ, filteredAttributes } = this.state;
    return (
      <div className="plp">
        <div className="sidebar-container">
          Filters
          <select>
            {filteredAttributes.map((attribute) => 
              (attribute.map((attrValues, index) => (
                JSON.stringify(attrValues).includes('Yes') || JSON.stringify(attrValues).includes('#') ? (
                  ''
                )  
                :
                (
                  <optgroup key={index} label={attrValues.id}>
                    {attrValues.items.map((item) =>(
                      <option to onClick={(e) => this.changeUrl(e)} value={item.value}  key={item.id}>
                        {item.value}
                      </option>)
                    )}
                  </optgroup>
                )
            )))
            )}
          </select>

          {filteredAttributes.map((attribute) => (
            attribute.map((attrValues) => (
              JSON.stringify(attrValues).includes('#') && (
                <label key={attrValues.id}>
                  {attrValues.id}
                  <div className="attribute-color-container">
                  {attrValues.items.map((attribute) => (
                    <div key={attribute.id}>
                      <input
                      name={attribute.id}
                      value={attribute.value}
                      type="radio"
                      />
                      <div className="attribute-color" style={{ background: attribute.value }}></div>
                    </div>
                  ))}
                  </div>
                </label>
              )
            ))
          ))}

          {filteredAttributes.map((attribute) => (
            attribute.map((attrValues) => (
              JSON.stringify(attrValues).includes('Yes') && (
                <div key={attrValues.id}>
                  {attrValues.id}
                  {attrValues.items.map((attribute, index) => (
                    <div key={index}>
                      <input
                      id={`${index}`}
                      name={attribute.id}
                      value={attribute.value}
                      type="radio"
                      />
                      <label htmlFor={`${index}`} >{attribute.value}</label>
                    </div>
                  ))}
                </div>
              )
            ))
          ))}
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



