import { Routes, Route } from 'react-router-dom';
import { HomePage, TaskPage, NotFoundPage } from './pages';
import styles from './App.module.css';

export const App = () => (
	// Контейнер всего приложения, оборачивает весь контент
	<div className={styles.app}>
		{/* Роутинг приложения: компонент Routes определяет набор маршрутов */}
		<Routes>
			{/* Маршрут главной страницы: путь "/" соответствует главной странице приложения */}
			<Route path="/" element={<HomePage />} />

			{/* Маршрут страницы отдельной задачи: путь "/task/:id" означает, что после /task следует динамический параметр id */}
			{/* Например: /task/1, /task/2, /task/123 - все эти URL будут обрабатываться TaskPage */}
			<Route path="/task/:id" element={<TaskPage />} />

			{/* Маршрут для страницы 404: явный путь "/404" */}
			<Route path="/404" element={<NotFoundPage />} />

			{/* Маршрут-заглушка для всех несуществующих путей: путь "*" соответствует любому URL, который не совпал с предыдущими маршрутами */}
			{/* Например: /random, /undefined-page, /task/999999 - все будут показывать NotFoundPage */}
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	</div>
);
