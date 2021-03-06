import React, { PropTypes } from 'react';
import { shouldRender } from '../../lib/remote_data_states';
import CatalogItemContainer from '../CatalogItem/CatalogItemContainer';
import Loading from '../Loading/Loading';

export default class ItemDetail extends React.Component {

  static propTypes = {
    item: PropTypes.object,
    fetchCatalog: PropTypes.func.isRequired,
    catalog: PropTypes.shape({
      remoteDataState: PropTypes.string.isRequired
    }).isRequired
  }

  componentDidMount() {
    this.props.fetchCatalog();
  }

  render() {
    const { item } = this.props;

    if (shouldRender(this.props.catalog.remoteDataState)) {
      if (item) {
        return (
          <div className="usa-grid item-detail">
            <div className="usa-section">
              <h1>Product Detail</h1>
            </div>
            <CatalogItemContainer item={item} />

            <div className="return-to-top"><a href="#top">Return to top</a></div>
          </div>
        );
      }
      return <div>No such item</div>;
    }
    return <Loading />;
  }
}
