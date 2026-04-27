import { useState } from 'react';
import products from '../../data/products';
import ProductCard from '../components/ProductCard';
import './LaptopListing.css';

function LaptopListing({ cart, setCart }) {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('5000');

  // Фильтр по категории "laptop"
  const laptopProducts = products.filter(item => item.category === 'laptop');
  const uniqueBrands = [...new Set(laptopProducts.map(p => p.make))];

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

        <main className="content">
          <div className="products-header">
            <span className="products-count">{filteredProducts.length} Products</span>
          </div>
          <div className="product-grid">
            {filteredProducts.map(item => (
              <ProductCard key={item.id} product={item} cart={cart} setCart={setCart} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default LaptopListing;