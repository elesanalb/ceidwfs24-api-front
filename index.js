require("dotenv").config();
const express = require("express");
const {leerTareas, nuevaTarea} = require("./db");

const server = express();

server.use(express.json());

if(process.env.PRUEBAS){
    server.use("/pruebas", express.static("./pruebas"));
}



//metodo GET
server.get("/tareas", async (peticion, respuesta) => {
    try{
        let tareas = await leerTareas();

        respuesta.json(tareas);

    }catch(error){
        respuesta.status(500);
        respuesta.json({error : "error en el servidor"});
    }
});



//metodo POST
server.post("/tareas/nueva", async (peticion, respuesta, siguiente) => {
    let {tarea} = peticion.body;
    
    if(tarea && tarea.trim() != ""){
        try{
            let id = await nuevaTarea(tarea);
        
            return respuesta.json({id});

        }catch(error){
            respuesta.status(500);
            return respuesta.json({ error : "error en el servidor" })
        }
    }

    siguiente({ error : "no tiene propiedad tarea" });

    // console.log(peticion.body);
    // respuesta.send("crear una tarea");
});



// metodo DELETE
server.delete("/tareas/borrar/:id", (peticion, respuesta) => {
    respuesta.send(`borrar id : ${id}`);
});



server.use((error, peticion, respuesta, siguiente) => {
    respuesta.status(400);
    respuesta.json({ error : "error en la peticion" });
})


server.listen(process.env.PORT);