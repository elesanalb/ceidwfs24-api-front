require("dotenv").config();
const express = require("express");
const {leerTareas, nuevaTarea, borrarTarea, actualizarEstado, actualizarTexto} = require("./db");

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
        
            respuesta.status(201);
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





//metodo PUT
server.put("/tareas/actualizar/:operacion(1|2)/:id([0-9]+)", async (peticion, respuesta, siguiente) => {
    let operaciones = [actualizarTexto, actualizarEstado];

    let {id, operacion} = peticion.params;

    let{tarea} = peticion.body;

    operacion = Number(operacion);

    if(operacion == 1 && (!tarea  || tarea.trim() == "")){
        return siguiente({ error : "no tiene la propiedad tarea" });
    }

    try{
        let cantidad = await operaciones[operacion -1](id, operacion == 1 ? tarea : null);

        return respuesta.json({ resultado : cantidad ? "ok" : "ko"});

    }catch(error){
        respuesta.status(500);
        return respuesta.json({ error : "error en el servidor" });
    }

});




// metodo DELETE
server.delete("/tareas/borrar/:id([0-9]+)", (peticion, respuesta) => {
    try{
        let cantidad = await borrarTarea(peticion.params.id);

        respuesta.json({ resultado : cantidad ? "ok" : "ko" });
        // respuesta.send(`borrar id : ${peticion.params.id}`);

    }catch(error){
        respuesta.status(500);
        return respuesta.json({ error : "error en el servidor" });
    };
});



server.use((error, peticion, respuesta, siguiente) => {
    respuesta.status(400);
    respuesta.json({ error : "error en la peticion" });
});

server.use((error, peticion, respuesta, siguente) => {
    respuesta.status(404);
    respuesta.json({error : "recurso no encontrado"});
})


server.listen(process.env.PORT);