import styles from './NotFoundPage.module.css';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
	return (
		<main className={styles.page}>
			<h1 className={styles.title}>404</h1>
			<p className={styles.message}>Страница не найдена</p>
			<Link to="/" className={styles.link}>
				← Вернуться к списку задач
			</Link>
		</main>
	);
};
