import React, { Component, PropTypes } from 'react';
import currencyFormatter from 'currency-formatter';
import CartItemContainer from '../CartItem/CartItemContainer';
import Loading from '../Loading/Loading';
import { shouldRender } from '../../lib/remote_data_states';

export default class Cart extends Component {
  static propTypes = {
    cart: PropTypes.shape({
      items: PropTypes.array.isRequired,
      remoteDataState: PropTypes.string.isRequired
    }).isRequired,
    goToThanks: PropTypes.func.isRequired,
    placeOrder: PropTypes.func.isRequired
  };

  totalPrice = () => this.props.cart.items.reduce(
    (acc, item) => acc + (item.price * item.quantity),
    0
  );

  placeOrder = (event) => {
    event.preventDefault();
    return (this.props.cart.items.length) ?
        this.props.placeOrder().then(this.props.goToThanks) : false;
  }

  render() {
    if (shouldRender(this.props.cart.remoteDataState)) {
      const items = this.props.cart.items;

      return (
        <div className="usa-grid">
          <div className="usa-section">
            <h1>Your Cart</h1>
          </div>
          <main className="usa-grid-full">
            <ul className="usa-unstyled-list">
              {items.map(item => <li className="cart-item" key={item.id}><CartItemContainer item={item} link /></li>)}
            </ul>
            <form className="cart-checkout-form" onSubmit={this.placeOrder}>
              <h4>
                Total: {currencyFormatter.format(this.totalPrice() / 100, { code: 'USD' })}
              </h4>
              {items.length ? (<button>Place Order</button>) : ''}
            </form>
          </main>

          <div className="return-to-top"><a href="#top">Return to top</a></div>
        </div>
      );
    }
    return <Loading />;
  }
}
