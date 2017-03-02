import React, { Component, PropTypes } from 'react';
import { shouldRender } from '../../../lib/remote_data_states';
import AdminOrderChart from '../AdminOrderChart/AdminOrderChart';
import OrderTable from '../../OrderTable/OrderTable';
import Loading from '../../Loading/Loading';

export default class AdminOrderReport extends Component {
  static propTypes = {
    fetchOrders: PropTypes.func.isRequired,
    orderReport: PropTypes.shape({
      items: PropTypes.array.isRequired,
      remoteDataState: PropTypes.string.isRequired
    }).isRequired,
    byCategoryDepartment: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.fetchOrders();
  }

  render() {
    if (shouldRender(this.props.orderReport.remoteDataState)) {
      return (
        <div className="usa-grid">
          <div className="usa-section">
            <h2>Orders Report</h2>
            <AdminOrderChart orders={this.props.byCategoryDepartment} />
            <OrderTable orders={this.props.orderReport.items} />
          </div>
        </div>
      );
    }
    return <Loading />;
  }
}
