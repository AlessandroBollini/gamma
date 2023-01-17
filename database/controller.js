const db = require('./model');

exports.addUser = async (wallet, email, level) => {
    const user = {
        wallet: wallet,
        email: email,
        level: level
    };
    await db.Users.create(user)
        .then(() => {
            console.log("User added");
        })
        .catch(err => {
            console.error(err);
        })
}

exports.findUser = async (wallet) => {
    let user;
    await db.Users.findAll({ where: { wallet: wallet } })
        .then(data => {
            user = data;
        })
        .catch(err => {
            console.error(err);
        });
    return user[0].dataValues;
}

exports.checkUser = async (wallet) => {
    let count = 0;
    await db.Users.count({ where: { wallet: wallet } })
        .then(data => {
            count = data;
        })
        .catch(err => {
            console.error(err);
        });
    return count;
}

exports.updateUser = async (id, level) => {
    await db.Users.update({ level: level }, { where: { id: id } })
        .then(() => {
            console.log("User updated.");
        })
        .catch(err => {
            console.error(err);
        });
}

exports.hasUpgraded = async (wallet, n) => {
    const user = await this.findUser(wallet);
    const levelLenght = user.level.length;
    if (levelLenght > n) {
        return 1;
    }
    return 0;
}

exports.updateForMissingUsers = async (n) => {
    const users = await db.Users.findAll();
    users.forEach(async user => {
        if (user.level.length < n) {
            const newLevel = user.level.concat('0');
            await db.Users.update({ level: newLevel }, { where: { wallet: user.wallet } })
                .then(() => {
                    console.log("");
                })
                .catch(err => {
                    console.error(err);
                });
        }
    })
}