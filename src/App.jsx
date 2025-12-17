import { useState, useEffect } from 'react';
import styles from './App.module.css';

export const App = () => {
	// const initialTodos = [
	// 	{ id: 1, title: 'Проснуться и принять душ' },
	// 	{ id: 2, title: 'Сделать зарядку' },
	// 	{ id: 3, title: 'Заняться изучением React' },
	// ];

	const [todos, setTodos] = useState([]); // пустой список до загрузки
	const [newTask, setNewTask] = useState('');

	// 1 способ работы с асинхронным кодом и выполением http запросов с помощью хука useEffect
	// useEffect(() => {
	// 	fetch('https://jsonplaceholder.typicode.com/todos?_limit=3')
	// 		.then((todosData) => todosData.json())
	// 		.then((loadedTodos) => setTodos(loadedTodos));
	// }, []); // пустой массив зависимостей -> запуск один раз. Пустой массив указывает на этап монтирования

	// 2 способ работы с асинхроныым кодом (используем async/await) и выполением http запросов с помощью хука useEffect

	useEffect(() => {
		const fetchTodos = async () => {
			try {
				// делаю запрос
				const response = await fetch(
					'https://jsonplaceholder.typicode.com/todos?_limit=10',
				);
				// проверяю статус ответа
				if (!response.ok) {
					throw new Error('Не удалось загрузить задачи');
				}
				// Преобразую в JSON
				const loadedTodos = await response.json();

				// 4. Сохраняю в состояние
				setTodos(loadedTodos);
			} catch (error) {
				// 5. Обрабатываю ошибку
				console.error('Ошибка при загрузке задач:', error);
			}
		};

		fetchTodos();
	}, []);

	const handleNewTaskChange = (event) => {
		const value = event.target.value;
		setNewTask(value);
		// console.log(value);
	};

	const handleFormSubmit = (event) => {
		event.preventDefault();
		if (newTask.trim() === '') {
			return;
		}
		const newTodo = {
			id: Date.now(),
			title: newTask,
			completed: false,
		};
		// Создаю новый массив задач с новой задачей в конце
		const updateTodos = [...todos, newTodo];
		setTodos(updateTodos);
		setNewTask('');
	};

	return (
		<main className={styles.todo}>
			{/* Заголовок */}
			<h1 className="todo__title">Todo List</h1>

			{/* Форма добавления дела */}
			<form className="todo__form" onSubmit={handleFormSubmit}>
				<div className="todo__field field">
					<label className="field__label" htmlFor="new-task">
						New task
					</label>
					<input
						className="field__input"
						id="new-task"
						placeholder=" "
						autoComplete="off"
						value={newTask}
						onChange={handleNewTaskChange}
					/>
				</div>
				<button className="button" type="submit">
					Add
				</button>
			</form>

			{/* Список дел */}
			<ul className="todo-app__list">
				{todos.map((todo) => (
					<li key={todo.id} className={styles['todo-app__item']}>
						<input
							className={styles['checkbox']}
							type="checkbox"
							checked={todo.completed}
							readOnly
						/>
						{todo.title}
					</li>
				))}
			</ul>
		</main>
	);
};
