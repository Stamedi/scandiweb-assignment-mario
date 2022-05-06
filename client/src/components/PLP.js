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
    };
  }

  async componentDidMount() {
    if (this.props.match.params.category === undefined) {
      const categ = 'all'
      const products = await (await getCategory(categ)).category.products.map((product) => product);
      this.setState({
        products,
        categ,
      });
    }

    if (this.props.match.params.category) {
      const categ = this.props.match.params.category;
      const products = await (await getCategory(categ)).category.products.map((product) => product);
      this.setState({
        products,
        categ,
      });
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
        });
      }

    }
  }

  render() {
    const { categ } = this.state;
    return (
      <div className="plp">
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
