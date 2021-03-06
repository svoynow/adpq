import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import currencyFormatter from 'currency-formatter';
import map from 'lodash/fp/map';
import * as RemoteDataStates from '../../../constants/RemoteDataStates';
import { sortBy } from '../../../lib/sorts';
import AlertsContainer from '../../Alerts/AlertsContainer';
import { catalogItemPath, adminCatalogItemPath } from '../../../lib/paths';

export default class Catalog extends Component {

  static propTypes = {
    fetchCatalog: PropTypes.func.isRequired,
    catalog: PropTypes.shape({
      remoteDataState: PropTypes.string.isRequired,
      items: PropTypes.array.isRequired,
    })
  };

  state = {
    sort: ['updated_at', 'desc']
  }

  componentDidMount() {
    this.props.fetchCatalog();
  }

  changeSort = (field) => {
    const [currentField, currentDir] = this.state.sort;
    let newState;
    if (currentField === field) {
      newState = [currentField, toggleDirection(currentDir)];
    } else {
      newState = [field, 'asc'];
    }
    this.setState({ sort: newState });
  }

  sortedData = () => {
    const items = this.props.catalog.items;
    return sortBy([this.state.sort], items);
  }

  renderTableHeader = () => (
    <tr key="header">
      <th>
        <button onClick={() => this.changeSort('clin')} className={`usa-button-unstyled catalog-header-button${this.state.sort[0] === 'clin' ? ' sort-active' : ''} sort-${this.state.sort[1]}`}>CLIN</button>
      </th>
      <th>
        <button onClick={() => this.changeSort('updated_at')} className={`usa-button-unstyled catalog-header-button${this.state.sort[0] === 'updated_at' ? ' sort-active' : ''} sort-${this.state.sort[1]}`}>Date Added</button>
      </th>
      <th>
        <button onClick={() => this.changeSort('name')} className={`usa-button-unstyled catalog-header-button${this.state.sort[0] === 'name' ? ' sort-active' : ''} sort-${this.state.sort[1]}`}>Item Name</button>
      </th>
      <th>
        <button onClick={() => this.changeSort('manufacturer')} className={`usa-button-unstyled catalog-header-button${this.state.sort[0] === 'manufacturer' ? ' sort-active' : ''} sort-${this.state.sort[1]}`}>Manufacturer</button>
      </th>
      <th>
        <button onClick={() => this.changeSort('sku')} className={`usa-button-unstyled catalog-header-button${this.state.sort[0] === 'sku' ? ' sort-active' : ''} sort-${this.state.sort[1]}`}>SKU</button>
      </th>
      <th>
        <button onClick={() => this.changeSort('contract_unit_price')} className={`usa-button-unstyled catalog-header-button${this.state.sort[0] === 'contract_unit_price' ? ' sort-active' : ''} sort-${this.state.sort[1]}`}>Contract Price</button>
      </th>
      <th>
        <button onClick={() => this.changeSort('top_level_category')} className={`usa-button-unstyled catalog-header-button${this.state.sort[0] === 'top_level_category' ? ' sort-active' : ''} sort-${this.state.sort[1]}`}>Top Level</button>
      </th>
      <th>
        <button onClick={() => this.changeSort('simple_category')} className={`usa-button-unstyled catalog-header-button${this.state.sort[0] === 'simple_category' ? ' sort-active' : ''} sort-${this.state.sort[1]}`}>Sub-Category</button>
      </th>
    </tr>
  )

  renderTableRow = item => (
    <tr key={item.id}>
      <td>{item.clin}</td>
      <td>{new Date(item.updated_at * 1000).toLocaleString()}</td>
      <td><Link to={catalogItemPath(item)}>{item.name}</Link></td>
      <td>{item.manufacturer}</td>
      <td><Link to={adminCatalogItemPath(item)}>{item.sku}</Link></td>
      <td>{currencyFormatter.format(item.contract_unit_price / 100, { code: 'USD' })}</td>
      <td>{item.top_level_category}</td>
      <td>{item.simple_category}</td>
    </tr>
  )

  render() {
    if (this.props.catalog.remoteDataState === RemoteDataStates.LOADED) {
      const data = this.sortedData(this.props.catalog.items);
      const tableRows = map(item => this.renderTableRow(item), data);
      return (
        <div className="catalog">
          <div className="usa-section">
            <h1>Catalog</h1>
          </div>
          <AlertsContainer />
          <div className="catalog-count-section">
            <h3 className="catalog-count">
              {data.length} Item{data.length === 1 ? '' : 's'}
            </h3>
            <Link to="/admin/item/new" className="usa-button catalog-add-button">Add Item</Link>
          </div>
          <div className="table-container">
            <table className="usa-table-borderless">
              <thead>
                {this.renderTableHeader()}
              </thead>
              <tbody>
                {tableRows}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    return <div>Loading..</div>;
  }
}

const toggleDirection = direction => (direction === 'asc' ? 'desc' : 'asc');
