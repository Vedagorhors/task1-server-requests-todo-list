import styles from '../../App.module.css';
import { Link } from 'react-router-dom';

export const HomePage = ({
	handleFormSubmit,
	newTask,
	handleNewTaskChange,
	search,
	setSearch,
	sortAsc,
	setSortAsc,
	visibleTodos,
	handleToggleCompleted,
}) => {
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
						<Link to={`/task/${todo.id}`} className={styles.titleLink}>
							{todo.title}
						</Link>
						{/* <span>{todo.title}</span>
						<button
							type="button"
							className={styles.deleteButton}
							onClick={() => handleDelete(todo.id)}
						>
							Delete
						</button> */}
					</li>
				))}
			</ul>
		</main>
	);
};
