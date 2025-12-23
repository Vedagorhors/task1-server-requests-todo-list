import { useState, useEffect, useRef } from 'react';
import styles from './App.module.css';
import { createTodo, updateTodo, deleteTodo } from './api/todosApiFirebase';
import debounce from 'lodash.debounce';
import TodoForm from './components/todoForm';
import TodoList from './components/todoList';
import TodoFilters from './components/todoFilters';
import { getVisibleTodos } from './utils/gerVisibleTodos';
import { ref, onValue } from 'firebase/database';
import { db } from './firebase';

export const App = () => {
	const [todos, setTodos] = useState([]);
	const [newTask, setNewTask] = useState('');
	const [search, setSearch] = useState('');
	const [sortAsc, setSortAsc] = useState(true);

	const debouncedSetSearch = useRef(
		debounce((value) => {
			setSearch(value);
		}, 400),
	).current;

	useEffect(() => {
		const todosRef = ref(db, 'todos');
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
	};

	// Обработчик отправки формы добавления новой задачи.
	const handleFormSubmit = async (event) => {
		event.preventDefault();
		if (newTask.trim() === '') return;

		try {
			const newTodoData = {
				title: newTask,
				completed: false,
			};

			await createTodo(newTodoData);
			setNewTask('');
		} catch (error) {
			console.error('Ошибка при добавлении задачи:', error);
		}
	};

	const handleToggleCompleted = async (id, completed) => {
		try {
			await updateTodo(id, { completed });
		} catch (error) {
			console.error('Ошибка при обновлении задачи:', error);
		}
	};

	// Обработчик, задача которого по нажатию на кнопку удалить задачу на сервере и из локального массива todos
	const handleDelete = async (id) => {
		try {
			await deleteTodo(id);
		} catch (error) {
			console.error('Ошибка при удалении задачи:', error);
		}
	};

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

			{/* Компонент поиска и сортировки */}
			<TodoFilters
				search={search}
				onSearchChange={(event) => debouncedSetSearch(event.target.value)}
				onToggleSort={() => setSortAsc((prev) => !prev)}
				sortAsc={sortAsc}
			/>
			{/* Список дел */}
			<TodoList
				todos={visibleTodos}
				onToggle={handleToggleCompleted}
				onDelete={handleDelete}
			/>
		</main>
	);
};
