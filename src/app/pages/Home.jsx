import Header from '../components/Header'
import products from '../../data/products'
import ProductCard from '../components/ProductCard'
import './Home.css'

function Home() {
  const tvProducts = products.filter(item => item.category === 'tv')

  return (
    <div className="home-page">
      {/* Заголовок с логотипом и иконками */}
      <Header />

      {/* Основной контейнер */}
      <div className="page-layout">

        {/* Левая колонка: Filters */}
        <aside className="sidebar">
          <h3>Filters</h3>
          {/* Здесь будут фильтры */}
        </aside>

        {/* Правая колонка: Товары */}
        <main className="content">

          {/* Счётчик товаров и сортировка*/}
          <div className="products-header">
            <span className="products-count">{tvProducts.length} Products</span>

            <div className="sort-container">
              <label htmlFor="sort-select" className="sort-label">Sort by:</label>
              <select id="sort-select" className="sort-dropdown">
                <option value="">Price: High to Low</option>
                <option value="">Price: Low to High</option>
              </select>
            </div>
          </div>

          {/* Сетка карточек товаров */}
          <div className="product-grid">
            {/* проходим по массиву tvProducts и создаем карточку для каждого товара */}
            {tvProducts.map(item => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>

        </main>
      </div>
    </div>
  )
}

export default Home