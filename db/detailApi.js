import db from './db'

const myNote = "\n*****************my note **************\n";

const getDetailByAccountId = (accountId, callback) => {
    const fnName = " <getDetailByAccountId fn> accountId: " + accountId;

    db.transaction(tx => {
        tx.executeSql(`select * from detail where accountId=?`, [accountId], (_, returned) => {
            callback(returned.rows._array)
        }, e => {
            console.log(myNote + fnName + "executeSql err fn, e: ", e)
        });
    }, e => {
        console.log(myNote + fnName + "err fn, e: ", e)
    }, () => {})
}

const saveMany = (objWithNewRows, callback) => {
    const fnName = " <saveMany fn> ";
    let changedRowCount = 0;

    const {newRowArr, accountId} = objWithNewRows;

    db.transaction(tx => {

        const createDetail = obj => {
            const {key, value, saltPrefix} = obj;

            tx.executeSql(`insert into detail (accountId,key, value, saltPrefix) values (?,?,?,?) `, [
                accountId, key, value, saltPrefix
            ], (_, returned) => {
              
            }, e => {
                console.log(myNote + fnName + "executeSql err fn, e: ", e)
            });
        }

        const updateDetail = obj => {
            const {key, value, id, saltPrefix} = obj;

            tx.executeSql(`update detail set key=?, value= ?, saltPrefix=? where id=?`, [
                key, value, saltPrefix, id
            ], (_, returned) => {
               
            }, e => {
                console.log(myNote + fnName + "executeSql err fn, e: ", e)
            });
        }

        for (const obj of newRowArr) {
            //only save when row has content
            if (obj.key && obj.value) {
                changedRowCount++;
                if (obj.id) {
                    updateDetail(obj)
                } else {
                    createDetail(obj);
                }
            }
        }

    }, e => {
        console.log(myNote + fnName + "err fn, e: ", e)
    }, () => {
        callback(changedRowCount)
    })
}

const deleteDetail = (detailId, afterDeleteDo) => {
    const fnName = " <deleteDetail fn> detailId: " + detailId;

    db.transaction(tx => {
        tx.executeSql(`delete from detail where id=?`, [detailId], (_, returned) => {
           
        }, e => {
            console.log(myNote + fnName + "executeSql err fn, e: ", e)
        });
    }, e => {
        console.log(myNote + fnName + "err fn, e: ", e)
    }, afterDeleteDo)
}

export default {
    getDetailByAccountId,
    saveMany,
    deleteDetail
}