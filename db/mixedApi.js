import db from './db'

const myNote = "\n*****************my note **************\n";

const deleteAccountCascade = (accountId, afterDeleteDo) => {
    const fnName = " <deleteAccountCascade fn> ";

    db.transaction(tx => {
        tx.executeSql(`delete from detail where accountId=?`, [accountId], (_, returned) => {

            tx.executeSql(`delete from account where id=?`, [accountId], (_, returned) => {
            }, e => {
                console.log(myNote + fnName + "executeSql err fn, e: ", e)
            });

        }, e => {
            console.log(myNote + fnName + "executeSql err fn, e: ", e)
        });

    }, e => {
        console.log(myNote + fnName + "err fn, e: ", e)
    }, () => {
        afterDeleteDo()
    })

}

export default {
    deleteAccountCascade
}