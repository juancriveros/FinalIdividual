const fs = require('fs');
listaEstudiantes = [];

const crear = (est) => {
	listar();
	console.log('metodo crear ');
	let estudiante = {
		id : est.id,
		nombre : est.nombre,
		telefono : est.telefono,
		email : est.email,
		rol: 'aspirante'
	};
	let duplicado = listaEstudiantes.find(x => x.id == est.id);
	if(!duplicado ){
		listaEstudiantes.push(estudiante);
		guardar();
		return 'el usuario ' + estudiante.nombre + ' fue creado con exito';
	}
	else{
		return 'Ya existe ese id';
	}
}

const listar = () => {
	try{
		listaEstudiantes = require('../listadoEstudiantes.json');
	} catch(error){
		listaEstudiantes = [];
	}
	

}

const guardar = () => {
	let datos = JSON.stringify(listaEstudiantes);
	fs.writeFile('./src/listadoEstudiantes.json', datos, (err)=>{
		if(err) throw (err);
		console.log('Archivo creado con exito');
	})
}


const guardarEstudiantesync = () => {
	let datos = JSON.stringify(listaEstudiantes);
	fs.writeFileSync('./src/listadoEstudiantes.json', datos);
}


const actualizar = (est) => {
	listar();
	console.log('Actualizando ')
	let estudiante = listaEstudiantes.find(x => x.id == est.id);
	console.log(est.id);
	estudiante.nombre = est.nombre;
	estudiante.telefono = est.telefono;
	estudiante.email = est.email;
	estudiante.rol = est.rol;

	console.log(listaEstudiantes);

	guardarEstudiantesync();
}



module.exports = {
	crear,
	actualizar
}