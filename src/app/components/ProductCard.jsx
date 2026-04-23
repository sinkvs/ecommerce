import { useState } from "react"
import './ProductCard.css'

// создаем функцию-компонент с пропсом product
function ProductCard({ product }) {
    console.log('Product:', product)
    console.log('Images:', product.images)

    // Состояние для избранного
    const [isFavorite, setIsFavorite] = useState(false)

    // Состояние для корзины
    const [cartCount, setCartCount] = useState(0)

    return (
        <div className="product-card">
            {/* встраиваем бейдж special offer */}
            {product.isSpecialOffer && (
                <span className="special-badge">Special Offer</span>
            )}

            {/* добавляем картинку */}
            <img
                src={product.images[0]}
                alt={product.model}
                className="product-image"
            />

            {/* Кнопка "избранное" */}
            <button
                className="favorite-btn"
                onClick={() => setIsFavorite(!isFavorite)}
            >
                {isFavorite ? '❤️' : '🤍'}
            </button>

            {/*подписываем бренд, модель и цену*/}
            <div className="product-info">
                <div className="brand">{product.make}</div>
                <h3 className="model">{product.model}</h3>
                <div className="price">${product.price.toLocaleString()}</div>
            </div>

            {/*кнопка корзина и область счетчика*/}
            <div className="cart-container">
                {cartCount === 0 ? (
                    /*Когда корзина пуста, показываем кноппку "добавить"*/
                    <button
                        className="add-to-cart-btn"
                        onClick={() => setCartCount(1)}
                    >
                        Add to Cart
                    </button>
                ) : (
                    /*товары есть, показываем счетчик*/
                    <div className="cart-counter">
                        <button
                            className="counter-btn"
                            onClick={() => setCartCount(cartCount - 1)}
                        >
                            -
                        </button>
                        <span className="counter-text">{cartCount} in cart </span>
                        <button
                            className="counter-btn"
                            onClick={() => setCartCount(cartCount + 1)}
                        >
                            +
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductCard