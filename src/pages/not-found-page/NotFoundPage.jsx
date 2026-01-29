import { Link } from 'react-router-dom';
import styles from '../../App.module.css';

export const NotFoundPage = () => {
	return (
		<main className={styles.notFound}>
			<h1>404</h1>
			<p>Страница не найдена</p>
			<Link to="/">← Вернуться к списку задач</Link>
		</main>
	);
};
