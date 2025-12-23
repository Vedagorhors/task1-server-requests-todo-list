// src/api/todosApiFirebase.js — Firebase Realtime Database версия
// Заменяет JSON Server на Firebase, сохраняя те же имена функций для App.jsx
import {
	ref, // Создаёт ссылку на путь в базе данных (аналог URL)
	push, // Генерирует уникальный ключ и возвращает ссылку на него
	get, // Читает данные один раз (не подписка)
	update, // Обновляет только указанные поля (не перезаписывает весь объект)
	remove, // Удаляет данные по ссылке
	query, // Создаёт запрос с сортировкой/фильтрацией
	orderByChild, // Сортирует по значению дочернего поля (требование задания)
} from 'firebase/database';
import { db } from '../firebase'; // Инициализированная база из firebase.js

// Главная ссылка на коллекцию todos в Realtime Database
// Структура: todos/{id}: { title: "...", completed: false }
const todosRef = ref(db, 'todos');

// CREATE — Создание новой задачи (аналог POST /todos)
// Принимает { title, completed: false }, возвращает полный объект с id

export const createTodo = async (todoData) => {
	// 1. push() генерирует уникальный id (на основе timestamp)
	const newTodoRef = push(todosRef);

	// 2. update() записывает данные по новой ссылке
	// Важно: update() не перезаписывает другие поля, если они есть
	await update(newTodoRef, todoData);

	// 3. get() читает только что созданный объект (для возврата с id)
	const snapshot = await get(newTodoRef);

	// 4. Возвращаем в формате, который ожидает App.jsx: { id, title, completed }
	return {
		id: newTodoRef.key, // Уникальный ключ от push()
		...snapshot.val(), // Данные: title, completed
	};
};

// READ — Загрузка ВСЕХ задач (для начальной загрузки в useEffect)
// Используется в App.jsx вместо JSON Server fetchTodos

export const getTodos = async () => {
	// 1. Читаем весь узел todos
	const snapshot = await get(todosRef);

	// 2. Массив для результата
	const todos = [];

	// 3. Проверяем, есть ли данные вообще
	if (snapshot.exists()) {
		// 4. snapshot.forEach() — ОБЯЗАТЕЛЬНО по заданию!
		//    Проходим по каждому дочернему элементу (задаче)
		snapshot.forEach((childSnapshot) => {
			// Каждая задача: { id: ключ, title, completed }
			todos.push({
				id: childSnapshot.key, // Ключ Firebase = id задачи
				...childSnapshot.val(), // Данные задачи
			});
		});
	}

	return todos; // Пустой массив, если todos пустой
};

// UPDATE — Обновление задачи (чекбокс completed)
// Аналог PATCH /todos/:id, обновляет только переданные поля

export const updateTodo = async (id, updates) => {
	// 1. Ссылка на конкретную задачу по id
	const todoRef = ref(db, `todos/${id}`);

	// 2. update() меняет только поля из updates (например, { completed: true })
	//    Остальные поля (title) остаются нетронутыми
	await update(todoRef, updates);
};

// DELETE — Удаление задачи
// Аналог DELETE /todos/:id

export const deleteTodo = async (id) => {
	// 1. Ссылка на задачу для удаления
	const todoRef = ref(db, `todos/${id}`);

	// 2. remove() полностью удаляет узел из базы
	await remove(todoRef);
};

// SERVER-SIDE СОРТИРОВКА (ДОПОЛНИТЕЛЬНО ПО ЗАДАНИЮ)
// Требуется .indexOn: ["title"] в Firebase Rules!

export const fetchTodosSorted = async (sortAsc = true) => {
	// 1. query() + orderByChild('title')
	//    Firebase сортирует на сервере по полю title (регистрозависимо)
	const sortedQuery = query(todosRef, orderByChild('title'));

	// 2. get() с запросом
	const snapshot = await get(sortedQuery);
	const todos = [];

	// 3. snapshot.forEach() ОБЯЗАТЕЛЬНО (snapshot.val() не гарантирует порядок!)
	if (snapshot.exists()) {
		snapshot.forEach((childSnapshot) => {
			todos.push({
				id: childSnapshot.key,
				...childSnapshot.val(),
			});
		});
	}

	// 4. Firebase не поддерживает DESC напрямую, делаем локально
	//    A→Z если sortAsc=true, Z→A если false
	return sortAsc ? todos : todos.reverse();
};
