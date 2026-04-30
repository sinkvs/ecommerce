import { useEffect, useState } from 'react';
import '../../../styles/WeatherWidget.css';

const WeatherWidget = () => {
    // -- Состояния --

    // Состояние isLoading. True - показываем лоадер, False - основной контент
    const [isLoading, setIsLoading] = useState(true);
    
    // Состояние для координат (широта, долгота)
    const [coords, setCoords] = useState(null);
    
    // Хранит данные о погоде
    const [weatherData, setWeatherData] = useState(null);
    
    // Хранит текстовое значение поля (название города)
    const [cityInput, setCityInput] = useState('');

    // useEffect 1 (загрузка погоды для Тюмени при монтировании)
    useEffect(() => {
        const fetchCoodrinates = async () => {
            try {
                const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
                const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=Тюмень&limit=1&appid=${apiKey}`;
                
                const geoResponse = await fetch(geoUrl);
                const geoData = await geoResponse.json();

                // Логика сохранения координат
                if (geoData.length > 0) {
                    setCoords(geoData[0]);

                    // Запрос погоды по полученным координатам
                    const { lat, lon } = geoData[0];
                    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

                    const weatherResponse = await fetch(weatherUrl);
                    const weatherResult = await weatherResponse.json();

                    if (weatherResponse.ok) {
                        setWeatherData(weatherResult);
                        console.log('Погода', weatherResult);
                    } else {
                        console.error('Ошибка погоды:', weatherResult.message);
                    }
                } else {
                    console.log('Город Тюмень не найден');
                }
            } catch (error) {
                console.error('Ошибка сети:', error);
            } finally {
                setIsLoading(false); // убираем лоадер
            }
        };
        fetchCoodrinates();
    }, []);

    // useEffect 2 (синхронизация названия города на входе)
    useEffect(() => {
        if (weatherData) {
            setCityInput(weatherData.name);
        }
    }, [weatherData]); 

    // Рендеринг
    const renderContent = () => {
        if (isLoading) {
            return <p>Загрузка...</p>;
        }

        // Если погода загрузилась
        if (weatherData) {
            return (
                <div className="weather-info">
                    <h3>{weatherData.name}</h3>
                    <p>Температура: {Math.round(weatherData.main.temp)}°C</p>
                    <p>Описание: {weatherData.weather[0].description}</p>
                    <img
                        src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                        alt={weatherData.weather[0].description}
                    />
                </div>
            );
        }

        // если не удалось получить данные
        if (coords) {
            return <div>Не удалось получить данные о погоде</div>
        }
        return <div>Город не найден</div>;
    };
    return (
        <div className="weather-widget">
            {renderContent()}
        </div>
    );
};

export default WeatherWidget;