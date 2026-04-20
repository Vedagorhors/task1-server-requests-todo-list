import { useState } from 'react';
import styles from './App.module.css';
import { useTodos } from './hooks/useTodos';
import { useFilteredTodos } from './hooks/useFilteredTodos';
import { Search } from './components/search/search';
import { Sorting } from './components/sorting/sorting';

export const App = () => {
	const [newTask, setNewTask] = useState('');
	const [search, setSearch] = useState('');
	const [sortAsc, setSortAsc] = useState(true);

	const { todos, createTodo, toggleCompleted, deleteTodo } = useTodos();

	const visibleTodos = useFilteredTodos({ todos, search, sortAsc });

	const handleNewTaskChange = (event) => {
		const value = event.target.value;
		setNewTask(value);
	};

	const handleFormSubmit = async (event) => {
		event.preventDefault();
		if (newTask.trim() === '') {
			return;
		}

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

	const handleToggleCompleted = async (id, newCompleted) => {
		try {
			await toggleCompleted(id, newCompleted);
		} catch (error) {
			console.error('Ошибка при обновлении задачи:', error);
		}
	};

	const handleDelete = async (id) => {
		try {
			await deleteTodo(id);
		} catch (error) {
			console.error('Ошибка при удалении задачи:', error);
		}
	};

	return (
		<main className={styles.todo}>
			<h1 className="todo__title">Todo List</h1>

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

			<Search
				search={search}
				onSearchChange={(event) => setSearch(event.target.value)}
			/>

			<Sorting
				sortAsc={sortAsc}
				onSortToggle={() => setSortAsc((prev) => !prev)}
			/>

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
