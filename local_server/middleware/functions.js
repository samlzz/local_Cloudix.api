
exports.returnSM = (res, code_status, retour, err = null)=>{
        if(!err){
            return res.status(code_status).json({ status: code_status, message: retour });
        } else{
            return res.status(code_status).json({ status: code_status, message: retour, error: err });
        };
};

exports.returnFL = (res, code_status, file_list)=>{
        return res.status(code_status).json({ status: code_status, files: file_list });
};

exports.check_and_return = (res, needto, code_status, retour)=>{
    if(!needto){
        return this.returnSM(res, code_status, retour);
    }else{
        return false;
    };
};