import {SQLite} from 'expo';

const myNote = "\n*****************my note **************\n";
const db = SQLite.openDatabase("testDB");

// const selectSth = () => {

//     const callback = tx => {
//         const sqlStatement = "select * from account";
//         const args = [];
//         const suc2 = (tx, resultSet) => {
//             console.log(myNote + "suc2 fn, resultSet: ", resultSet)
//         }

//         const err2 = (tx, e) => {
//             console.log(myNote + "err2 fn, e: ", e)
//         }

//         tx.executeSql(sqlStatement, args, suc2, err2)
//     };

//     const error = e => {
//         console.log(myNote + "Error fn, e: ", e)
//     };

//     const success = s => {
//         console.log(myNote + "success fn, s: ", s)
//     };

//     db.transaction(callback, error, success)
// }

db.transaction(tx => {
    // tx.executeSql('create table if not exists items (id integer primary key not
    // null, done int, value text);');

    tx.executeSql('create table if not exists account (id integer primary key not null, title text)' +
            ';');

    tx.executeSql('create table if not exists detail (id integer primary key not null, accountId integer, key text not null, value text not null, FOREIGN KEY (accountId) REFERENCES account(id));');

    tx.executeSql('delete from account where id < 8');

    // tx.executeSql('insert into account (title) values ("first titre")');
    // tx.executeSql('insert into detail (accountId, key, value) values (1, "one key","first val")');

}, e => {
    console.log(myNote + "something Erred, e:", e)
}, () => {
});

export default db

/*
account table
-----------
id
title

detail table
--------
id
accountId
key
value

*/