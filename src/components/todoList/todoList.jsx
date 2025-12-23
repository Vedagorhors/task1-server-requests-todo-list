import styles from './todoList.module.css';
import TodoItem from '../todoItem';

const TodoList = ({ todos, onToggle, onDelete }) => {
	return (
		<ul className={styles.todoList}>
			{todos
				.filter((todo) => todo && todo.id)
				.map((todo) => (
					<TodoItem
						key={todo.id}
						todo={todo}
						onToggle={onToggle}
						onDelete={onDelete}
					/>
				))}
		</ul>
	);
};

export default TodoList;
