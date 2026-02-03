// src/pages/home-page/components/sorting/Sorting.jsx
import styles from './sorting.module.css';

export const Sorting = ({ sortAsc, onSortToggle }) => {
	return (
		<button type="button" className={styles.sortButton} onClick={onSortToggle}>
			Сортировать {sortAsc ? 'Я-А' : 'А-Я'}
		</button>
	);
};
