import { useState } from 'react'
import products from '../../data/products'
import ProductCard from '../components/ProductCard'
import './TvListing.css'

function TvListing({ cart, addToCart, updateQuantity }) {
  /* состояния фильтров */
  const [selectedBrand, setSelectedBrand] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  /* состояние для сортировки (по умолчанию от меньшего к большему) */
  const [sortType, setSortType] = useState('low-high')

  /* вычисление брендов для выпадающего списка*/
  const uniqueBrands = [...new Set(products.map(p => p.make))]

  /*фильтрация товаров*/
  const tvProducts = products.filter(item => item.category === 'tv')

  /* создаем отсортированную версию списка */
  const sortedProducts = [...tvProducts].sort((a, b) => {
    if (sortType === 'high-low') {
      return b.price - a.price; // От дорогого к дешевому
    } else {
      return a.price - b.price; // От дешевого к дорогому (по умолчанию)
    }
  });

  return (
    <div className="home-page">
      {/* Заголовок с логотипом и иконками */}

      {/* Основной контейнер */}
      <div className="page-layout">

        {/* Левая колонка: Filters */}
        <aside className="sidebar">
          <h3>Filters</h3>
          {/* фильтр по бренду */}
          <div className="filter-group">
            <label htmlFor="brand">Brand</label>
            <select
              id="brand"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="" disabled hidden>Select Brand</option>
              {uniqueBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {/* фильтр по цене */}
          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-inputs">
              <input
                type="text"
                placeholder="$0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="text"
                placeholder="$5,000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          {/* кнопка Apply */}
          <button className="apply-btn">Apply Filters</button>

          {/* баннер */}
          <div className="special-deal-banner">
            <h4>Special Deal</h4>
            <p className="deal-timer">Offer expires in: <strong>0:59:59</strong></p>
          </div>

        </aside>

        {/* Правая колонка: Товары */}
        <main className="content">

          {/* Счётчик товаров и сортировка*/}
          <div className="products-header">
            <span className="products-count">{sortedProducts.length} Products</span>

            <div className="sort-container">
              <label htmlFor="sort-select" className="sort-label">Sort by:</label>

              <select
                id="sort-select"
                className="sort-dropdown"
                value={sortType}
                onChange={(e) => setSortType(e.target.value)}
              >

                <option value="low-high">Price: High to Low</option>
                <option value="high-low">Price: Low to High</option>
              </select>
            </div>
          </div>

          {/* Сетка карточек товаров */}
          <div className="product-grid">
            {sortedProducts.map(item => (
              // Передаем cart и setCart в карточку
              <ProductCard
                key={item.id}
                product={item}
                addToCart={addToCart}
                quantityInCart={cart[item.id] || 0}
                updateQuantity={updateQuantity}
              />
            ))}
          </div>

        </main>
      </div >
    </div >
  )
}

export default TvListing