import { useEffect, useState, useRef } from 'react';
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

    // Ошибка при поиске города 
    const [geoError, setGeoError] = useState(null);

    // Ошибка при получении погоды
    const [weatherError, setWeatherError] = useState(null);

    // Состояние поиска (блокировка)
    const [isSearching, setIsSearching] = useState(false);

    // Состояние видимости виджета
    const [isVisible, setIsVisible] = useState(true);

    // useRef для AbortController
    const abortControllerRef = useRef(null);

    // useEffect 1 (загрузка погоды для Тюмени при монтировании)
    useEffect(() => {
        const controller = new AbortController(); // создаем контроллер

        // Проверяем память перед запросом
        const cached = localStorage.getItem('my_weather_cache');
        if (cached) {
            setWeatherData(JSON.parse(cached));
            setIsLoading(false);
            return; // запрос не делаем, данные уже есть
        }

        const fetchCoodrinates = async () => {
            try {
                const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

                // запрашиваем координаты
                const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=Тюмень&limit=1&appid=${apiKey}`;

                // передаем сигнал в фетч
                const geoResponse = await fetch(geoUrl, { signal: controller.signal });

                // если запрос был отменен
                if (!geoResponse.ok) return;

                const geoData = await geoResponse.json();

                // Логика сохранения координат
                if (geoData.length > 0) {
                    setCoords(geoData[0]);

                    // Запрос погоды по полученным координатам
                    const { lat, lon } = geoData[0];
                    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ru`;

                    // передаем тот же сигнал во второй фетч
                    const weatherResponse = await fetch(weatherUrl, { signal: controller.signal });

                    if (!weatherResponse.ok) return;

                    const weatherResult = await weatherResponse.json();

                    if (weatherResponse.ok) {
                        setWeatherData(weatherResult);
                        setWeatherError(null);

                        // Сохраняем результат в память
                        localStorage.setItem('my_weather_cache', JSON.stringify(weatherResult));
                    } else {
                        setWeatherError(true);
                        setWeatherData(null); // чистим для отображения сообщения об ошибке
                    }
                } else {
                    setGeoError('Не удалось получить данные для города Тюмень');
                    setCityInput('');
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Ошибка сети:', error);
                }
            } finally {
                setIsLoading(false); // убираем лоадер
            }
        };
        fetchCoodrinates();

        //  При размонтировании компонента очищаем
        return () => {
            controller.abort(); // отменяем все запросы, которые используют этот signal
        };
    }, []);

    // useEffect 2 (синхронизация названия города на входе)
    useEffect(() => {
        if (weatherData) {
            setCityInput(weatherData.name);
            setGeoError(null);
        }
    }, [weatherData]);

    // Ф-я обработчки
    const handleSearch = async () => {

        // Отменяем предыдущий запрос, если он еще идет
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Создаем новый контроллер для текущего запроса
        const controller = new AbortController();
        abortControllerRef.current = controller;

        // Блокируем интерфейс и сбрасываем ошибки
        setIsSearching(true);
        setGeoError(null);
        setWeatherError(null);

        // Если поле пустое, блокируем и выходим
        if (!cityInput.trim()) {
            setIsSearching(false);
            abortControllerRef.current = null;
            return;
        }

        try {
            const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

            // Запрашиваем координаты
            const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=1&appid=${apiKey}`;

            // Передаем сигнал в фетч
            const response = await fetch(geoUrl, { signal: controller.signal });

            if (!response.ok) throw new Error('Geo API error');

            const data = await response.json();

            console.log('Координаты нового города:', data);

            // Город найден?
            if (data.length === 0) {
                setGeoError(`Не удалось получить данные для города ${cityInput}`);
                setCityInput(''); // чистим input
                return;
            }

            // Запрашиваем погоду, если город найден
            const { lat, lon } = data[0];
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=ru`;

            // Передаем тот же сигнал во второй фетч
            const weatherResponse = await fetch(weatherUrl, { signal: controller.signal });

            if (!weatherResponse.ok) throw new Error('Weather API error');

            const weatherResult = await weatherResponse.json();

            setWeatherData(weatherResult);

        } catch (error) {
            // игнор ошибки отмены (AbortError), пользователю ее не показываем
            if (error.name !== 'AbortError' && error.message !== 'Abort') {
                console.error('Ошибка:', error);
                setWeatherError(true);
            }
        } finally {
            // чистим, если это был последний активный контроллер
            if (abortControllerRef.current === controller) {
                abortControllerRef.current = null;
            }
            setIsSearching(false); // разблокировка в любом случае
        }
    };

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
                        src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                        alt={weatherData.weather[0].description}
                    />
                </div>
            );
        }

        // если не удалось получить данные
        if (weatherError) {
            return <div className="error-message weather-error">Не удалось получить данные</div>
        }
        return <div>Загрузка...</div>;
    };

    if (!isVisible) {
        return null; // Ничего не рендерим, если виджет скрыт
    }

    return (
        <div className="weather-widget">
            {/* Кнопка закрыть*/}
            <button className="close-btn" onClick={() => setIsVisible(false)}>×</button>

            {/*Контент погоды*/}
            {renderContent()}

            {/*input и кнопка поиска*/}
            {!isLoading && (
                <div className="search-box">
                    <input
                        type="text"
                        value={cityInput}
                        onChange={(e) => {
                            setCityInput(e.target.value);
                            setGeoError(null);
                        }}
                        placeholder="Введите город"
                        disabled={isSearching}
                    />
                    {/* Привязываем функцию к кнопке */}
                    <button onClick={handleSearch} disabled={isSearching}>
                        {isSearching ? 'Поиск...' : 'Получить погоду'}
                    </button>
                </div>
            )}

            {!isLoading && geoError && <div className="error-message geo-error">{geoError}</div>}
        </div>
    );
};

export default WeatherWidget;