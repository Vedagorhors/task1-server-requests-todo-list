import { useState } from 'react';
import styles from './HomePage.module.css';
import { Link } from 'react-router-dom';
import { Search, Sorting } from './components';
import { useTodos } from '../../hooks/useTodos';
import { useFilteredTodos } from '../../hooks/useFilteredTodos';

export const HomePage = () => {
	// Локальное состояние для текста новой задачи, которую пользователь вводит в поле ввода
	const [newTask, setNewTask] = useState('');

	// Локальное состояние для поисковой фразы (фильтрация списка задач)
	const [search, setSearch] = useState('');

	// Локальное состояние для направления сортировки списка задач (true = A→Z, false = Z→A)
	const [sortAsc, setSortAsc] = useState(true);

	// Хук useTodos возвращает данные о задачах и функции для работы с ними
	// todos - полный массив всех задач с сервера (для передачи в useFilteredTodos)
	// createTodo - функция для создания новой задачи на сервере
	// toggleCompleted - функция для переключения статуса "выполнено" задачи
	const { todos, createTodo, toggleCompleted } = useTodos();

	// Хук useFilteredTodos фильтрует и сортирует список задач на основе параметров
	// Принимает объект: todos (все задачи), search (поисковая фраза), sortAsc (направление сортировки)
	// Возвращает отфильтрованный и отсортированный массив visibleTodos для отображения
	const visibleTodos = useFilteredTodos({ todos, search, sortAsc });

	// Обработчик изменения текста в поле ввода новой задачи
	// event - объект события, содержащий информацию о вводе (target.value - введённый текст)
	const handleNewTaskChange = (event) => {
		// Получаем введённое значение из input и сохраняем в состояние newTask
		// Теперь компонент является "контролируемым" - состояние полностью управляет значением input
		const value = event.target.value;
		setNewTask(value);
	};

	// Обработчик отправки формы добавления новой задачи
	// event - объект события отправки формы
	const handleFormSubmit = async (event) => {
		// Предотвращаем стандартное поведение формы (перезагрузку страницы)
		event.preventDefault();

		// Проверка: если поле ввода пустое или содержит только пробелы - не создаём задачу
		if (newTask.trim() === '') {
			return; // Прерываем выполнение функции
		}

		try {
			// Формируем объект «черновика» новой задачи.
			// Здесь ещё нет id — его сгенерирует JSON Server на сервере.
			const newTodoData = {
				title: newTask, // текст задачи берём из состояния инпута newTask
				completed: false, // новые задачи по умолчанию считаются невыполненными
			};

			// Вызываем функцию createTodo из хука useTodos для создания задачи на сервере
			// createTodo отправляет POST запрос на сервер и возвращает созданный объект задачи с проставленным id
			await createTodo(newTodoData);

			// После успешного создания задачи очищаем поле ввода новой задачи newTask
			// Теперь input станет пустым и пользователь сможет ввести новую задачу
			setNewTask('');
		} catch (error) {
			// Если при создании задачи произошла ошибка (сервер недоступен, ошибка валидации и т.п.),
			// выводим сообщение в консоль для отладки
			console.error('Ошибка при добавлении задачи:', error);
		}
	};

	return (
		<main className={styles.page}>
			{/* ГЛАВНЫЙ ЗАГОЛОВОК главной страницы */}
			<h1 className={styles.todoTitle}>Todo List</h1>

			{/* ФОРМА ДОБАВЛЕНИЯ НОВОЙ ЗАДАЧИ */}
			<form className={styles.todoForm} onSubmit={handleFormSubmit}>
				{/* Контейнер для поля ввода */}
				<div className={styles.todoFieldField}>
					{/* Метка для поля ввода (ассоциативная через htmlFor="new-task") */}
					<label className={styles.fieldLabel} htmlFor="new-task">
						New task
					</label>
					{/* КОНТРОЛИРУЕМОЕ ПОЛЕ: value и onChange связаны с состоянием newTask */}
					<input
						className={styles.fieldInput}
						id="new-task" // id для связи с label
						placeholder=" " // Пробел вместо текста (стилизация)
						autoComplete="off" // Отключаем автозаполнение браузера
						value={newTask} // Значение из состояния newTask (управляется компонентом)
						onChange={handleNewTaskChange} // При вводе вызывает handleNewTaskChange для обновления состояния
					/>
				</div>
				{/* КНОПКА ОТПРАВКИ ФОРМЫ: при клике срабатывает onSubmit формы */}
				<button className={styles.button} type="submit">
					Add
				</button>
			</form>

			{/* КОМПОНЕНТ ПОИСКА: получает search и onSearchChange пропсы */}
			<Search
				search={search} // Текущая поисковая фраза из состояния
				onSearchChange={(event) => setSearch(event.target.value)} // Обработчик ввода: обновляет состояние search
			/>

			{/* КОМПОНЕНТ СОРТИРОВКИ: переключает sortAsc между true/false */}
			<Sorting
				sortAsc={sortAsc} // Текущее направление сортировки из состояния
				onSortToggle={() => setSortAsc((prev) => !prev)} // Функциональное обновление: переключает true ↔ false
			/>

			{/* ОСНОВНОЙ СПИСОК ЗАДАЧ: отображает visibleTodos (уже отфильтрованный и отсортированный массив!) */}
			<ul className={styles.todoAppList}>
				{/* .map() проходит по КАЖДОЙ задаче из visibleTodos и создаёт элемент списка <li> */}
				{visibleTodos.map((todo) => (
					/* ОДИН ЭЛЕМЕНТ СПИСКА для каждой задачи */
					/* key={todo.id} - обязателен для оптимизации рендеринга списка в React */
					<li key={todo.id} className={styles['todo-app__item']}>
						{/* ЧЕКБОКС СТАТУСА: управляется состоянием completed с сервера */}
						<input
							className={styles.checkbox}
							type="checkbox"
							checked={todo.completed} // Галочка ставится по состоянию с сервера
							onChange={
								() =>
									/* При клике по чекбоксу: */
									toggleCompleted(todo.id, !todo.completed)
								/* 1️Вызывает функцию toggleCompleted из хука useTodos */
								/* 2️Передаёт: ID задачи + новое значение (!todo.completed - инвертируем текущее) */
								/* 3️toggleCompleted: отправляет PATCH /todos/:id → обновляет сервер → обновляет состояние todos */
							}
						/>
						{/* ССЫЛКА НА СТРАНИЦУ ЗАДАЧИ: ведёт на /task/:id (динамический параметр id из задачи) */}
						<Link to={`/task/${todo.id}`} className={styles.titleLink}>
							{todo.title}
						</Link>
					</li>
				))}
			</ul>
		</main>
	);
};
