// src/api/todosApi.js — БЭКАП JSON SERVER (НЕ УДАЛЯТЬ)

const BASE_URL = 'http://localhost:3001';
export const getTodos = async () => {
	const response = await fetch(`${BASE_URL}/todos`);
	if (!response.ok) {
		throw new Error('Не удалось загрузить список дел');
	}

	const data = await response.json();
	return data;
};

export const createTodo = async (todoData) => {
	const response = await fetch(`${BASE_URL}/todos`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json;charset=utf-8' },
		body: JSON.stringify(todoData),
	});
	if (!response.ok) {
		throw new Error('Не удалось создать задачу');
	}
	const createdTodo = await response.json();
	return createdTodo;
};

// Обновление задачи
export const updateTodo = async (id, updates) => {
	const response = await fetch(`${BASE_URL}/todos/${id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(updates),
	});

	if (!response.ok) {
		throw new Error('Не удалось обновить задачу');
	}

	const updatedTodo = await response.json();
	return updatedTodo;
};

// Удаление задачи
export const deleteTodo = async (id) => {
	const response = await fetch(`${BASE_URL}/todos/${id}`, {
		method: 'DELETE',
	});
	if (!response.ok) {
		throw new Error('Не удалось удалить задачу');
	}
};
