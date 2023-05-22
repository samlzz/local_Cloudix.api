var isreturned = false;

exports.returnSM = (res, code_status, retour, err = null)=>{
    if(!isreturned){
        if(!err){
            isreturned = true;
            return res.status(code_status).json({ status: code_status, message: retour });
        } else{
            isreturned = true;
            return res.status(code_status).json({ status: code_status, message: retour, error: err });
        };
    } else{
        return console.log('returnSM has already execute')
    }
};

exports.check_and_return = (res, needto, code_status, retour)=>{
    if(!needto){
        return this.returnSM(res, code_status, retour);
    }else{
        return false;
    };
};