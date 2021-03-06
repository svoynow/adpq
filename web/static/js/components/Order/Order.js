import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import currencyFormatter from 'currency-formatter';
import Loading from '../Loading/Loading';
import { adminCatalogItemPath, catalogItemPath } from '../../lib/paths';
import { shouldRender } from '../../lib/remote_data_states';
import AlertsContainer from '../Alerts/AlertsContainer';

export default class Order extends Component {
  static propTypes = {
    fetchOrder: PropTypes.func.isRequired,
    orders: PropTypes.shape(
      {
        items: PropTypes.array.isRequired,
        remoteDataState: PropTypes.string.isRequired
      }),
    isAdmin: PropTypes.bool.isRequired,
    order: PropTypes.object,
    cancelOrder: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.props.fetchOrder(this.props.isAdmin);
  }

  render() {
    if (shouldRender(this.props.orders.remoteDataState)) {
      const { order, isAdmin, cancelOrder } = this.props;

      return (
        <div className="usa-grid order">
          <div className="usa-section">
            <h1>Order Detail</h1>
            <AlertsContainer />
            <div className="order-details">
              <h3>Order #{order.id}</h3>
              <table>
                <tbody>
                  <tr>
                    <th>Order Date</th>
                    <td>{new Date(order.inserted_at * 1000).toLocaleDateString('en-us')}</td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>{order.status.toLowerCase()}</td>
                  </tr>
                  <tr>
                    <th>Department</th>
                    <td>{order.department}</td>
                  </tr>
                  <tr>
                    <th>Requester</th>
                    <td>{order.username}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="order-items">
              <h2 className="subsection">Order Items</h2>
              <div className="table-container">
                <table className="usa-table-borderless">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>SKU</th>
                      <th>CLIN</th>
                      <th className="order-column-amount">Qty</th>
                      <th className="order-column-amount">Unit Cost</th>
                      <th className="order-column-amount">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items && order.items.length ?
                        order.items.map(item => (
                          <tr key={`${order.id}-${item.id}`}>
                            <td><Link to={catalogItemPath(item)}>{item.name}</Link></td>
                            <td>
                              {isAdmin ?
                                <Link to={adminCatalogItemPath(item)}>{item.sku}</Link>
                                :
                                item.sku
                              }
                            </td>
                            <td>1006b</td>
                            <td className="order-column-amount">{item.quantity}</td>
                            <td className="order-column-amount">{currencyFormatter.format(item.price / 100, { code: 'USD' })}</td>
                            <td className="order-column-amount">{currencyFormatter.format((item.price * item.quantity) / 100, { code: 'USD' })}</td>
                          </tr>
                    )) : ''}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="order-total">
              <h4>Order Total: {currencyFormatter.format(order.items.reduce((acc, orderItem) => acc + (orderItem.price * orderItem.quantity), 0) / 100, { code: 'USD' })}</h4>
              {order.status !== 'CANCELLED' ? (<button onClick={() => cancelOrder(order, isAdmin)} className="usa-button-outline button-secondary-outline">Cancel</button>) : ''}
            </div>

          </div>
        </div>
      );
    }
    return <Loading />;
  }
}
