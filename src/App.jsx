import { useState, useEffect, useRef } from 'react';
import styles from './App.module.css';
// import { getTodos, createTodo, updateTodo, deleteTodo } from './api';
// import { getTodos, createTodo, updateTodo, deleteTodo } from './api/todosApiFirebase';
// для работы с firebase для Realtime Database убираю из импорта getTodos:
import { createTodo, updateTodo, deleteTodo } from './api/todosApiFirebase';
import debounce from 'lodash.debounce';
// import TodoItem from './components/todoItem';
import TodoForm from './components/todoForm';
import TodoList from './components/todoList';
import TodoFilters from './components/todoFilters';
import { getVisibleTodos } from './utils/gerVisibleTodos';
// подписка onValue, теперь функция getTodos больше нигде не используется
import { ref, onValue } from 'firebase/database';
import { db } from './firebase';

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

	// 	Debounce решает проблему: при быстром наборе setSearch вызывается 10+ раз в секунду → visibleTodos пересчитывается 10+ раз → лишние вычисления.
	// Нужно: ждать паузу 300–500мс после последнего изменения → только тогда обновлять поиск.

	// Я в терминале установил lodash: npm install lodash.debounce
	// Debounced версия setSearch: ждёт 400мс паузы после набора
	const debouncedSetSearch = useRef(
		debounce((value) => {
			setSearch(value);
		}, 400),
	).current;

	// 1 способ работы с асинхронным кодом и выполением http запросов с помощью хука useEffect
	// useEffect(() => {
	// 	fetch('https://jsonplaceholder.typicode.com/todos?_limit=3')
	// 		.then((todosData) => todosData.json())
	// 		.then((loadedTodos) => setTodos(loadedTodos));
	// }, []); // пустой массив внешних зависимостей хука useEffect -> запуск один раз. Пустой массив указывает на этап монтирования

	// 2 способ работы с асинхроныым кодом (используем async/await) и выполением http запросов с помощью хука useEffect

	// useEffect(() => {
	// 	const fetchTodos = async () => {
	// 		try {
	// 			// Получаю готовый массив
	// 			const loadedTodos = await getTodos();
	// 			// Сохраняю массив в состояние
	// 			setTodos(loadedTodos);
	// 		} catch (error) {
	// 			// 5. Обрабатываю ошибку
	// 			console.error('Ошибка при загрузке задач:', error);
	// 		}
	// 	};

	// 	fetchTodos();

	// 	// Очистка debounce при размонтировании
	// 	return () => {
	// 		debouncedSetSearch?.cancel();
	// 	};
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);

	// Чтобы синхронно обновлялись данные с базы Realtime Database на Firebase заменяю код useEffect
	useEffect(() => {
		const todosRef = ref(db, 'todos');

		// подписка на изменения в Realtime Database
		const unsubscribe = onValue(
			todosRef,
			(snapshot) => {
				const todos = [];

				if (snapshot.exists()) {
					snapshot.forEach((childSnapshot) => {
						todos.push({
							id: childSnapshot.key,
							...childSnapshot.val(),
						});
					});
				}

				setTodos(todos);
			},
			(error) => {
				console.error('Ошибка при загрузке задач:', error);
			},
		);

		// очистка: отписка + отмена debounce
		return () => {
			unsubscribe();
			debouncedSetSearch?.cancel();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleNewTaskChange = (event) => {
		const value = event.target.value;
		setNewTask(value);
		// console.log(value);
	};

	// Обработчик отправки формы добавления новой задачи.
	const handleFormSubmit = async (event) => {
		event.preventDefault();
		if (newTask.trim() === '') return;

		try {
			// Формируем объект «черновика» новой задачи.
			// Здесь ещё нет id — его сгенерирует JSON Server.
			const newTodoData = {
				title: newTask, // текст задачи берём из состояния инпута
				completed: false, // новые задачи по умолчанию считаются невыполненными
			};
			// Отправляем запрос на сервер (POST /todos).
			// createTodo вернёт уже созданный на сервере объект задачи с проставленным уникальным id.
			// для работы с Firebase удаляем следующую строку:
			// const createdTodo = await createTodo(newTodoData);
			// удаляем setTodos из handleFormSubmit, чтобы всё приходило только из Firebase:
			// setTodos((prevTodos) => [...prevTodos, createdTodo]); // ← лишнее при onValue
			await createTodo(newTodoData); // только пишем в базу
			setNewTask(''); // поле очищаем

			// Обновляем состояние списка задач.
			// Берём предыдущий массив (prevTodos) и добавляем в конец только что созданную задачу с сервера createdTodo.
			// prevTodos — это параметр функциональной формы setTodos.
			// React сам передаёт в эту стрелочную функцию текущее значение состояния todos:
			// prevTodos — это то, что сейчас лежит в todos на момент обновления;
			// внутри стрелочной функции возвращается новый массив, который React запишет в todos.
			// НЕ вызываем setTodos здесь — список обновит onValue
			// setTodos((prevTodos) => [...prevTodos, createdTodo]);

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
	const handleToggleCompleted = async (id, completed) => {
		try {
			await updateTodo(id, { completed });

			// Перезагрузка с сервера (как в handleDelete)
			// для Realtime Database: Так как обновление списка теперь делает подписка, повторные
			// getTodos() в обработчиках уже не нужны.
			// const updatedTodos = await getTodos(); // подписка сама подтянет новые данные
			// setTodos(updatedTodos);
		} catch (error) {
			console.error('Ошибка при обновлении задачи:', error);
		}
	};

	// Обработчик, задача которого по нажатию на кнопку удалить задачу на сервере и из локального массива todos
	const handleDelete = async (id) => {
		try {
			// 1. Пытаемся удалить задачу на сервере.
			await deleteTodo(id);
			// для Realtime Database: Так как обновление списка теперь делает подписка, повторные
			// getTodos() в обработчиках уже не нужны.
			// const updatedTodos = await getTodos();
			// 2. Если ошибок не было, обновляем локальное состояние.
			//    Фильтруем массив: оставляем только те задачи,
			//    id которых не совпадает с удаляемым.
			// setTodos(updatedTodos);
		} catch (error) {
			console.error('Ошибка при удалении задачи:', error);
		}
	};

	// 1. Нормализуем поисковую фразу: убираем пробелы по краям и переводим в нижний регистр.
	// Это нужно для корректного поиска без учета регистра и лишних пробелов.

	// 2. Создаем отфильтрованный и отсортированный список для отображения.
	//    Не мутируем исходный массив todos из стейта — работаем с его копией.
	// todos — это все задачи из стейта.
	// visibleTodos — это уже отфильтрованные и отсортированные задачи, которые были посчитаны выше по коду, поэтому при рендере нужно обходить именно их
	const visibleTodos = getVisibleTodos(todos, search, sortAsc);

	return (
		<main className={styles.todo}>
			{/* Заголовок */}
			<h1 className={styles.todoAppTitle}>Todo List</h1>
			{/* Форма добавления дела */}
			<TodoForm
				value={newTask}
				onChange={handleNewTaskChange}
				onSubmit={handleFormSubmit}
			/>
			{/* Поиск и сортировка */}
			{/* <div>
				<input
				type="text"
				placeholder="Поиск по задачам"
				value={search}
				// onChange={(event) => setSearch(event.target.value)}
				onChange={(event) => debouncedSetSearch(event.target.value)}
				/>

				<button type="button" onClick={() => setSortAsc((prev) => !prev)}>
				Сортировать {sortAsc ? 'А-Я' : 'Я-А'}
				</button>
				</div> */}
			{/* Компонент поиска и сортировки */}
			<TodoFilters
				search={search}
				onSearchChange={(event) => debouncedSetSearch(event.target.value)}
				onToggleSort={() => setSortAsc((prev) => !prev)}
				sortAsc={sortAsc}
			/>
			{/* Список дел */}
			{/* чекбокс начнёт вызывать handleToggleCompleted, а состояние completed будет обновляться и в React, и в JSON Server. React вызывает handleToggleCompleted с правильным id и новым значением;
			функция сначала обновляет на сервере, затем обновляет state.
			todos — это все задачи из стейта.
			visibleTodos — это уже отфильтрованные и отсортированные задачи, которые были посчитаны выше по коду, поэтому при рендере нужно обходить именно их */}
			<TodoList
				todos={visibleTodos}
				onToggle={handleToggleCompleted}
				onDelete={handleDelete}
			/>
		</main>
	);
};
