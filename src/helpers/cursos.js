const fs = require('fs');
listaCursos = [];

const crear = (curso) => {
	listar();
	console.log('metodo crear ');
	console.log(listaCursos);
	let cur = {
		id : curso.id,
		nombre : curso.nombre,
		valor : curso.valor,
		modalidad : curso.modalidad,
		descripcion : curso.descripcion,
		intensidad : curso.intensidad,
		estado : curso.estado
	};
	let duplicado = listaCursos.find(x => x.id == cur.id);
	if(!duplicado ){
		listaCursos.push(cur);
		console.log('creacion');
		console.log(listaCursos);
		guardar();
		return cur.nombre;
	}
	else{
		console.log('Ya existe otro estudiante con ese nombre');
		return 'Ya existe ese id';
	}
}

const listar = () => {
	try{
		listaCursos = require('../listadoCursos.json');
	} catch(error){
		listaCursos = [];
	}
	

}

const guardar = () => {
	let datos = JSON.stringify(listaCursos);
	fs.writeFile('./src/listadoCursos.json', datos, (err)=>{
		if(err) throw (err);
		console.log('Archivo creado con exito');
	})
}

const guardarCursosync = () => {
	let datos = JSON.stringify(listaCursos);
	fs.writeFileSync('./src/listadoCursos.json', datos);
}


const actualizarEstado = (curso) => {
	listar();
	let estado = listaCursos.filter(x => x.id == curso)[0].estado;
	console.log(estado);
	if(estado == "Activo"){
		estado = "Inactivo";
	}
	else{
		estado = "Activo";
	}
	console.log(estado);

	listaCursos.filter(x => x.id == curso)[0].estado = estado;
	guardarCursosync();
}


module.exports = {
	crear,
	actualizarEstado
}