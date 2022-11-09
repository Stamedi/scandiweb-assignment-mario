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
      urlId: '',
      urlVal: '',
      selectedRadio: null,
      selectedAttr: null,
    };

    this.handleChangeUrl = this.handleChangeUrl.bind(this);
    this.setDefaultUrl = this.setDefaultUrl.bind(this);
    this.changeUrlColor = this.changeUrlColor.bind(this);
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
    // console.log(this.state.filteredAttributes)
  }

  handleChangeUrl = async (e, id, itemId) => {
    // console.log(new URL(window.location))
    const url = new URL(window.location)
    if (url.searchParams == '') {
      url.searchParams.set(id ,e.target.value)
      window.history.pushState(null, null, url)
      this.setState({
        urlId: id,
        urlVal: e.target.value,
      })
    } else {
      url.searchParams.delete(this.state.urlId)
      url.searchParams.set(id ,e.target.value)
      window.history.pushState(null, null, url)
      this.setState({
        urlId: id,
        urlVal: e.target.value,
      })
    }

    this.setState({
      selectedAttr: id,
      selectedRadio: itemId
    })
    console.log(id)

    // const val = document.querySelectorAll('.attribute-color');
    // val.forEach((el) => { el.ariaChecked = false;})
    // console.log(url.searchParams.get(id))
    // console.log(url.search)
    // history.pushState
    // console.log(id, e.target.value)
  }

  setDefaultUrl = async () => {
    const url = new URL(window.location)
    this.setState({
      urlId: '',
      urlVal: '',
    })
      window.history.pushState(null, null, url.origin + url.pathname)

  }

  changeUrlColor = (value, id) => {
    console.log(value, id)
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

    // const url = new URL(window.location)
    // url.searchParams.get(id ,e.target.value)
 
  }

  async componentDidUpdate(prevProps, prevState) {
    if (this.props.match.params.category !== prevProps.match.params.category) {
      const categ = this.props.match.params.category;
      // if (this.state.categ !== categ) {
        const products = await (await getCategory(categ)).category.products.map((product) => product);
  
        this.setState({
          products,
          categ,
          attributes: products.map((product) => product.attributes)
        });

        const url = new URL(window.location)
        this.setState({
          urlId: '',
          urlVal: '',
        })
          window.history.pushState(null, null, url.origin + url.pathname)
      // }
      this.returnFilters()
    }



    if (this.state.urlId !== prevState.urlId) {
      const searchParams = new URLSearchParams(window.location.search)
      const keys = searchParams.keys();
      const values = searchParams.values();
      if (searchParams !== '') {
        for (const key of keys) this.setState({ 
          urlId: key
        })
        for (const value of values) this.setState({ 
          urlVal: value
        })
      } else {
        this.setState({ 
          urlId : '',
          urlVal: ''
        })
      }

    }
  }

  render() {
    const { categ, filteredAttributes } = this.state;
    return (
      <div className="plp">
        <div className="sidebar-container pdp__r-sidebar__attribute__container filters-container">
          <p>FILTERS:</p>
          <select>
            <option onClick={() => this.setDefaultUrl()} value='' >All</option>
            {filteredAttributes.map((attribute) => 
              (attribute.map((attrValues, index) => (
                JSON.stringify(attrValues).includes('Yes') || JSON.stringify(attrValues).includes('#') ? (
                  ''
                )  
                :
                (
                  <optgroup key={index} label={attrValues.id}>
                    {attrValues.items.map((item) =>(
                      <option onClick={(e) => this.handleChangeUrl(e, attrValues.id)} value={item.value}  key={item.id}>
                        {item.value}
                      </option>)
                    )}
                  </optgroup>
                )
            )))
            )}
          </select>


          {filteredAttributes.map((attributes) => (
            attributes.map((attribute) => (
              JSON.stringify(attribute).includes('#') ?
            (<div key={attribute.id} className="pdp__r-sidebar__attribute__container">
            <p>{attribute.id.toUpperCase()}:</p>
            <div className="pdp__r-sidebar__attribute">
              {
                attribute.items.map((item) =>
                  <label key={item.id} className="colors__attribute">
                    <input
                      name={attribute.id}
                      value={item.value}
                      type="radio"
                      onChange={(e) => this.handleChangeUrl(e, attribute.id, item.id )}
                      checked={this.state.selectedRadio === item.id && this.state.selectedAttr === attribute.id}
                    />
                    <div className="attribute-color" style={{ background: item.value }}></div>
                  </label>
              )}
              </div>
              </div>)
              : JSON.stringify(attribute).includes('Yes') ? (
                <div key={attribute.id} className="pdp__r-sidebar__attribute__container">
                  <p>{attribute.id.toUpperCase()}:</p>
                  <div className="pdp__r-sidebar__attribute-checkbox">
                    {
                      attribute.items.map((item) =>
                        <label key={item.id} className="default__attributes-checkbox">
                        <input
                          type="radio"
                          name={attribute.id}
                          value={item.value}
                          onChange={(e) => this.handleChangeUrl(e, attribute.id, item.id )}
                          checked={this.state.selectedRadio === item.id && this.state.selectedAttr === attribute.id}
                        />
                        <div className="attribute-checkbox-label">{item.value}</div>
                        </label>
                    )}
                    </div>
                  </div>
              ) : ''
            ))
          )
          )}

  
          
        </div>
        <h1 className="plp__title">{categ.charAt(0).toUpperCase() + categ.slice(1)}</h1>
        <div className="plp__products">
          <Product products={this.state.products} urlId={this.state.urlId} urlVal={this.state.urlVal}  />
        </div>
      </div>
    );
  }
}

BodyPLP.contextType = DataContext;

BodyPLP.propTypes = {
  match: propTypes.shape({
    params: propTypes.shape({
      category: propTypes.string,
      urlId: propTypes.string
    })
  }),
}





// {filteredAttributes.map((attribute) => (
//   attribute.map((attrValues) => (
//     JSON.stringify(attrValues).includes('#') && (
//       <label key={attrValues.id}>
//         {attrValues.id}
//         <div className="attribute-colors">
//         {attrValues.items.map((attribute) => (
//           <div key={attribute.id} onClick={() => this.changeUrlColor(attribute.value, attribute.id )}>
//             <input
//             name={attribute.id}
//             value={attribute.value}
//             type="radio"
//             />
//             <div className="attribute-color" style={{ background: attribute.value }}></div>
//           </div>
//         ))}
//         </div>
//       </label>
//     )
//   ))
// ))}

// {filteredAttributes.map((attribute) => (
//   attribute.map((attrValues) => (
//     JSON.stringify(attrValues).includes('Yes') && (
//       <div key={attrValues.id}>
//         {attrValues.id}
//         {attrValues.items.map((attribute, index) => (
//           <div key={index}>
//             <input
//             id={`${index}`}
//             name={attribute.id}
//             value={attribute.value}
//             type="radio"
//             />
//             <label htmlFor={`${index}`} >{attribute.value}</label>
//           </div>
//         ))}
//       </div>
//     )
//   ))
// ))}