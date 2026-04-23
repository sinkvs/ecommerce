import { useState } from "react"
import './ProductCard.css'

// создаем функцию-компонент с пропсом product
function ProductCard({ product }) {
    console.log('Product:', product)
    console.log('Images:', product.images)

    // Состояние для избранного
    const [isFavorite, setIsFavorite] = useState(false)

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
                <div>{product.make}</div>
                <h3>{product.model}</h3>
                <div>${product.price.toLocaleString()}</div>
            </div>
        </div>
    )
}

export default ProductCard