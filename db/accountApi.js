//TODO: how to secure non-injectable sql

import db from './db'

const myNote = "\n*****************my note **************\n";

const addAccount = ({
    title,
    userId,
    saltPrefix
}, callback) => {
    const fnName = " <addAccount fn> ";

    db.transaction(tx => {
        tx.executeSql(`insert into account (title, userId, saltPrefix) values (?, ?, ?)`, [
            title, userId, saltPrefix
        ], (_, returned) => {
          
            callback(returned.insertId)
        }, e => {
            console.log(myNote + fnName + "executeSql err fn, e: ", e)
        });
    }, e => {
        console.log(myNote + fnName + "err fn, e: ", e)
    }, () => {})

}

const getAll = (userId, callback) => {
    const fnName = " <getAll fn> ";
    db.transaction(tx => {
        tx.executeSql(`select * from account where userId=?`, [userId], (_, returned) => {
           
            callback(returned.rows._array)
        }, e => {
            console.log(myNote + fnName + "executeSql err fn, e: ", e)
        });
    }, e => {
        console.log(myNote + fnName + "err fn, e: ", e)
    }, () => {})
}

export default {
    addAccount,
    getAll
}