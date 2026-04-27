import { useState } from 'react';
import products from '../../data/products';
import ProductCard from '../components/ProductCard';
import './PhoneListing.css';

function PhoneListing({ cart, addToCart, updateQuantity }) {

  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('5000');

  // Фильтр по категории "phone"
  const phoneProducts = products.filter(item => item.category === 'phone');
  const uniqueBrands = [...new Set(phoneProducts.map(p => p.make))];

  return (
    <div className="home-page">
      <div className="page-layout">
        <aside className="sidebar">
          <h3>Filters</h3>
          <div className="filter-group">
            <label>Brand</label>
            <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
              <option value="">All Brands</option>
              {uniqueBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
            </select>
          </div>
          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-inputs">
              <input type="text" placeholder="$0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              <input type="text" placeholder="$5,000" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
          </div>
          <button className="apply-btn">Apply Filters</button>
        </aside>

/*specialdeal добавить*/
        <main className="content">
          <div className="products-header">
            <span className="products-count">{phoneProducts.length} Products</span>

            <div className="sort-container">
              <label>Sort by:</label>
              <select id="sort-select" className="sort-dropdown">
                <option value="">Price: High to Low</option>
                <option value="">Price: Low to High</option>
              </select>
            </div>
          </div>
          <div className="product-grid">
            {
              phoneProducts.map(item => (
                <ProductCard
                  key={item.id}
                  product={item}
                  // +++ Передаем новые пропсы для работы корзины
                  addToCart={addToCart}
                  quantityInCart={cart[item.id] || 0}
                  updateQuantity={updateQuantity}
                />
              ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default PhoneListing;