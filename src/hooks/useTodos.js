import { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api';

export const useTodos = () => {
	const [todos, setTodos] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchTodos = async () => {
			try {
				setIsLoading(true);
				const loadedTodos = await getTodos();
				setTodos(loadedTodos);
			} catch (err) {
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		};

		fetchTodos();
	}, []);

	const handleCreateTodo = async (todoData) => {
		try {
			const createdTodo = await createTodo(todoData);
			setTodos((prev) => [...prev, createdTodo]);
			return createdTodo;
		} catch (err) {
			console.error('Ошибка при добавлении задачи:', err);
			throw err;
		}
	};

	const handleUpdateTodo = async (id, updates) => {
		try {
			const updatedTodo = await updateTodo(id, updates);
			setTodos((prev) => prev.map((todo) => (todo.id === id ? updatedTodo : todo)));
			return updatedTodo;
		} catch (err) {
			console.error('Ошибка редактирования:', err);
			throw err;
		}
	};

	const handleDeleteTodo = async (id) => {
		try {
			await deleteTodo(id);
			setTodos((prev) => prev.filter((todo) => todo.id !== id));
		} catch (err) {
			console.error('Ошибка при удалении задачи:', err);
			throw err;
		}
	};

	const handleToggleCompleted = async (id, newCompleted) => {
		try {
			const updatedTodo = await updateTodo(id, { completed: newCompleted });
			setTodos((prev) => prev.map((todo) => (todo.id === id ? updatedTodo : todo)));
			return updatedTodo;
		} catch (err) {
			console.error('Ошибка при обновлении задачи:', err);
			throw err;
		}
	};

	return {
		todos,
		isLoading,
		error,
		createTodo: handleCreateTodo,
		updateTodo: handleUpdateTodo,
		deleteTodo: handleDeleteTodo,
		toggleCompleted: handleToggleCompleted,
	};
};
