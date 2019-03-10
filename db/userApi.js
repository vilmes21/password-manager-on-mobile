import db from './db'

const myNote = "\n*****************my note **************\n";

const insert = (data, callback) => {
    const fnName = " <userApi.insert fn> ";

    const {email, password, saltPrefix} = data;

    db.transaction(tx => {
        tx.executeSql(`insert into user (email, password,saltPrefix) values (?, ?,?)`, [
            email, password, saltPrefix
        ], (_, returned) => {
            callback(returned.insertId);
        }, e => {
            console.log(myNote + fnName + "executeSql err fn, e: ", e)
        });
    }, e => {
        console.log(myNote + fnName + "err fn, e: ", e)
    }, () => {})

}

const getByEmail = (email, callback) => {
    const fnName = " <userApi.getByEmail fn> ";

    db.transaction(tx => {
        tx.executeSql(`select * from user where email=?`, [email], (_, returned) => {

            callback(returned.rows._array[0]);
        }, e => {
            console.log(myNote + fnName + "executeSql err fn, e: ", e)
        });
    }, e => {
        console.log(myNote + fnName + "err fn, e: ", e)
    }, () => {})
}

export default {
    insert,
    getByEmail
}