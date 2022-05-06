import React, { Component } from 'react';
import DataContext from '../context';
import getCurrencies from '../queries/getCurrencies';

export default class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currencies: [],
    };

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
      this.context.openDropdown()
    }
  }

  async componentDidMount() {
    const data = await (await getCurrencies()).currencies;
    this.setState({
      currencies: data,
    });
  }

  componentDidUpdate() {
    if (this.context.isOpen) {
      document.addEventListener("mousedown", this.handleClickOutside);
    } else {
      document.removeEventListener("mousedown", this.handleClickOutside);
    }
  }


  render() {
    const { changeCurrency } = this.context;
    const { currencies } = this.state;

    if (this.context.isOpen) {
      return (
        <div ref={this.wrapperRef}>
          <div className="dropdown__container">
            <ul>
              {currencies.map((currency) => (
                <li onClick={() => changeCurrency(currency.symbol)} key={currency.symbol}>
                  {currency.symbol} {currency.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    } else return(<div></div>);
  }
}

Dropdown.contextType = DataContext;
