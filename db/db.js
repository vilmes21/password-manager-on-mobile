import {SQLite} from 'expo';
import salt from './salt';

const myNote = "\n*****************my note **************\n";

(async() => {
    try {
        const saltSuffix = await salt.getSalt();
        if (!saltSuffix) {
            alert(saltSuffix + " <<< saltSuffix. need to set smart")
            const setWell = await salt.setSalt();
            if (!setWell) {
                alert(setWell + "!setWell")
            }
        }
    } catch (e) {
        alert("wrapped async errr blocl. e: " + e)
        await salt.setSalt()
    }
})()

const db = SQLite.openDatabase("testDB");

const selectSth = () => {

    const callback = tx => {
        const sqlStatement = "select * from detail";
        const args = [];
        const suc2 = (tx, resultSet) => {
            console.log(myNote + "suc2 fn, resultSet: ", resultSet)
        }

        const err2 = (tx, e) => {
            console.log(myNote + "err2 fn, e: ", e)
        }

        tx.executeSql(sqlStatement, args, suc2, err2)
        tx.executeSql("select * from account", args, suc2, err2)
        tx.executeSql("select * from user", args, suc2, err2)
    };

    const error = e => {
        console.log(myNote + "Error fn, e: ", e)
    };

    const success = () => {};

    db.transaction(callback, error, success)
}

db.transaction(tx => {
    // tx.executeSql('drop table detail'); tx.executeSql('drop table account');
    // tx.executeSql('drop table user');

    tx.executeSql('create table if not exists user (id integer primary key not null, email varchar(' +
            '255), password text, saltPrefix text, UNIQUE (email))');

    tx.executeSql('create table if not exists account (id integer primary key not null, userId inte' +
            'ger, title text, saltPrefix text, FOREIGN KEY (userId) REFERENCES user(id))');

    tx.executeSql('create table if not exists detail (id integer primary key not null, accountId in' +
            'teger, key text not null, value text not null, saltPrefix text, FOREIGN KEY (acc' +
            'ountId) REFERENCES account(id))');

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