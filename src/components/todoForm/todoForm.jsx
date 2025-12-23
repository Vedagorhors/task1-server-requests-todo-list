import styles from './todoForm.module.css';

const TodoForm = ({ onSubmit, value, onChange }) => {
	return (
		<form className={styles.todoForm} onSubmit={onSubmit}>
			<div className={styles.todoField}>
				<label className={styles.fieldLabel} htmlFor="new-task">
					New task
				</label>
				<input
					className={styles.fieldInput}
					id="new-task"
					placeholder=" "
					autoComplete="off"
					value={value}
					onChange={onChange}
				/>
			</div>
			<button className={styles.button} type="submit">
				Add
			</button>
		</form>
	);
};
export default TodoForm;
