
var RabbitMq_Receiver = require("./src/receiver.js");

class Main{
    constructor(){
        //String de conexão
        this.run("amqp://localhost")
    }

    async run(uri){
        var receiver = new RabbitMq_Receiver(uri);
        await receiver.start();
    }
}

//Inicio do programa
new Main();