//TODO: how to secure non-injectable sql

import db from './db'

const myNote = "\n*****************my note **************\n";

const addAccount = ({title, userId}, callback) => {
    const fnName = " <addAccount fn> ";
    console.log(myNote + fnName + "entered fn, title: ", title)

    db.transaction(tx => {
        tx.executeSql(`insert into account (title, userId) values (?, ?)`, [title, userId], (_, returned) => {
            console.log(myNote + fnName + " succeeded, returned: ", returned);
            callback(returned.insertId)
        }, e => {
            console.log(myNote + fnName + "executeSql err fn, e: ", e)
        });
    }, e => {
        console.log(myNote + fnName + "err fn, e: ", e)
    }, () => {})

}

const getAll = (userId,callback) => {
    const fnName = " <getAll fn> ";
    db.transaction(tx => {
        tx.executeSql(`select * from account where userId=?`, [userId], (_, returned) => {
            console.log(myNote + fnName + " succeeded, returned: ", returned);
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