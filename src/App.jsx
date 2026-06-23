// Импортируем хуки из react-redux для работы с Redux store
import { useDispatch, useSelector } from 'react-redux';

// Импортируем useEffect из react для выполнения побочных эффектов (загрузка данных при монтировании)
import { useEffect } from 'react';

// Импортируем стили для компонента
import styles from './App.module.css';

// Импортируем Redux thunk action для загрузки задач с сервера
import { fetchTodosAsync } from './redux/actions';

// Импортируем Redux selector для получения отфильтрованных задач
import { selectFilteredTodos } from './redux/selectors';

// Импортируем Redux selectors для UI состояния (loading, error)
import { selectIsLoading, selectError } from './redux/selectors';

// Импортируем компоненты приложения
import { Search } from './components/search/search';
import { Sorting } from './components/sorting/sorting';
import { TodoForm } from './components/todo-form';
import { TodoList } from './components/todo-list';

// Главный компонент приложения
export const App = () => {
	// useDispatch - хук для получения функции dispatch для отправки Redux actions
	const dispatch = useDispatch();

	// useSelector - хук для получения данных из Redux store
	// Принимает selector функцию, которая возвращает часть state
	const visibleTodos = useSelector(selectFilteredTodos); // Получаем отфильтрованные задачи из store
	const isLoading = useSelector(selectIsLoading); // Получаем флаг загрузки из store
	const error = useSelector(selectError); // Получаем текст ошибки из store

	// useEffect - хук для выполнения побочных эффектов
	// Массив зависимостей [] означает, что эффект выполнится только один раз при монтировании компонента
	useEffect(() => {
		// Диспатчим thunk action для загрузки задач с сервера
		dispatch(fetchTodosAsync());
	}, [dispatch]); // dispatch - зависимость эффекта (dispatch не меняется, но хорошая практика включить)

	// Возвращаем JSX разметку для рендеринга компонента
	return (
		// Главный контейнер приложения с CSS классом
		<main className={styles.todo}>
			{/* Заголовок приложения */}
			<h1 className={styles['todo__title']}>Todo List</h1>

			{/* Форма для создания новой задачи */}
			{/* TodoForm сам диспатчит createTodoAsync через Redux */}
			<TodoForm />

			{/* Поле поиска */}
			{/* Search сам диспатчит setSearch и получает search через Redux */}
			<Search />

			{/* Кнопка переключения сортировки */}
			{/* Sorting сам диспатчит toggleSort и получает sortAsc через Redux */}
			<Sorting />

			{/* Индикатор загрузки - показываем приоритетно над ошибками */}
			{/* Если isLoading = true, показываем текст загрузки */}
			{isLoading && (
				<div className={styles['todo__loading']}>⏳ Загрузка задач...</div>
			)}

			{/* Сообщение об ошибке - показываем только когда не грузим */}
			{/* Если error != null и isLoading = false, показываем красный текст ошибки */}
			{error && !isLoading && (
				<div className={styles['todo__error']}>❌ {error}</div>
			)}

			{/* Список задач - показываем только когда не грузим и нет ошибок */}
			{/* visibleTodos - отфильтрованные и отсортированные задачи из Redux store */}
			{/* TodoList сам диспатчит updateTodoAsync и deleteTodoAsync через Redux */}
			{!isLoading && !error && <TodoList todos={visibleTodos} />}
		</main>
	);
};