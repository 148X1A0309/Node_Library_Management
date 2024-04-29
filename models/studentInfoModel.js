class StudentInfo {
    constructor() {

    }
    createNewUser(data) {
        return new Promise(async (resolve, reject) => {
            try {
                global.dbs['library'].collection('userInfo').insertOne(data, (err, result) => {
                    if (err) {
                        return resolve({
                            success: false,
                            error: err.message,
                        });
                    } else {
                        delete data.userPassword;
                        return resolve({
                            success: true,
                            data: {
                                message: 'User Created Successfully',
                                response: result,
                                meta: data
                            }
                        })
                    }

                })

            } catch (error) {
                reject(error);
            }
        })
    }


    loginUser(data) {
        return new Promise(async (resolve, reject) => {
            try {
                global.dbs['library'].collection('userInfo').find(data).toArray((err, result) => {
                    if (err) {
                        return resolve({
                            sucess: false,
                            error: err.message
                        })
                    } else {
                        return resolve({
                            success: true,
                            data: result
                        })
                    }
                })
            } catch (error) {
                reject(error);
            }
        })

    }
}

module.exports = new StudentInfo();