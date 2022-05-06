import React, { Component } from 'react';
import Nav from './Nav';
import PLP from './PLP';
import PDP from './PDP';
import { Route, Switch } from 'react-router-dom';
import getCategories from '../queries/getCategories';
import getCategory from '../queries/getCategory';
import DataContext from '../context';
import BodyCartPage from './CartPage';
import { v4 as uuidv4 } from 'uuid';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      isOpenCart: false,
      currentCurrency: '$',
      currentCategory: 'all',
      navCategories: [],
      prodcont: [],
      currentProductId: '',
      currentProduct: '',
      productsLocalStorage: [],
      itemAmountCart: 0,
      selectedAttr: '',
      selectedAttrIndex: 0,
      totalPrice: 0,
      amount: 1,
      amountArr: 0,
      galleryIndex: 0,
    };

    this.changeCategory = this.changeCategory.bind(this);
    this.setCurrentProduct = this.setCurrentProduct.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.changeCurrency = this.changeCurrency.bind(this);
    this.removeFromCart = this.removeFromCart.bind(this);
    this.increaseAmount = this.increaseAmount.bind(this);
    this.addToCartPLP = this.addToCartPLP.bind(this);
  }

  async changeCategory() {
    const res = await (await getCategory(this.state.currentCategory)).category.products.map((product) => product);

    this.setState({
      prodcont: res,
    });
  }

  openDropdown = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  openCart = () => {
    this.setState({
      isOpenCart: !this.state.isOpenCart,
    });
  };

  async setCurrentProduct(id) {
    await this.state.prodcont.filter(
      (product) =>
        product.id === id &&
        this.setState({
          currentProduct: product,
          currentProductId: product.id,
        })
    );
  }

  async addToCart({ id, name, inStock, gallery, category, attributes, prices, brand }, attributeList) {
    const galleryIndex = this.state.galleryIndex;
    const genItemId = uuidv4();
    if (JSON.parse(localStorage.getItem('products')) === null) {
      const amount = this.state.amount;
      await this.setState((prevState) => ({
        productsLocalStorage: [
          ...prevState.productsLocalStorage,
          { id, name, inStock, gallery, category,
            attributes, prices, brand, attributeList, amount, galleryIndex, genItemId },
        ],
      }));
      localStorage.setItem('products', JSON.stringify(this.state.productsLocalStorage));
    } else if (JSON.parse(localStorage.getItem('products')) !== null) {
      const items = JSON.parse(localStorage.getItem('products'));
      const amount = this.state.amount;
      const attrList = items.map((item) => item.attributeList.map((attribute) => attribute.e));
      const attr = attributeList.map((attribute) => attribute.e);

      if (!JSON.stringify(attrList).includes(JSON.stringify(attr))) {
        await this.setState((prevState) => ({
          productsLocalStorage: [
            ...prevState.productsLocalStorage,
            { id, name, inStock, gallery, category,
              attributes, prices, brand, attributeList, amount, galleryIndex, genItemId },
          ],
        }));
        localStorage.setItem('products', JSON.stringify(this.state.productsLocalStorage));
      }
    }

    const amounts = this.state.productsLocalStorage.map((item) => item.amount);
    let prodAmount = 0;
    for (let i = 0; i < amounts.length; i++) {
      prodAmount+= amounts[i]
    }
    this.setState({
      itemAmountCart: prodAmount,
    });
  }

  async addToCartPLP({ id, name, inStock, gallery, category, attributes, prices, brand }) {
    const galleryIndex = this.state.galleryIndex;
    const genItemId = uuidv4();
    if (JSON.parse(localStorage.getItem('products')) === null) {
      const attributeList = attributes.map((attr, index) => ({ e: attr.items[0].value, index: index, id:attr.id }));
      const amount = this.state.amount;
      await this.setState((prevState) => ({
        productsLocalStorage: [
          ...prevState.productsLocalStorage,
          { id, name, inStock, gallery, category,
            attributes, prices, brand, attributeList, amount, galleryIndex, genItemId },
        ],
      }));
      localStorage.setItem('products', JSON.stringify(this.state.productsLocalStorage));
    } else if (JSON.parse(localStorage.getItem('products')) !== null) {
      const attributeList = attributes.map((attr, index) => ({ e: attr.items[0].value, index: index, id:attr.id }));
      const items = JSON.parse(localStorage.getItem('products'));
      const itemId = items.map((item) => item.id)
      const amount = this.state.amount;
      const attrList = items.map((item) => item.attributeList.map((attribute) => attribute.e));
      const attr = attributeList.map((attribute) => attribute.e);
      if (!JSON.stringify(attrList).includes(JSON.stringify(attr)) || !itemId.includes(id)) {
        await this.setState((prevState) => ({
          productsLocalStorage: [
            ...prevState.productsLocalStorage,
            { id, name, inStock, gallery, category,
              attributes, prices, brand, attributeList, amount, galleryIndex, genItemId },
          ],
        }));
        localStorage.setItem('products', JSON.stringify(this.state.productsLocalStorage));
      }
    }
   
    const amounts = this.state.productsLocalStorage.map((item) => item.amount);
    let prodAmount = 0;
    for (let i = 0; i < amounts.length; i++) {
      prodAmount+= amounts[i]
    }
    this.setState({
      itemAmountCart: prodAmount,
    });
  }

  changeCurrency(event) {
    localStorage.setItem('currency', JSON.stringify(event));

    this.setState({
      currentCurrency: JSON.parse(localStorage.getItem('currency'))
        ? JSON.parse(localStorage.getItem('currency'))
        : '$',
    });
    return this.openDropdown()
  }

  async removeFromCart(item) {
    if (item.amount <= 1) {
      const attr = item.attributeList.map((item) => item.e);
      const removedItems = this.state.productsLocalStorage.filter(
        (product) => JSON.stringify(product.attributeList.map((product) => product.e)) !== JSON.stringify(attr)
      );
      await this.setState({
        productsLocalStorage: removedItems,
      });
      this.setState({
        itemAmountCart: removedItems.length,
      });

      localStorage.removeItem('products');
      localStorage.setItem('products', JSON.stringify(this.state.productsLocalStorage));
    } else if (item.amount > 1) {
      const attr = item.attributeList.map((item) => item.e);
      this.state.productsLocalStorage.map(
        (product) =>
          JSON.stringify(product.attributeList.map((product) => product.e)) === JSON.stringify(attr) && product.amount--
      );
      await localStorage.setItem('products', JSON.stringify(this.state.productsLocalStorage));
      this.setState({
        amountArr: this.state.productsLocalStorage.map((product) => product.amount).reduce((a, b) => a + b, 0),
      });
    }
    
    const amounts = this.state.productsLocalStorage.map((item) => item.amount);
    let prodAmount = 0;
    for (let i = 0; i < amounts.length; i++) {
      prodAmount+= amounts[i]
    }
    this.setState({
      itemAmountCart: prodAmount,
    });
  }

  async increaseAmount(item) {
    const attr = item.attributeList.map((item) => item.e);

    this.state.productsLocalStorage.map(
      (product) =>
        JSON.stringify(product.attributeList.map((product) => product.e)) === JSON.stringify(attr) && product.amount++
    );
    await localStorage.setItem('products', JSON.stringify(this.state.productsLocalStorage));
    this.setState({
      amountArr: this.state.productsLocalStorage.map((product) => product.amount).reduce((a, b) => a + b, 0),
    });
    
    const amounts = this.state.productsLocalStorage.map((item) => item.amount);
    let prodAmount = 0;
    for (let i = 0; i < amounts.length; i++) {
      prodAmount+= amounts[i]
    }
    this.setState({
      itemAmountCart: prodAmount,
    });
  }
  
  async componentDidMount() {
    const res = await (await getCategories()).categories.map((category) => category.name);
    this.setState({
      navCategories: res,
    });
    const products = await (await getCategory(this.state.currentCategory)).category.products.map((product) => product);

    this.setState({
      prodcont: products,
    });

    this.setState({
      currentCurrency: JSON.parse(localStorage.getItem('currency'))
        ? JSON.parse(localStorage.getItem('currency'))
        : '$',
    });

    this.setState({
      productsLocalStorage: JSON.parse(localStorage.getItem('products'))
        ? JSON.parse(localStorage.getItem('products'))
        : [],
    });

    const amounts = this.state.productsLocalStorage.map((item) => item.amount);
    let prodAmount = 0;
    for (let i = 0; i < amounts.length; i++) {
      prodAmount+= amounts[i]
    }
    this.setState({
      itemAmountCart: prodAmount,
    });

  }


  render() {
    const {
      navCategories,
      prodcont,
      currentProduct,
      currentProductId,
      isOpen,
      isOpenCart,
      productsLocalStorage,
      currentCurrency,
      currentCategory,
      itemAmountCart,
      selectedAttr,
      selectedAttrIndex,
      totalPrice,
      amountArr,
    } = this.state;

    return (
      <DataContext.Provider
        value={{
          navCategories: navCategories,
          prodcont: prodcont,
          currentProduct: currentProduct,
          currentProductId: currentProductId,
          isOpen: isOpen,
          isOpenCart: isOpenCart,
          productsLocalStorage: productsLocalStorage,
          currentCurrency: currentCurrency,
          currentCategory: currentCategory,
          itemAmountCart: itemAmountCart,
          selectedAttr: selectedAttr,
          selectedAttrIndex: selectedAttrIndex,
          totalPrice: totalPrice,
          amountArr: amountArr,
          changeCategory: this.changeCategory,
          setCurrentProduct: this.setCurrentProduct,
          openDropdown: this.openDropdown,
          openCart: this.openCart,
          addToCart: this.addToCart,
          changeCurrency: this.changeCurrency,
          removeFromCart: this.removeFromCart,
          increaseAmount: this.increaseAmount,
          addToCartPLP: this.addToCartPLP,
        }}
      >
        <div>
          <Nav totalPrice={this.state.totalPrice} currentCurrency={this.state.currentCurrency}/>
          <div className={isOpenCart ? 'app__background' : ''}></div>
          <div className="app__container">
            <Switch>
              <Route exact path="/" component={PLP}></Route>

              {navCategories.map((navCategory) => (
                <Route exact key={navCategory} path={navCategory === 'all' ? '/' : `/:category`} component={PLP} />
              ))}

              <Route exact path={`/product/:id`}>
                {({ match }) => (
                  <PDP
                    match={match}
                  />
                )}
              </Route>

              <Route exact path="/cart/cartpage">
                {({ match }) => <BodyCartPage match={match} currentCurrency={this.state.currentCurrency} />}
              </Route>
            </Switch>
          </div>
        </div>
      </DataContext.Provider>
    );
  }
}
