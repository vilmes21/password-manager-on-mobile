import db from './db'

const myNote = "\n*****************my note **************\n";

const getDetailByAccountId = (accountId, callback) => {
    const fnName = " <getDetailByAccountId fn> accountId: " + accountId;

    db.transaction(tx => {
        tx.executeSql(`select * from detail where accountId=?`, [accountId], (_, returned) => {
            console.log(myNote + fnName + " succeeded, returned: ", returned);
            callback(returned.rows._array)
        }, e => {
            console.log(myNote + fnName + "executeSql err fn, e: ", e)
        });
    }, e => {
        console.log(myNote + fnName + "err fn, e: ", e)
    }, () => {})
}

const saveMany = (objWithNewRows, callback)=>{
    const fnName = " <saveMany fn> ";

    const {newRowArr, accountId}= objWithNewRows;
    
    db.transaction(tx => {

        const createDetail = obj =>{
            //warning: what if special characters like " or ' ?
            tx.executeSql(`insert into detail (accountId,key, value) values (?,?,?) `, [accountId, obj.key, obj.value], (_, returned) => {
                console.log(myNote + fnName + " succeeded, returned: ", returned);
            }, e => {
                console.log(myNote + fnName + "executeSql err fn, e: ", e)
            });
        }

        const updateDetail = obj =>{
            //warning: what if special characters like " or ' ?
            tx.executeSql(`update detail set key=?, value= ? where id=?`, [obj.key, obj.value, obj.id], (_, returned) => {
                console.log(myNote + fnName + " succeeded, returned: ", returned);
            }, e => {
                console.log(myNote + fnName + "executeSql err fn, e: ", e)
            });
        }

        for (const obj of newRowArr) {
            //only save when row has content
            if (obj.key || obj.value){
                if (obj.id){
                    updateDetail(obj)
                } else {
                    createDetail(obj);
                }
            }
        }

    }, e => {
        console.log(myNote + fnName + "err fn, e: ", e)
    }, callback)
}

const deleteDetail = (detailId, afterDeleteDo) => {
    const fnName = " <deleteDetail fn> detailId: " + detailId;

    db.transaction(tx => {
        tx.executeSql(`delete from detail where id=?`, [detailId], (_, returned) => {
            console.log(myNote + fnName + " succeeded, returned: ", returned);
        }, e => {
            console.log(myNote + fnName + "executeSql err fn, e: ", e)
        });
    }, e => {
        console.log(myNote + fnName + "err fn, e: ", e)
    }, afterDeleteDo)
}


export default {getDetailByAccountId, saveMany, deleteDetail}