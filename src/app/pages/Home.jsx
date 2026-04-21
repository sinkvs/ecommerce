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

          {/* Счётчик товаров */}
          <div className="product-summary">
            <h2>{tvProducts.length} Products</h2>
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