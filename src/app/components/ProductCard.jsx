import { useState } from "react"
import '../../styles/ProductCard.css'

// Компонент карточки товара с кнопками добавления/изменения количества в корзине
function ProductCard({ product, addToCart, quantityInCart, updateQuantity }) {

    // Состояние для избранного
    const [isFavorite, setIsFavorite] = useState(false)

    // Состояние для карусели (индекс текущей картинки)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)

    // (1) функция для перехода к следующей картинке
    const nextImage = () => {
        // если это последняя картинка, переходим на первую (с 0м индексом)
        if (currentImageIndex === product.images.length - 1) {
            setCurrentImageIndex(0)
        }
        else {
            // иначе плюсуем 1
            setCurrentImageIndex(currentImageIndex + 1)
        }
    }

    // (2) функция для перехода к предыдущей картинке
    const prevImage = () => {
        // если это первая картинка (0й индекс), переходим на последнюю
        if (currentImageIndex === 0) {
            setCurrentImageIndex(product.images.length - 1)
        }
        else {
            // иначе минусуем 1
            setCurrentImageIndex(currentImageIndex - 1)
        }
    }

    return (
        <div className="product-card">
            {/* встраиваем бейдж special offer */}
            {product.isSpecialOffer && (
                <span className="special-badge">Special Offer</span>
            )}

            {/* Контейнер для картинки и стрелок */}
            <div className="image-wrapper">
                <img
                    src={product.images[currentImageIndex]}
                    alt={product.model}
                    className="product-image"
                />

                {/* отображаем стрелки и индикатор, если картинок больше чем 1 */}
                {product.images.length > 1 && (
                    <>
                        <button className="arrow left" onClick={prevImage}>❮</button>
                        <button className="arrow right" onClick={nextImage}>❯</button>

                        {/* номер индикатора (1, 2, 3.. N) */}
                        <div className="counter-indicator">
                            {currentImageIndex + 1} / {product.images.length}
                        </div>
                    </>
                )}
            </div>

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
                {quantityInCart === 0 ? (
                    /*Когда корзина пуста, показываем кноппку "добавить"*/
                    <button
                        className="add-to-cart-btn"
                        onClick={() => addToCart(product.id)}
                    >
                        Add to Cart
                    </button>
                ) : (
                    /*товары есть, показываем счетчик*/
                    <div className="cart-counter">
                        <button
                            className="counter-btn"
                            onClick={() => updateQuantity(product.id, -1)}
                        >
                            -
                        </button>

                        <span className="counter-text">{quantityInCart} in cart </span>

                        <button
                            className="counter-btn"
                            onClick={() => updateQuantity(product.id, 1)}
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