const mysql = require('mysql');
const config = require('../config/database');

const con = mysql.createConnection({
    host:config.host,
    user:config.user,
    password:config.password,
    database:config.database,
});

module.exports = {
    getData:function(subKey, callback){
        con.query('SELECT * FROM auth WHERE subkey = ?',[subKey],(err,row)=>{
            if(err){
                return callback(err,null,false);
            }
            if(row && row.length){
                //Subkey matched, Send data
                con.query('SELECT * FROM data',(error,data)=>{
                    if(error){
                        return callback(error,null,false);
                    }
                    if(data && data.length){
                        return callback(null,data,true);
                    }
                    else{
                        return callback(null,null,true);
                    }
                })
            }else{
                //Subkey mismatch
                return callback(null,null,false);
            }
        })
    },
    getLatest:function(subKey, callback){
        con.query('SELECT * FROM auth WHERE subkey = ?',[subKey],(err,row)=>{
            if(err){
                return callback(err,null,false);
            }
            if(row && row.length){
                //Subkey matched, Send data
                con.query('SELECT * FROM data',(error,data)=>{
                    if(error){
                        return callback(error,null,false);
                    }
                    if(data && data.length){
                        let len = data.length;
                        let index = len - 1;
                        let latest = data[index];
                        return callback(null,latest,true);
                    }
                    else{
                        return callback(null,null,true);
                    }
                })
            }else{
                //Subkey mismatch
                return callback(null,null,false);
            }
        })
    },
    postData:function(pubKey,data,callback){
        const values = [
            [data.temperature,data.humidity,data.pressure,data.light,data.lastupdate]
        ]
        con.query('SELECT * FROM auth WHERE pubkey = ?',[pubKey],(err,row)=>{
            if(err){
                return callback(err,false);//callback(error,success)
            }
            if(row && row.length){
                //Subkey matched, Save data
                con.query('INSERT INTO data (temperature,humidity,pressure,light,lastupdate) VALUES ?',[values],(error,result)=>{
                    if(error){
                        return callback(error,false);
                    }
                    if(result.affectedRows == 1){
                        return callback(null,true);
                    }
                    else{
                        return callback(null,false);
                    }
                })
            }
            else{
                return callback(null,false,false);
            }
        })
    }
}