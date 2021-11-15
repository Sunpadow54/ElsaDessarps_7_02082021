// User model
// ------------------------- IMPORTS -------------------------
const sql = require('../config/db-connect');


// constructor 
class User {
    constructor(user) {
        this.email = user.email;
        this.pass = user.password;
        this.lastname = user.lastName;
        this.firstname = user.firstName;
    }
}


// ---- to insert new user in Db
User.create = (newUser) => {
    // define the query
    const inserts = [Object.keys(newUser), Object.values(newUser)];
    const query = sql.format(`INSERT INTO users (??) VALUES (?)`, inserts);
    // ask SQL
    return new Promise((resolve, reject) => {
        sql.query(query, (err, res) => {
            // error
            if (err && err.sqlMessage.startsWith('Duplicata')) return reject('This email already exist');
            if (err) return reject(err);
            // success
            resolve('User is successfully created');
        });
    })
};


// ---- edit
User.edit = (user) => {
    // define the query
    const inserts = [user.email, user.lastname, user.firstname, user.userId];
    const query = sql.format(`UPDATE users SET email = ?, lastname = ?, firstname = ? WHERE id_user = ?`, inserts);
    // ask SQL
    return new Promise((resolve, reject) => {
        sql.query(query, (err, res) => {
            // errors
            if (err) return reject(err.sqlMessage);
            if (res.changedRows === 0) return reject('This User has not been updated')
            // success
            resolve('Account successfully edited');
        })
    });
}


// Delete
User.delete = (userId) => {
    // define the query
    const query = sql.format(`DELETE FROM users WHERE id_user=?`, userId);
    // ask SQL
    return new Promise((resolve, reject) => {
        sql.query(query, (err, res) => {
            // error
            if (err) return reject(err.sqlMessage);
            // success
            resolve('Account successfully deleted');
        })
    });
}


// ---- Find One user & return all data
User.findOne = (where) => {
    // define the query
    const inserts = [Object.keys(where), Object.values(where)];
    const query = sql.format(`SELECT * FROM users WHERE ??=?`, inserts);
    // ask SQL
    return new Promise((resolve, reject) => {
        sql.query(query, (err, res) => {
            // errors
            if (err || res.length === 0) return reject('This account does not exist');
            // success
            resolve(res[0]); // [0] cause RowDataPacket
        })
    });
}

User.findAll = () => {
    // define the query
    const query = sql.format(`
            SELECT 
                u.id_user AS userId, u.email AS email, 
                CONCAT(u.lastname, ' ', u.firstname) AS name, 
                u.is_active AS isActive, u.is_admin AS isAdmin,
                (COALESCE(nbrModeratedPost, 0) + COALESCE(nbrModeratedCom,0)) AS moderatedMsg
            FROM users u
            LEFT JOIN (
                SELECT p.id_user,
                COUNT(*) AS nbrModeratedPost
                FROM posts p
                WHERE p.is_active = 0
                GROUP BY p.id_user
            ) posts ON u.id_user = posts.id_user
            LEFT JOIN (
                SELECT c.id_user,
                COUNT(*) AS nbrModeratedCom
                FROM comments c
                WHERE c.is_active = 0
                GROUP BY c.id_user
            ) comments ON u.id_user = comments.id_user
        `);
    // ask SQL
    return new Promise((resolve, reject) => {
        sql.query(query, (err, res) => {
            // error
            if (err) return reject(err);
            // success
            resolve(res);
        })
    });
}


User.ban = (idUser) => {
    // define the query
    const query = sql.format(`
                Update users SET is_active = (
                    CASE
                        WHEN is_active = 1 THEN 0
                        ELSE 1
                    END
                )
                WHERE id_user = ? AND is_admin = 0
                `, idUser
    );
    // ask SQL
    return new Promise((resolve, reject) => {
        sql.query(query, (err, res) => {
            // error
            if (err || res.changedRows === 0) return reject('user cannot be updated');
            // success
            resolve('User has been moderated');
        })
    });
};



module.exports = User;
