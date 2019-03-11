import db from './db'
import bcrypt from '../consts/bcryptConfig'
import pwGenerator from '../consts/pwGenerator';
import saltPassword from '../consts/saltPassword';
import consts from '../consts/consts';

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

const insertNewPassword = (data, callback) => {
    const {hashedNew, newSaltPrefix, userId} = data;
    db.transaction(tx => {
        tx.executeSql(`update user set password=?, saltPrefix=? where id=?`, [
            hashedNew, newSaltPrefix, userId
        ], (_, returned) => {
            callback({message: "Master password changed", type: "success", toLogout: true})
        }, e => {
            console.log(myNote + fnName + "executeSql err fn, e: ", e);
            callback({message: "Error inserting new password", type: "danger", toLogout: false})
        });
    }, e => {
        console.log(myNote + fnName + "err fn, e: ", e)
    }, () => {})
}

const changeMasterPW = (data, callback) => {
    const fnName = " <userApi.changeMasterPW fn> ";
    const {userId, current, neww} = data;

    db.transaction(tx => {
        tx.executeSql(`select * from user where id=?`, [userId], async(_, returned) => {
            const user = returned.rows._array[0];
            const saltedPW = await saltPassword(current, user.saltPrefix);

            if (bcrypt.compareSync(saltedPW, user.password)) {
                const newSaltPrefix = pwGenerator(consts.saltPrefixLength, true);
                const saltedPW2 = await saltPassword(neww, newSaltPrefix);
                const hashedNew = bcrypt.hashSync(saltedPW2, bcrypt.genSaltSync(consts.saltRounds));

                insertNewPassword({
                    hashedNew,
                    newSaltPrefix,
                    userId
                }, callback);

            } else {
                callback({message: "Current password wrong", type: "danger", toLogout: false})
            }
        }, e => {
            console.log(myNote + fnName + "executeSql err fn, e: ", e)
        });
    }, e => {
        console.log(myNote + fnName + "err fn, e: ", e)
    }, () => {})
}

export default {
    insert,
    getByEmail,
    changeMasterPW
}