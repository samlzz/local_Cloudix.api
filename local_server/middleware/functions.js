
exports.returnSM = (res, code_status, retour, err = null) => {
    if(res.headersSent) {
        console.log('A response was already sent');
    } else {
        if(!err){
            return res.status(code_status).json({ status: code_status, message: retour });
        } else{
            return res.status(code_status).json({ status: code_status, message: retour, error: err });
        };
    };
};

exports.check_and_return = (res, needto, code_status, retour) => {
    if(!needto){
        return this.returnSM(res, code_status, retour);
    }else{
        return false;
    };
};

exports.returnFL = (res, code_status, file_list) => {
    if(res.headersSent) {
        console.log('A response was already sent');
    } else {
        return res.status(code_status).json({ status: code_status, files: file_list });
    };
};

exports.returnID = (res, code_status, the_id, msg) => {
    if(res.headersSent) {
        console.log('A response was already sent');
    } else {
        return res.status(code_status).json({ status: code_status, user_id: the_id, message: msg });
    };
};

