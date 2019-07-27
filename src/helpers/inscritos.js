const fs = require('fs');
listaEstudiantes = [];
listaEstudiantesCursos = [];


const crearEstudiante = (estudiante, estudianteCurso) => {
	listar();
	let est = {
		id : estudiante.id,
		nombre : estudiante.nombre,
		telefono: estudiante.telefono,
		email: estudiante.email
	};
	let duplicado = listaEstudiantes.find(x => x.id == est.id);
	
	listarEstudiantesCursos();
	listaEstudiantesCursos.push(estudianteCurso);
	guardarEstudiantesCursos();
	return est.nombre;
	
}

const listar = () => {
	try{
		listaEstudiantes = require('../listadoEstudiantes.json');
	} catch(error){
		listaEstudiantes = [];
	}
}

const listarEstudiantesCursos = () => {
	try{
		listaEstudiantesCursos = require('../listadoInscritos.json');
	} catch(error){
		listaEstudiantesCursos = [];
	}
}

const guardar = () => {
	let datos = JSON.stringify(listaEstudiantes);
	fs.writeFile('./src/listadoEstudiantes.json', datos, (err)=>{
		if(err) throw (err);
		console.log('Archivo creado con exito');
	})
}

const guardarEstudiantesCursos = () => {
	let datos = JSON.stringify(listaEstudiantesCursos);
	fs.writeFile('./src/listadoInscritos.json', datos, (err)=>{
		if(err) throw (err);
		console.log('Archivo creado con exito');
	})
}

const guardarInsctitosync = () => {
	let datos = JSON.stringify(listaEstudiantesCursos);
	fs.writeFileSync('./src/listadoInscritos.json', datos);
}

const eliminarInscrito = (estudiante, curso) => {
	listarEstudiantesCursos();
	estudianteRemovido = listaEstudiantesCursos.filter(x => x.estudiante == estudiante && x.curso == curso)[0];
	index = listaEstudiantesCursos.indexOf(estudianteRemovido);
	listaEstudiantesCursos.splice(index,1);
	guardarInsctitosync();
}


module.exports = {
	crearEstudiante,
	eliminarInscrito
}