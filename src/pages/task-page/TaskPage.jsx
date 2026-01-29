import { useState } from 'react'; // Импортируем хуки React
import { useParams, useNavigate } from 'react-router-dom'; // Хуки React Router для работы с URL и навигацией
import styles from '../../App.module.css'; // CSS-модули из корневого App.module.css (путь относительно task-page/)

export const TaskPage = ({
	// Компонент страницы отдельной задачи
	todos, // Prop: полный массив всех задач из App.jsx (для поиска нужной по id)
	onToggleComplete, // Prop: функция переключения статуса completed (чекбокс)
	onUpdateTodo, // Prop: функция обновления текста задачи
	onDeleteTask, // Prop: функция удаления задачи
}) => {
	// useParams() извлекает динамические параметры из URL /task/:id → возвращает { id: "1" }
	const { id } = useParams(); // id приходит строкой: "1", "2", "3..."

	// useNavigate() возвращает функцию для программной навигации (кнопка "Назад")
	const navigate = useNavigate(); // navigate(-1) = назад на предыдущую страницу

	// Ищем задачу в массиве todos по id. Number(id) приводит строку "1" к числу 1
	const task = todos.find((t) => t.id === Number(id));

	// Локальное состояние для режима редактирования (НЕ синхронизируется с props)
	const [isEditing, setIsEditing] = useState(false); // false = просмотр, true = редактирование

	// Буфер для нового текста при редактировании (синхронизируется с input)
	const [editTitle, setEditTitle] = useState(task.title); // Инициализируется текущим названием

	// Если задача не найдена (неверный id или удалена) — показываем сообщение об ошибке
	if (!task) {
		return <h1>Задача не найдена</h1>; // Ранний возврат — не рендерим остальную разметку
	}

	// Обработчик кнопки "Назад" — возвращает на предыдущую страницу (главную со списком)
	const handleBack = () => {
		navigate(-1); // -1 = назад в истории браузера (откуда пришли)
	};

	// Переключатель режима редактирования
	const handleEditToggle = () => {
		setIsEditing(!isEditing); // Инвертируем состояние

		// Если ВКЛЮЧАЕМ редактирование (!isEditing === true) — сбрасываем поле ввода
		if (!isEditing) setEditTitle(task.title); // Берем актуальное название из props.task
	};

	// Сохранение изменений — отправляет на сервер и выходит из режима редактирования
	const handleSave = () => {
		// Вызываем функцию из App.jsx: onUpdateTodo(id, { title: "новый текст" })
		onUpdateTodo(task.id, { title: editTitle });

		// Выходим из режима редактирования
		setIsEditing(false);
	};

	// Удаление задачи с подтверждением
	const handleDelete = () => {
		// confirm() — нативный диалог браузера, возвращает true/false
		if (confirm('Удалить задачу?')) {
			// Удаляем задачу через App.jsx и сразу переходим назад
			onDeleteTask(task.id);
			navigate(-1); // Пользователь не увидит пустую страницу
		}
	};

	return (
		// Основная разметка страницы
		<main className={styles.taskPage}>
			{' '}
			{/* Кнопка "Назад" — всегда видна */}
			<button onClick={handleBack} className={styles.backButton}>
				← На главную
			</button>
			{/* Заголовок задачи — всегда виден */}
			<h1>{task.title}</h1>
			{/* Чекбокс статуса "выполнено" — всегда виден, управляется из App.jsx */}
			<input
				type="checkbox"
				checked={task.completed} // Управляется состоянием из App
				onChange={() => onToggleComplete(task.id, !task.completed)} // Переключает через App
			/>
			{/* УСЛОВНАЯ ЛОГИКА: показываем либо просмотр, либо редактирование */}
			{isEditing ? ( // Тернарный оператор: условие ? true : false
				// РЕЖИМ РЕДАКТИРОВАНИЯ =============================================
				<>
					{/* Поле ввода с контролируемым значением */}
					<input
						value={editTitle} // Связанное с useState(editTitle)
						onChange={(e) => setEditTitle(e.target.value)} // Обновляет локальное состояние
					/>

					{/* Кнопка сохранения */}
					<button onClick={handleSave}>Сохранить</button>

					{/* Кнопка отмены — возвращает в режим просмотра */}
					<button onClick={handleEditToggle}>Отмена</button>
				</>
			) : (
				// ИНАЧЕ (режим просмотра)

				// РЕЖИМ ПРОСМОТРА ===================================================
				<>
					{/* Полный текст задачи БЕЗ обрезки (в отличие от главной страницы) */}
					<p>{task.title}</p>

					{/* Кнопка входа в режим редактирования */}
					<button onClick={handleEditToggle}>Редактировать</button>

					{/* Кнопка удаления */}
					<button onClick={handleDelete}>Удалить</button>
				</>
			)}
		</main>
	);
};
