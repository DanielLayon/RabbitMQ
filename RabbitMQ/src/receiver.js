const { connect } = require('amqplib');
const { Channel } = require('amqplib/lib/channel');
const { Connection } = require('amqplib/lib/connection');
const fs = require("fs");
const path = "./src/json"

module.exports = class RabbitMq_Receiver{
    conn    = Connection;
    channel = Channel;
    uri;
    const

    constructor(uri){
        this.uri = uri
    }

    //Inicia o Server
    async start(){
        this.conn = await connect(this.uri)
        .then((conn)=>{
            conn.createChannel()
            .then((channel)=>{
                channel.consume("hello",(msg) => {
                    channel.ack(msg)
                    
                    var date = new Date();

                    var mainFolder = `${path}/${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;
                    var subFolder  = `${mainFolder}/${date.getHours()}_${date.getMinutes()}`;
                    var fileName   = `${subFolder}/${Date.now()}`;
                    var count      = 0;
                    var bOk        = true;

                    if (!(fs.existsSync(`${mainFolder}`))){
                        fs.mkdirSync(`${mainFolder}`)
                    }

                    if (!(fs.existsSync(`${subFolder}`))){
                        fs.mkdirSync(`${subFolder}`)
                    }

                    while(bOk){
                        if (!(fs.existsSync(`${fileName}_${count}.json`))){
                            fs.writeFileSync(`${fileName}_${count}.json`,msg.content.toString(),{ recursive: true })
                            bOk = false
                        }else{
                            count++
                        }
                    }
                    
                });
            })
            .catch((err)=>console.log(err));
        })
        .catch((err)=>console.log(err));
    }
}