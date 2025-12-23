import { ref, push, get, update, remove, query, orderByChild } from 'firebase/database';
import { db } from '../firebase';

const todosRef = ref(db, 'todos');

// CREATE — Создание новой задачи (аналог POST /todos)

export const createTodo = async (todoData) => {
	const newTodoRef = push(todosRef);
	await update(newTodoRef, todoData);
	const snapshot = await get(newTodoRef);

	return {
		id: newTodoRef.key,
		...snapshot.val(),
	};
};

export const getTodos = async () => {
	const snapshot = await get(todosRef);
	const todos = [];

	if (snapshot.exists()) {
		snapshot.forEach((childSnapshot) => {
			todos.push({
				id: childSnapshot.key,
				...childSnapshot.val(),
			});
		});
	}

	return todos;
};

// UPDATE — Обновление задачи (чекбокс completed)
// Аналог PATCH /todos/:id, обновляет только переданные поля

export const updateTodo = async (id, updates) => {
	const todoRef = ref(db, `todos/${id}`);

	await update(todoRef, updates);
};

// DELETE — Удаление задачи
// Аналог DELETE /todos/:id

export const deleteTodo = async (id) => {
	const todoRef = ref(db, `todos/${id}`);

	await remove(todoRef);
};

// SERVER-SIDE СОРТИРОВКА (ДОПОЛНИТЕЛЬНО ПО ЗАДАНИЮ)
// Требуется .indexOn: ["title"] в Firebase Rules!

export const fetchTodosSorted = async (sortAsc = true) => {
	const sortedQuery = query(todosRef, orderByChild('title'));
	const snapshot = await get(sortedQuery);
	const todos = [];

	if (snapshot.exists()) {
		snapshot.forEach((childSnapshot) => {
			todos.push({
				id: childSnapshot.key,
				...childSnapshot.val(),
			});
		});
	}

	return sortAsc ? todos : todos.reverse();
};
