import {SQLite} from 'expo';
import salt from './salt';

const myNote = "\n*****************my note **************\n";

salt.getSalt().then(salt => {
    if (!salt){
        salt.setSalt()
    }
})

const db = SQLite.openDatabase("testDB");

const selectSth = () => {

    const callback = tx => {
        const sqlStatement = "select * from user";
        const args = [];
        const suc2 = (tx, resultSet) => {
            console.log(myNote + "suc2 fn, resultSet: ", resultSet)
        }

        const err2 = (tx, e) => {
            console.log(myNote + "err2 fn, e: ", e)
        }

        tx.executeSql(sqlStatement, args, suc2, err2)
    };

    const error = e => {
        console.log(myNote + "Error fn, e: ", e)
    };

    const success = s => {
        console.log(myNote + "success fn, s: ", s)
    };

    db.transaction(callback, error, success)
}

db.transaction(tx => {
    // tx.executeSql('drop table user'); tx.executeSql('drop table account');
    // tx.executeSql('drop table detail');

    tx.executeSql('create table if not exists user (id integer primary key not null, email varchar(' +
            '255), password text, UNIQUE (email))');

    // tx.executeSql('insert into user (email, password, saltPrefix) values
    // ("b@test.com", "123", "abcd")');

    tx.executeSql('create table if not exists account (id integer primary key not null, userId inte' +
            'ger, title text, saltPrefix text, FOREIGN KEY (userId) REFERENCES user(id))');

    tx.executeSql('create table if not exists detail (id integer primary key not null, accountId in' +
            'teger, key text not null, value text not null, saltPrefix text, FOREIGN KEY (acc' +
            'ountId) REFERENCES account(id))');

    // tx.executeSql('insert into account (title) values ("first titre")');
    // tx.executeSql('insert into detail (accountId, key, value) values (1, "one
    // key","first val")');

}, e => {
    console.log(myNote + "something Erred, e:", e)
}, () => {});

selectSth()

export default db

/*
user table
---------
id
email
password
keyPrefix

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