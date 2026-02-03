import styles from './HomePage.module.css';
import { Link } from 'react-router-dom';
import { Search, Sorting } from './components';

export const HomePage = ({
	handleFormSubmit, // Функция для добавления новой задачи (вызывается при отправке формы)
	newTask, // Текущее значение поля ввода новой задачи (строка)
	handleNewTaskChange, // Функция для изменения текста в поле ввода новой задачи
	search, // Текущая поисковая фраза (строка)
	setSearch, // Функция для обновления поисковой фразы
	sortAsc, // true = сортировка A→Z, false = Z→A
	setSortAsc, // Функция для переключения направления сортировки
	visibleTodos, // ГОТОВЫЙ массив: уже отфильтрованные + отсортированные задачи для отображения
	handleToggleCompleted, // Функция для переключения статуса "выполнено" задачи
}) => {
	return (
		<main className={styles.page}>
			{/* ГЛАВНЫЙ ЗАГОЛОВОК главной страницы */}
			<h1 className={styles.todoTitle}>Todo List</h1>

			{/* ФОРМА ДОБАВЛЕНИЯ НОВОЙ ЗАДАЧИ */}
			<form className={styles.todoForm} onSubmit={handleFormSubmit}>
				{/* Контейнер для поля ввода */}
				<div className={styles.todoFieldField}>
					{/* Метка для поля ввода (ассоциативная через htmlFor="new-task") */}
					<label className={styles.fieldLabel} htmlFor="new-task">
						New task
					</label>
					{/* КОНТРОЛИРУЕМОЕ ПОЛЕ: value и onChange связаны с состоянием из App.jsx */}
					<input
						className={styles.fieldInput}
						id="new-task" // id для связи с label
						placeholder=" " // Пробел вместо текста (стилизация)
						autoComplete="off" // Отключаем автозаполнение браузера
						value={newTask} // 📍 Значение из пропса newTask (управляется App.jsx)
						onChange={handleNewTaskChange} // 📍 При вводе вызывает handleNewTaskChange из App.jsx
					/>
				</div>
				{/* КНОПКА ОТПРАВКИ ФОРМЫ: при клике срабатывает onSubmit формы */}
				<button className={styles.button} type="submit">
					Add
				</button>
			</form>

			{/* КОМПОНЕНТ ПОИСКА: получает search и setSearch из App.jsx */}
			<Search
				serch={search} // Текущая поисковая фраза
				onSearchChange={(event) => setSearch(event.target.value)} // Обработчик ввода поиска
			/>

			{/* КОМПОНЕНТ СОРТИРОВКИ: переключает sortAsc между true/false */}
			<Sorting
				sortAsc={sortAsc} // Текущее направление сортировки
				onSortToggle={() => setSortAsc((prev) => !prev)} // Функциональное обновление: переключает true ↔ false
			/>

			{/* ОСНОВНОЙ СПИСОК ЗАДАЧ: отображает visibleTodos (уже готовый массив!) */}
			<ul className={styles.todoAppList}>
				{/* .map() проходит по КАЖДОЙ задаче из visibleTodos и создаёт <li> */}
				{visibleTodos.map((todo) => (
					/* ОДИН ЭЛЕМЕНТ СПИСКА для каждой задачи */
					<li key={todo.id} className={styles['todo-app__item']}>
						{/* ЧЕКБОКС СТАТУСА: управляется состоянием completed из сервера */}
						<input
							className={styles.checkbox}
							type="checkbox"
							checked={todo.completed} // Галочка ставится по состоянию с сервера
							onChange={
								() =>
									/* При клике по чекбоксу: */
									handleToggleCompleted(todo.id, !todo.completed)
								/* 1️Вызывает функцию из App.jsx */
								/* 2️Передаёт: ID задачи + новое значение (!todo.completed) */
								/* 3️App.jsx: PATCH /todos/:id → обновляет сервер → обновляет состояние */
							}
						/>
						{/* ССЫЛКА НА СТРАНИЦУ ЗАДАЧИ: ведёт на /task/:id */}
						<Link to={`/task/${todo.id}`} className={styles.titleLink}>
							{todo.title}
						</Link>
					</li>
				))}
			</ul>
		</main>
	);
};
