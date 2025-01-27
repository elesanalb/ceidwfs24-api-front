require("dotenv").config();
const postgres = require("postgres");

function conectar(){
    return postgres({
        host : process.env.DB_HOST,
        database : process.env.DB_NAME,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWORD
    });
}

function leerTareas(){
    return new Promise(async (ok, ko) => {
        const conexion = conectar();

        try{
            let tareas = await conexion`SELECT * FROM tareas`;

            conexion.end();

            ok(tareas);

        }catch(error){
            ko({error : "error en base de datos"});
        }
    });
}

/*
leerTareas()
.then(x => console.log(x))
.catch(x => console.log(x));
*/



function nuevaTarea(tarea){
    return new Promise(async (ok, ko) => {
        const conexion = conectar();

        try{
            let [{id}] = await conexion`INSERT INTO tareas (tarea) VALUES (${tarea}) RETURNING id`;

            conexion.end();

            ok(id);

        }catch(error){
            ko({error : "error en base de datos"});
        }
    });
}



function borrarTarea(id){
    return new Promise(async (ok, ko) => {
        const conexion = conectar();
        try{
            let {count} = await conexion`DELETE FROM tareas WHERE id = ${id}`;

            conexion.end();

            ok(count);

        }catch(error){
            ko({ error : "error en base de datos" });
        }
    });
}



function actualizarEstado(id){
    return new Promise(async (ok, ko) => {
        const conexion = conectar();
        try{
            let {count} = await conexion`UPDATE tareas SET terminada = NOT terminada WHERE id = ${id}`;

            conexion.end();

            ok(count);

        }catch(error){
            ko({ error : "error en base de datos" });
        }
    });
}


function actualizarTexto(id, texto){
    return new Promise(async (ok, ko) => {
        const conexion = conectar();
        try{
            let {count} = await conexion`UPDATE tareas SET tarea = ${texto} WHERE id = ${id}`;

            conexion.end();

            ok(count);

        }catch(error){
            ko({ error : "error en base de datos" });
        }
    });
}

module.exports = {leerTareas,nuevaTarea,borrarTarea,actualizarEstado,actualizarTexto};


/*
leerTareas("otra tarea")
.then(x => console.log(x))
.catch(x => console.log(x));
*/