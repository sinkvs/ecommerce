import { useState } from 'react';

const WeatherWidget = () => {
    // Состояние isLoading. True - показываем лоадер, False - основной контент
    const [isLoading, setIsLoading] = useState(true);

    const renderContent = () => {
        if (isLoading) {
            return <p>Загрузка...</p>;
        } else {
            return <div>Будущий контент о погоде</div>;
        }
    };

    return (
        <div className="weather-widget">
            {/*  */}
            {renderContent()}
        </div>
    );
};

export default WeatherWidget;