import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import DataContext from '../context';

export default class NavCategories extends Component {
  render() {
    const { navCategories } = this.context;
    return (
      <>
        {navCategories.map((category) => (
            <NavLink key={category}
              className={isActive => isActive ? 'navbar__categories__active' : 'navbar__categories'} 
              exact
              to={ category === 'all' ? '/' : `/${category}` }
            >
              {category.toUpperCase()}
            </NavLink>
        ))}
      </>
    );
  }
}

NavCategories.contextType = DataContext;
