// Импортируем StrictMode для выявления потенциальных проблем в React
import { StrictMode } from 'react';

// Импортируем createRoot для создания React root элемента в DOM
import { createRoot } from 'react-dom/client';

// Импортируем глобальные стили приложения
import './index.css';

// Импортируем главный компонент приложения
import { App } from './App.jsx';

// Импортируем Provider из react-redux для предоставления Redux store всем компонентам
import { Provider } from 'react-redux';

// Импортируем созданный Redux store
import { store } from './redux/store';

// Создаем root элемент в DOM (находим элемент с id="root")
createRoot(document.getElementById('root')).render(
	// StrictMode включает дополнительные проверки и предупреждения в React (только в разработке)
	<StrictMode>
		{/* Provider обертывает приложение и делает Redux store доступным для всех компонентов */}
		{/* store проп - сам Redux store, который мы создали в redux/store.js */}
		<Provider store={store}>
			{/* App - главный компонент приложения */}
			<App />
		</Provider>
	</StrictMode>,
);