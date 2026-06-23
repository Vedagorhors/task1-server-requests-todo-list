// Экспортируем все action creators из файлов actions
// Это позволяет импортировать все actions из одного места: import * from './actions'

// Экспортируем все асинхронные actions для работы с задачами (thunks)
export * from './todosActions';

// Экспортируем все синхронные actions для работы с UI (search, sort)
export * from './uiActions';