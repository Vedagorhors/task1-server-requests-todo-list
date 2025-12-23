import styles from './todoItem.module.css';

const TodoItem = ({ todo, onToggle, onDelete }) => {
	return (
		<li className={styles.todoAppItem}>
			<input
				className={styles.checkbox}
				type="checkbox"
				checked={todo.completed}
				onChange={() => onToggle(todo.id, !todo.completed)}
			/>
			<span className={styles.title}>{todo.title}</span>
			<button
				type="button"
				className={styles.deleteButton}
				onClick={() => onDelete(todo.id)}
			>
				Delete
			</button>
		</li>
	);
};

export default TodoItem;
