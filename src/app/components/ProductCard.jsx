import { useState } from "react"
import './ProductCard.css'

// создаем функцию-компонент с пропсом product
function ProductCard({ product }) {
    console.log('Product:', product)
    console.log('Images:', product.images)

    // Состояние для избранного
    const [isFavorite, setIsFavorite] = useState(false)

    return (
        <div>
            {/* встраиваем бейдж special offer */}
            {product.isSpecialOffer && (
                <span>Special Offer</span>
            )}

            {/* добавляем картинку */}
            <img
                src={product.images[0]}
                alt={product.model}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            
            {/*подписываем бренд, модель и цену*/}
            <div>{product.make}</div>
            <h3>{product.model}</h3>
            <div>${product.price.toLocaleString()}</div>

            {/* Кнопка "избранное" */}
            <button onClick={() => setIsFavorite(!isFavorite)}>
                {isFavorite ? '❤️' : '🤍'}
            </button>
        </div>
    )
}

export default ProductCard