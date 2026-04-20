import { useState } from 'react';
import styles from './App.module.css';
import { useTodos } from './hooks/useTodos';
import { useFilteredTodos } from './hooks/useFilteredTodos';
import { Search } from './components/search/search';
import { Sorting } from './components/sorting/sorting';
import { TodoForm } from './components/todo-form';
import { TodoList } from './components/todo-list';

export const App = () => {
	const [search, setSearch] = useState('');
	const [sortAsc, setSortAsc] = useState(true);

	const { todos, createTodo, toggleCompleted, deleteTodo } = useTodos();
	const visibleTodos = useFilteredTodos({ todos, search, sortAsc });

	return (
		<main className={styles.todo}>
			<h1 className={styles['todo__title']}>Todo List</h1>
			<TodoForm onCreateTodo={createTodo} />
			<Search
				search={search}
				onSearchChange={(event) => setSearch(event.target.value)}
			/>
			<Sorting
				sortAsc={sortAsc}
				onSortToggle={() => setSortAsc((prev) => !prev)}
			/>
			<TodoList
				todos={visibleTodos}
				onToggle={toggleCompleted}
				onDelete={deleteTodo}
			/>
		</main>
	);
};
