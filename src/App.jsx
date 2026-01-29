import { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from './api';
import { HomePage, TaskPage, NotFoundPage } from './pages';
import { Routes, Route } from 'react-router-dom';

export const App = () => {
	const [todos, setTodos] = useState([]); // пустой список до загрузки
	const [newTask, setNewTask] = useState('');
	const [search, setSearch] = useState('');
	const [sortAsc, setSortAsc] = useState(true); // true = A→Z, false = Z→A

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

	// Функция для обновления задачи по ID. Принимает ID задачи и объект с изменениями (например, { title: "новый текст" })
	const onUpdateTodo = async (id, updates) => {
		// async - функция асинхронная, т.к. работает с сетью (API запрос)
		// id - числовой ID задачи (например, 1, 2, 3...)
		// updates - объект с полями для изменения: { title: "...", completed: true }

		try {
			// Блок try-catch для обработки ошибок сети/сервера

			// 1. Отправляем PATCH запрос на сервер: /todos/:id
			// updateTodo(id, updates) - функция из todosApi.js
			// await - ждём ответа сервера (новый объект задачи с обновлёнными данными)
			const updatedTodo = await updateTodo(id, updates);

			// 2. Обновляем локальное состояние todos
			// setTodos с функциональным обновлением (prev => ...) - получает ТЕКУЩИЙ массив
			// prev - предыдущее значение состояния todos (актуальный массив задач)
			setTodos(
				(prev) =>
					// map проходит по КАЖДОЙ задаче в массиве и возвращает НОВЫЙ массив
					prev.map((todo) =>
						// Проверяем: если id текущей задачи (todo.id) === id обновляемой задачи
						todo.id === id
							? // ✅ ДА: заменяем задачу на updatedTodo (с сервера, с изменениями)
								updatedTodo
							: // ❌ НЕТ: оставляем задачу без изменений
								todo,
					), // map возвращает новый массив с одной заменённой задачей
			);
		} catch (error) {
			// Если updateTodo выбросил ошибку (сервер недоступен, 404, 500...)
			// error содержит информацию: тип ошибки, текст, статус HTTP
			console.error('Ошибка редактирования:', error);
			// Логируем в консоль для отладки, НЕ ломает приложение
		}
	};

	// Как это работает:
	// 	1. Вызов: onUpdateTodo(5, { title: "Новое название" })
	// 2. API: PATCH /todos/5 → сервер возвращает { id: 5, title: "Новое название" }
	// 3. Локально: todos.map() → заменяем задачу id=5 на новую
	// 4. UI: React перерендерит HomePage с обновлённым названием

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
		<Routes>
			<Route
				path="/"
				element={
					<HomePage
						handleFormSubmit={handleFormSubmit}
						handleNewTaskChange={handleNewTaskChange}
						handleToggleCompleted={handleToggleCompleted}
						newTask={newTask}
						search={search}
						setSearch={setSearch}
						sortAsc={sortAsc}
						setSortAsc={setSortAsc}
						visibleTodos={visibleTodos}
					/>
				}
			/>
			<Route
				path="/task/:id"
				element={
					<TaskPage
						todos={todos}
						onToggleComplete={handleToggleCompleted}
						onUpdateTodo={onUpdateTodo}
						onDeleteTask={handleDelete}
					/>
				}
			/>
			<Route path="/404" element={<NotFoundPage />} />
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
};
