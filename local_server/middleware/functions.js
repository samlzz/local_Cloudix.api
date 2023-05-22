var isreturned = false;
var list_return = [];

exports.returnSM = (res, code_status, retour, err = null)=>{
    if(!isreturned){
        list_return.push({status: code_status, explication: retour})
        if(!err){
            isreturned = true;
            return res.status(code_status).json({ status: code_status, message: retour });
        } else{
            isreturned = true;
            return res.status(code_status).json({ status: code_status, message: retour, error: err });
        };
    } else {
        console.log(list_return);
        return console.log('returnSM has already execute');
    };
};

exports.check_and_return = (res, needto, code_status, retour)=>{
    if(!needto){
        return this.returnSM(res, code_status, retour);
    }else{
        return false;
    };
};