import {SQLite} from 'expo';

const db = SQLite.openDatabase("testDB");

db.transaction(tx => {
    tx.executeSql('create table if not exists items (id integer primary key not null, done int, value text);');

    tx.executeSql('insert into items (done, value) values (0, "make an apple");');

    tx.executeSql('insert into items (done, value) values (1, "make jokes dance");');
});

export default db