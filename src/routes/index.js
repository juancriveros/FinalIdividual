const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const Usuario = require('./../models/usuarios');
const Curso = require('./../models/cursos');
const Inscrito = require('./../models/inscritos');
const CursosDocente = require('./../models/cursosDocente');
const multer = require('multer');
const bcrypt = require('bcrypt');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const fs = require('fs');

const directorioListadoCursos = path.join(__dirname, '../listadoCursos.json');
const directorioListadoEstudiantes = path.join(__dirname, '../listadoEstudiantes.json');
const directorioListadoInscritos = path.join(__dirname, '../listadoInscritos.json');
const directioPartial = path.join(__dirname, '../../template/Partials');
const directioViews = path.join(__dirname, '../../template/views');

require('./../helpers/helpers');
require('./../helpers/cursos');
const estudiante = [];

app.set('view engine', 'hbs');
app.set('views', directioViews);
hbs.registerPartials(directioPartial);

var upload = multer({
	limits:{
		filesize : 10000000
	},
	filefilter(req, file, cb){
		if(!file.originalname.match(/\.(jpg|png|jpeg)$/)){
			return cb(new Error('No es un archivo valido'));
		}


		cb(null, true);

	}
});

function ObtenerCursos(rolUsuario, res, req, extra)
{
	var query;
	var Rol;
	if (rolUsuario == 'Coordinador'){
		Rol = 'Admin'
		Curso.find({}).exec((err,resultCursos) => {
			if(err){
				return res.render('VerCursos', {
					CursoCreado: err
				});
			}

			Usuario.find({rol: 'Docente'}).exec((err,result) => {
				if(err){
					return res.render('VerCursos', {
						CursoCreado: err
					});
				}

				res.render('VerCursos', {
					cursos: resultCursos,
					Rol : Rol, 
					CursoCreado : extra,
					activos : resultCursos.filter(x => x.estado == "Disponible"),
					sesion : true,
					nombre : req.session.nombre,
					usuario : req.session.usuario, 
					admin : true,
					docente : false,
					docentes : result
				});
			})
			
		})
	}
	else if (rolUsuario == 'Aspirante') {

		Rol = 'Interesado'

		Curso.find({estado : 'Disponible'}).exec((err,resultCursos) => {
			if(err){
				return res.render('VerCursos', {
					CursoCreado: err
				});
			}

			res.render('VerCursos', {
				cursos: resultCursos,
				Rol : Rol, 
				CursoCreado : extra,
				activos : resultCursos.filter(x => x.estado == "Disponible"),
				sesion : true,
				nombre : req.session.nombre,
				usuario : req.session.usuario, 
				admin : false,
				docente : false
			});
			
		})
	}
	else{
		Rol = 'Docente'

		CursosDocente.find({docente : req.session.usuario}).exec((err,resultDocente) => {
			if(err){
				return res.render('VerCursos', {
					CursoCreado: err
				});
			}

			Inscrito.find().exec((err,resultInscritos) =>{
				if(err){
					return res.render('VerCursos', {
						CursoCreado: err
					});
				}

				Curso.find({estado : 'Cerrado'}).exec((err,resultCursos) => {
					if(err){
						return res.render('VerCursos', {
							CursoCreado: err
						});
					}		


					Usuario.find({}, (err, resultUsuarios) => {
						if(err){

						}
						res.render('VerCursos', {
							cursos: resultCursos,
							Rol : Rol, 
							CursoCreado : extra,
							activos : resultCursos.filter(x => x.estado == "Disponible"),
							sesion : true,
							nombre : req.session.nombre,
							usuario : req.session.usuario, 
							admin : false,
							docente : true,
							cursos:  resultCursos, 
							usuarios: resultUsuarios,
							inscritos : resultInscritos,
							cursosDocente : resultDocente
						});
					})
				})
			})
		})
		
	}
}


app.get('/index', (req, res) => {

	res.render('index', {
	});
})


app.get('', (req, res) => {
	res.render('Login', {

	});
})


app.get('/Login', (req, res) => {
	res.render('Login', {
	});
})


app.post('/Login', (req,res) => {

	Usuario.findOne({documento : req.body.id}).exec((err,result) => {
		if(err){
			return res.render('Login', {
				inscrito :err
			});
		}

		if(result == null){
			return res.render('Login', {
				inscrito : "El id ingresado no existe, registrese en el sistema primero"
			});
		}
		else if(!bcrypt.compareSync(req.body.password, result.password)){
			return res.render('Login', {
				inscrito : "La contraseña es incorrecta"
			});
		}
		else{
			
			req.session.admin = (result.rol == 'Coordinador');
			req.session.docente = (result.rol == 'Docente');
			req.session.usuario = result.documento;
			req.session.nombre = result.nombre;
			req.session.rol = result.rol;

			return ObtenerCursos(req.session.rol, res, req);
		}

	})

})

app.post('/Registro', upload.single('foto'), (req,res) => {

	let usuario = new Usuario ({
		documento: req.body.id,
		nombre: req.body.nombre,
		telefono: req.body.telefono,
		correo: req.body.email,
		password: bcrypt.hashSync(req.body.password, 10),
		avatar: req.file.buffer 
	})

	const msg = {
		to: req.body.email,
		from: 'juan.camilo.riveros@hotmail.com',
		subject: 'Bienvenido',
		text: 'Bienvenido a la página de JsPartour, aca encontrara diversos cursos para inscribirse'
	};

	console.log(msg);

	usuario.save((err, result) => {
		if(err){
			return res.render('Registro', {
				duplicado: err
			});
		}

		sgMail.send(msg);

		res.render('Login', {
			inscrito: "El estudiante " + result.nombre + " quedo inscrito, por favor inicie sesión"
		});

	})
})

app.get('/Registro', (req, res) => {

	res.render('Registro', {

	});
})


app.get('/VerCursos', (req,res) => {

	return ObtenerCursos(req.session.rol, res, req);
})

app.get('/CursoCreado', (req,res) => {
	return res.render('CrearCurso', {
	});
})

app.post('/CursoCreado', (req,res) => {

	let curso = new Curso ({
		identificador: parseInt(req.body.id),
		nombre: req.body.nombre,
		modalidad : req.body.modalidad,
		valor: parseInt(req.body.valor),
		intensidad : req.body.intensidad,
		descripcion : req.body.descripcion,
	})

	curso.save((err, result) => {

		if(err){
			return res.render('CrearCurso', {
				duplicado: err
			});
		}

		return ObtenerCursos(req.session.rol, res, req, "El curso " + result.nombre + " fue creado correctamente");

	})
})

app.post('/ActualizarEstado', (req,res) => {

	Curso.findOneAndUpdate({identificador : req.body.curso}, {estado : 'Cerrado'}, {new : true}, (err, resultCurso) => {
		if(err){
			return res.render('VerCursos', {
				CursoCreado: err
			});
		}

		let cursoDocente = new CursosDocente ({
			docente : req.body.docente,
			curso : parseInt(req.body.curso)
		})

		cursoDocente.save((err,result) =>{
			if(err){
				return res.render('VerCursos', {
					CursoCreado: err
				});
			}

			let estudiantesInscritos = '';
			let numeroInscritos = 0;

			Inscrito.find({}).exec((err,resultInscritos) => {
				if(err){
					return res.render('VerCursos', {
						CursoCreado: err
					});
				}

				resultInscritos.forEach(function(item){
					Usuario.find({documento : item.estudiante}).exec((err,resultUsuarios) => {
						numeroInscritos ++;
						console.log(resultUsuarios[0].documento)
						estudiantesInscritos = estudiantesInscritos + 'Documento: ' + resultUsuarios[0].documento + ' Nombre: ' + resultUsuarios[0].nombre + '<br>';

						if(numeroInscritos === resultInscritos.length) {
							console.log('mail enviado');
							console.log(estudiantesInscritos)

							const msg = {
								to: 'juan.camilo.riveros9220@gmail.com',
								from: 'juan.camilo.riveros@hotmail.com',
								subject: resultCurso.nombre + ' Asignado',
								html: 'Hola <br> <br> El curso ' + resultCurso.nombre + ' te ha sido asignado y los siguientes estudiantes estan inscritos: <br><br>' + estudiantesInscritos
							};




							sgMail.send(msg);

						}
					})
				})

				
			})

			ObtenerCursos(req.session.rol, res, req, "El curso " + resultCurso.nombre + " se cerro");
		})
	})
})


app.get('/Inscripcion', (req,res) => {

	Usuario.findOne({documento : req.session.usuario}, (err,resultEstudiante) => {
		if(err){
			return res.render('Inscripcion', {
				error: err
			});
		}

		Curso.find({estado : 'Disponible'}).exec((err,result) => {
			if(err){
				return res.render('Inscripcion', {
					error: err
				});
			}

			res.render('Inscripcion', {
				nombre: resultEstudiante.nombre, 
				id: resultEstudiante.documento,
				telefono: resultEstudiante.telefono,
				email: resultEstudiante.correo,
				activos: result
			});
		}) 	
	})


})

app.post('/EstudianteInscrito', (req,res) => {

	let inscrito = new Inscrito ({
		estudiante : req.session.usuario,
		curso : parseInt(req.body.curso)
	})

	Inscrito.find({estudiante:req.session.usuario, curso:req.body.curso}, (err,result) =>{
		if(err){
			return res.render('ListarCursosInscrito', {
				msg: err
			});
		}

		if(result.length == 0){
			inscrito.save((err, resultInscrito) => {
				if(err){
					return res.render('ListarCursosInscrito', {
						msg: err
					});
				}

				Inscrito.find({estudiante : req.session.usuario}, (err,resultInscritos) =>{
					if(err){
						return res.render('ListarCursosInscrito', {
							msg: err
						});
					}



					Curso.find({estado : 'Disponible'}, (err,resultCursos) => {
						if(err){
							return res.render('ListarCursosInscrito', {
								msg: err
							});
						}

						res.render('ListarCursosInscrito', {
							cursos : resultCursos,
							cursosInscrito : resultInscritos
						});
					})


				})


			})
		}
		else{
			Usuario.findOne({documento : req.session.usuario}, (err,resultEstudiante) => {
				if(err){
					return res.render('Inscripcion', {
						error: err
					});
				}

				Curso.find({estado : 'Disponible'}).exec((err,result) => {
					if(err){
						return res.render('Inscripcion', {
							error: err
						});
					}

					res.render('Inscripcion', {
						nombre: resultEstudiante.nombre, 
						id: resultEstudiante.documento,
						telefono: resultEstudiante.telefono,
						email: resultEstudiante.correo,
						activos: result,
						error: "Ya esta inscrito en el curso"
					});
				}) 	
			})
		}

	})
	/**/

})


app.get('/ListarCursosInscrito', (req, res) => {

	Inscrito.find({estudiante : req.session.usuario}, (err,resultInscritos) =>{
		if(err){
			return res.render('ListarCursosInscrito', {
				msg: err
			});
		}

		Curso.find({estado : 'Disponible'}, (err,resultCursos) => {
			if(err){
				return res.render('ListarCursosInscrito', {
					msg: err
				});
			}

			res.render('ListarCursosInscrito', {
				cursos : resultCursos,
				cursosInscrito : resultInscritos
			});
		})


	})
})

app.post('/EliminarInscrito', (req,res) => {

	Inscrito.findOneAndDelete({estudiante:req.session.usuario, curso:req.body.cursoId}, (err,result) => {
		if(err){
			return res.render('ListarCursosInscrito', {
				msg: err
			});
		}

		Inscrito.find({estudiante : req.session.usuario}, (err,resultInscritos) =>{
			if(err){
				return res.render('ListarCursosInscrito', {
					msg: err
				});
			}

			Curso.find({estado : 'Disponible'}, (err,resultCursos) => {
				if(err){
					return res.render('ListarCursosInscrito', {
						msg: err
					});
				}

				res.render('ListarCursosInscrito', {
					cursos : resultCursos,
					cursosInscrito : resultInscritos,
					msg: "eliminado correctamente del curso"
				});
			})


		})
	})
})



app.get('/VerInscritos', (req,res) => {

	Inscrito.find({}, (err,resultInscritos) =>{
		if(err){
			return res.render('ListarInscritos', {
				msg: err
			});
		}

		Curso.find({estado : 'Disponible'}, (err,resultCursos) => {
			if(err){
				return res.render('ListarInscritos', {
					msg: err
				});
			}

			Usuario.find({}, (err, resultUsuarios) => {
				if(err){

				}
				res.render('ListarInscritos', {
					cursos : resultCursos,
					usuarios : resultUsuarios,
					inscritos : resultInscritos,
				});
			})
		})


	})
})


app.post('/EliminarInscritoAdmin', (req, res) => {

	Inscrito.findOneAndDelete({estudiante:req.body.EstudianteId, curso:req.body.cursoId}, (err,result) => {
		if(err){
			return res.render('ListarInscritos', {
				msg: err
			});
		}

		Inscrito.find({}, (err,resultInscritos) =>{
			if(err){
				return res.render('ListarInscritos', {
					msg: err
				});
			}

			Curso.find({estado : 'Disponible'}, (err,resultCursos) => {
				if(err){
					return res.render('ListarInscritos', {
						msg: err
					});
				}

				Usuario.find({}, (err, resultUsuarios) => {
					if(err){

					}
					res.render('ListarInscritos', {
						cursos : resultCursos,
						usuarios : resultUsuarios,
						inscritos : resultInscritos,
						msg: "Eliminado correctamente"
					});
				})
			})


		})
	})

})



app.post('/Salir', (req,res) => {
	req.session.destroy((err) => {
		if(err) return console.log(err)
	})
	res.redirect('/');
})

app.get('/ListarUsuarios', (req, res) => {

	Usuario.find({}, (err, result) => {
		if(err){
			return res.render('ListarUsuarios', {
				msg:err
			});
		}

		res.render('ListarUsuarios', {
			usuarios:result
		});
	})
})

app.post('/ListarUsuarios', (req, res) => {

	Usuario.findOne({documento : req.body.id}, (err, result) => {
		if(err){
			return res.render('ListarUsuarios', {
				msg:err
			}); 
		}
		console.log(result.nombre)
		res.render('ActualizarUsuario', {
			id: result.documento,
			nombre: result.nombre,
			telefono: result.telefono,
			email: result.correo,
			rol: result.rol
		});
	})
})


app.post('/ActualizarUsuario', (req,res) => {

	Usuario.findOneAndUpdate({documento : req.body.id}, req.body , {new : true}, (err, result) => {
		if(err){
			return res.render('ListarUsuarios', {
				msg:err
			});
		}

		Usuario.find({}, (err, result) => {
			if(err){
				return res.render('ListarUsuarios', {
					msg:err
				});
			}

			res.render('ListarUsuarios', {
				usuarios:result
			});
		})

	})
})


app.get('/Perfil', (req, res) => {

	Usuario.findOne({documento : req.session.usuario}, (err, result) => {
		if(err){
			return res.render('Perfil', {
				msg:err
			}); 
		}
		
		avatar = ''
		if(result.avatar != null)
			avatar = result.avatar.toString('base64');

		res.render('Perfil', {
			id: result.documento,
			nombre: result.nombre,
			telefono: result.telefono,
			email: result.correo,
			avatar: avatar
		});
	})
})

app.post('/Perfil', upload.single('foto'), (req, res) => {

	if(req.file == null){
		usuarioActualizado = {
			documento : req.body.id,
			nombre : req.body.nombre, 
			correo: req.body.correo,
			telefono: req.body.telefono
		}

		console.log(usuarioActualizado);
	}else{
		usuarioActualizado = {
			documento : req.body.id,
			nombre : req.body.nombre, 
			correo: req.body.correo,
			telefono: req.body.telefono,
			avatar: req.file.buffer
		}
		console.log(usuarioActualizado);

	}

	Usuario.findOneAndUpdate({documento : req.body.id}, usuarioActualizado , {new : true}, (err, result) => {
		if(err){
			return res.render('Perfil', {
				msg:err
			}); 
		}
		
		avatar = ''
		if(result.avatar != null)
			avatar = result.avatar.toString('base64');

		res.render('Perfil', {
			id: result.documento,
			nombre: result.nombre,
			telefono: result.telefono,
			email: result.correo,
			avatar: avatar
		});

	})

})


app.get('/ChatRoom', (req,res) => {
	res.render('ChatRoom', {
	});
})



app.get('*', (req,res) => {
	res.render('index', {
	});
})


module.exports = app;
