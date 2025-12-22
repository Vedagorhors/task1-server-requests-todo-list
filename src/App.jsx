import { useState, useEffect } from 'react';
import styles from './App.module.css';
import { getTodos, createTodo, updateTodo, deleteTodo } from './api';

export const App = () => {
	// const initialTodos = [
	// 	{ id: 1, title: 'Проснуться и принять душ' },
	// 	{ id: 2, title: 'Сделать зарядку' },
	// 	{ id: 3, title: 'Заняться изучением React' },
	// ];

	const [todos, setTodos] = useState([]); // пустой список до загрузки
	const [newTask, setNewTask] = useState('');
	const [search, setSearch] = useState('');
	const [sortAsc, setSortAsc] = useState(true); // true = A→Z, false = Z→A

	// 1 способ работы с асинхронным кодом и выполением http запросов с помощью хука useEffect
	// useEffect(() => {
	// 	fetch('https://jsonplaceholder.typicode.com/todos?_limit=3')
	// 		.then((todosData) => todosData.json())
	// 		.then((loadedTodos) => setTodos(loadedTodos));
	// }, []); // пустой массив внешних зависимостей хука useEffect -> запуск один раз. Пустой массив указывает на этап монтирования

	// 2 способ работы с асинхроныым кодом (используем async/await) и выполением http запросов с помощью хука useEffect

	useEffect(() => {
		const fetchTodos = async () => {
			try {
				// Получаю готовый массив
				const loadedTodos = await getTodos();
				// Сохраняю массив в состояние
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

	// Обработчик отправки формы добавления новой задачи.
	const handleFormSubmit = async (event) => {
		event.preventDefault();
		if (newTask.trim() === '') {
			return;
		}

		try {
			// Формируем объект «черновика» новой задачи.
			// Здесь ещё нет id — его сгенерирует JSON Server.
			const newTodoData = {
				title: newTask, // текст задачи берём из состояния инпута
				completed: false, // новые задачи по умолчанию считаются невыполненными
			};
			// Отправляем запрос на сервер (POST /todos).
			// createTodo вернёт уже созданный на сервере объект задачи с проставленным уникальным id.
			const createdTodo = await createTodo(newTodoData);

			// Обновляем состояние списка задач.
			// Берём предыдущий массив (prevTodos) и добавляем в конец только что созданную задачу с сервера createdTodo.
			// prevTodos — это параметр функциональной формы setTodos.
			// React сам передаёт в эту стрелочную функцию текущее значение состояния todos:
			// prevTodos — это то, что сейчас лежит в todos на момент обновления;
			// внутри стрелочной функции возвращается новый массив, который React запишет в todos.
			setTodos((prevTodos) => [...prevTodos, createdTodo]);

			// После добавления задачи очищаю поле ввода новой задачи newTask
			setNewTask('');
		} catch (error) {
			console.error('Ошибка при добавлении задачи:', error);
		}
	};

	// Обработчик переключения статуса "выполнено" у задачи.
	// При каждом клике по чекбоксу:
	// 1) отправляет на сервер PATCH /todos/:id с новым значением completed,
	// 2) обновляет локальное состояние todos на основе ответа сервера.
	const handleToggleCompleted = async (id, newCompleted) => {
		try {
			// Отправляем на JSON Server запрос на частичное обновление задачи.
			// Передаём только те поля, которые хотим изменить: в нашем случае completed.
			// Сервер найдёт задачу по id, изменит поле completed и вернёт обновлённый объект задачи.
			// updateTodo обновляет запись на сервере и возвращает полную задачу (с тем же id, title, но новым completed).
			const updatedTodo = await updateTodo(id, { completed: newCompleted });

			// Обновляем состояние todos на основе предыдущего значения.
			setTodos((prevTodos) =>
				// В setTodos используется map: для всех задач кроме нужной возвращаем старый объект, а для задачи с нужным id — updatedTodo.
				// Создаём НОВЫЙ массив задач.
				// Для каждой задачи:
				prevTodos.map(
					(todo) =>
						// если id совпадает с тем, который мы обновили,
						// подставляем объект updatedTodo, пришедший с сервера;
						todo.id === id ? updatedTodo : todo,
					// иначе оставляем задачу без изменений.
				),
			);
		} catch (error) {
			// Если при запросе произошла ошибка (сервер недоступен, статус не 2xx и т.п.),
			// выводим сообщение в консоль. Это помогает понять, что пошло не так,
			// не ломая работу всего приложения.
			console.error('Ошибка при обновлении задачи:', error);
		}
	};

	// Обработчик, задача которого по нажатию на кнопку удалить задачу на сервере и из локального массива todos
	const handleDelete = async (id) => {
		try {
			// 1. Пытаемся удалить задачу на сервере.
			await deleteTodo(id);

			// 2. Если ошибок не было, обновляем локальное состояние.
			//    Фильтруем массив: оставляем только те задачи,
			//    id которых не совпадает с удаляемым.
			setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
		} catch (error) {
			console.error('Ошибка при удалении задачи:', error);
		}
	};

	// 1. Нормализуем поисковую фразу: убираем пробелы по краям и переводим в нижний регистр.
	// Это нужно для корректного поиска без учета регистра и лишних пробелов.
	const normalizedSearch = search.trim().toLowerCase();

	// 2. Создаем отфильтрованный и отсортированный список для отображения.
	//    Не мутируем исходный массив todos из стейта — работаем с его копией.
	// todos — это все задачи из стейта.
	// visibleTodos — это уже отфильтрованные и отсортированные задачи, которые были посчитаны выше по коду, поэтому при рендере нужно обходить именно их
	const visibleTodos = todos
		// Шаг 2.1: ФИЛЬТРАЦИЯ по поисковой фразе
		.filter((todo) => {
			// Если поисковая фраза пустая — показываем ВСЕ задачи
			if (!normalizedSearch) {
				return true;
			}

			// Иначе проверяем: содержит ли title задачи (в нижнем регистре) нашу фразу
			// .includes() ищет подстроку, например "купить" найдет "Купить молоко"
			return todo.title.toLowerCase().includes(normalizedSearch);
		})
		// Шаг 2.2: СОРТИРОВКА по алфавиту (после фильтрации)
		.sort((a, b) => {
			// Сравниваем title двух задач с учетом локали (русский алфавит правильно)
			const titleA = a.title.toLowerCase();
			const titleB = b.title.toLowerCase();

			// Если sortAsc = true (A→Z): первая задача должна быть раньше второй
			if (sortAsc) {
				return titleA.localeCompare(titleB);
			}

			// Если sortAsc = false (Z→A): первая задача должна быть ПОЗЖЕ второй
			return titleB.localeCompare(titleA);
		});

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

			<input
				type="text"
				placeholder="Поиск по задачам"
				value={search}
				onChange={(event) => setSearch(event.target.value)}
			/>

			<button type="button" onClick={() => setSortAsc((prev) => !prev)}>
				Сортировать {sortAsc ? 'Я-А' : 'А-Я'}
			</button>

			{/* Список дел */}
			{/* чекбокс начнёт вызывать handleToggleCompleted, а состояние completed будет обновляться и в React, и в JSON Server. React вызывает handleToggleCompleted с правильным id и новым значением;
			функция сначала обновляет на сервере, затем обновляет state.
			todos — это все задачи из стейта.
			visibleTodos — это уже отфильтрованные и отсортированные задачи, которые были посчитаны выше по коду, поэтому при рендере нужно обходить именно их */}
			<ul className="todo-app__list">
				{visibleTodos.map((todo) => (
					<li key={todo.id} className={styles['todo-app__item']}>
						<input
							className={styles['checkbox']}
							type="checkbox"
							checked={todo.completed}
							onChange={() =>
								handleToggleCompleted(todo.id, !todo.completed)
							}
						/>
						<span>{todo.title}</span>
						<button
							type="button"
							className={styles.deleteButton}
							onClick={() => handleDelete(todo.id)}
						>
							Delete
						</button>
					</li>
				))}
			</ul>
		</main>
	);
};
