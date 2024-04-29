import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
    {
        name: 'idMeal.db',
        location: 'default',
    },
    () => { },
    error => {
        console.error('Database not open', error);
    },
);

// Create table if not exists
const createTables = () => {
    db.transaction(tx => {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS SavedRecipe (id INTEGER PRIMARY KEY AUTOINCREMENT, idMeal TEXT);',
            [],
            () => console.log('SavedRecipe table created successfully'),
            error => console.error('Error creating table', error)
        );
    });
};

// Insert a new record
const insertSavedRecipe = (idMeal: string) => {
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO SavedRecipe (idMeal) VALUES (?);',
            [idMeal],
            () => console.log('Record inserted successfully'),
            error => console.error('Error inserting record', error)
        );
    });
};

// Delete a record by id
const deleteSavedRecipe = (id: number) => {
    db.transaction(tx => {
        tx.executeSql(
            'DELETE FROM SavedRecipe WHERE id = ?;',
            [id],
            () => console.log('Record deleted successfully'),
            error => console.error('Error deleting record', error)
        );
    });
};

// Update a record by id
const updateSavedRecipe = (id: number, idMeal: string) => {
    db.transaction(tx => {
        tx.executeSql(
            'UPDATE SavedRecipe SET idMeal = ? WHERE id = ?;',
            [idMeal, id],
            () => console.log('Record updated successfully'),
            error => console.error('Error updating record', error)
        );
    });
};

export { createTables, insertSavedRecipe, deleteSavedRecipe, updateSavedRecipe };
