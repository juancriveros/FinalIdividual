const hbs = require('hbs');
const adminCursos= require('./cursos');
const adminInscritos= require('./inscritos');
const adminEstudiantes= require('./estudiantes');
const fs = require('fs');
const path = require('path');

hbs.registerHelper('obtenerPromedio', (nota1, nota2, nota3) => {
	return (nota1 + nota2 + nota3)/3;
})


hbs.registerHelper('ListarCursos', (cursos, admin) => {
	/*let directorioListado = path.join(__dirname, '../listadoCursos.json');
	listaCursos = JSON.parse(fs.readFileSync(directorioListado));*/
	i = 1;
	let texto ;
	if(admin){
		texto = "<table class='table table-hover'> \
		<thead class='thead-dark'> \
		<th> Id </th> \
		<th> Nombre </th> \
		<th> Descripción </th> \
		<th> Valor </th> \
		<th> Modalidad </th> \
		<th> Intensidad </th> \
		<th> Estado </th> \
		</thead> \
		<tbody>";

		cursos.forEach(curso => {
			texto = texto + 
			'<tr>' +
			'<td>' + curso.identificador + '</td>' +
			'<td>' + curso.nombre + '</td>' + 
			'<td>' + curso.descripcion + '</td>' +
			'<td>' + curso.valor + '</td>' +
			'<td>' + curso.modalidad + '</td>' +
			'<td>' + curso.intensidad + '</td>' +
			'<td>' + curso.estado + '</td>' +
			'</tr>';


		})
	}else{
		texto = "<table class='table table-hover'> \
		<thead class='thead-dark'> \
		<th> Id </th> \
		<th> Nombre </th> \
		<th> Descripción </th> \
		<th> Valor </th> \
		</thead> \
		<tbody>";
		cursos.forEach(curso => {
			texto = texto +
			`
			<tr data-toggle="collapse" data-target="#collapse${i}" class="clickable" aria-controls="collapse${i}">
			<td> ${curso.identificador} </td>
			<td> ${curso.nombre} </td>
			<td> ${curso.descripcion} </td>
			<td> ${curso.valor} </td>
			</tr>
			<tr id="collapse${i}" class="collapse" aria-labelledby="heading${i}">
			<td colspan="4">
			<div style="white-space: pre-wrap;">
			Modalidad = ${curso.modalidad} 
			Estado  = ${curso.estado}
			Intensidad horaria = ${curso.intensidad}
			</div>
			</td>
			</tr>
			`;

			i = i+1;
		})
	}
	texto = texto + '</tbody></table>';
	return texto;
})

hbs.registerHelper('ListarCursosDropdown', (activos) => {

	let texto = `<select  class="form-control" name="curso" id="curso" required>
	<option value="">-</option>
	`;
	activos.forEach(curso => {
		texto = texto + 
		`<option value="${curso.identificador}">${curso.nombre}</option>`;
	})
	texto = texto + '</select>';
	return texto;
})

hbs.registerHelper('ListarDocentes', (docentes) => {

	let texto = `<select  class="form-control" name="docente" id="docente" required>
	<option value="">-</option>
	`;
	docentes.forEach(docente => {
		texto = texto + 
		`<option value="${docente.documento}">${docente.nombre}</option>`;
	})
	texto = texto + '</select>';
	return texto;
})

hbs.registerHelper('ListarCursosInscrito', (cursos, cursosInscrito) => {

	j=1;
	let texto = `<div class="form-row form-dark">
	<div class="col">
	<label>Id</label>
	</div>
	<div class="col">
	<label>Nombre</label>
	</div>
	<div class="col">
	<label>Valor</label>
	</div>
	<div class="col">
	<label>Eliminar</label>
	</div>
	</div>`;
	cursosInscrito.forEach(inscrito => {
		let curso = cursos.filter(x => x.identificador == inscrito.curso && x.estado == 'Disponible')
		if(curso.length > 0){
			texto = texto + ` <form action="/EliminarInscrito" method="post"> 
			<div class="form-row" style="padding-top: 10px;">
			<div class="col">
			<label>${curso[0].identificador}</label>
			<input style="visibility:hidden" type="number" class="form-control" name="cursoId" value="${curso[0].identificador}">
			</div>
			<div class="col">
			<label for="Id">${curso[0].nombre}</label>
			</div>
			<div class="col">
			<label for="Id">${curso[0].valor}</label>
			</div>
			<div class="col">
			<button type="submit" class="btn btn-primary">Eliminar</button>
			</div>
			</div>
			</form>
			`;
			j = j+1;
		}
	});
	texto = texto + '</div>';
	return texto;
})

hbs.registerHelper('ListarCursosInscritoCerrados', (cursos, cursosInscrito) => {

	j=1;
	let texto = `<div class="form-row form-dark">
	<div class="col">
	<label>Id</label>
	</div>
	<div class="col">
	<label>Nombre</label>
	</div>
	<div class="col">
	<label>Valor</label>
	</div>
	<div class="col">
	<label>Info</label>
	</div>
	</div>`;
	cursosInscrito.forEach(inscrito => {
		let curso = cursos.filter(x => x.identificador == inscrito.curso && x.estado == 'Cerrado')
		if(curso.length > 0){
			texto = texto + ` 
			<div class="form-row" style="padding-top: 10px;">
			<div class="col">
			<label>${curso[0].identificador}</label>
			<input style="visibility:hidden" type="number" class="form-control" name="cursoId" value="${curso[0].identificador}">
			</div>
			<div class="col">
			<label for="Id">${curso[0].nombre}</label>
			</div>
			<div class="col">
			<label for="Id">${curso[0].valor}</label>
			</div>
			<div class="col">
			<a class="btn btn-primary href="/InfoCurso?cursoid=${curso[0].identificador}">Ver mas</button>
			</div>
			</div>
			
			`;
			j = j+1;
		}
	});
	texto = texto + '</div>';
	return texto;
})


hbs.registerHelper('ListarInscritos', (cursos, usuarios, inscritos) => {

	let texto = "<div class='accordion' id='accordionExample'>";
	let listaInscritosFiltrada = [];
	i = 1;
	j=1;
	cursos.forEach(curso => {
		listaInscritosFiltrada = inscritos.filter(x => x.curso == curso.identificador)
		texto = texto + 
		`<div class="card"> 
		<div class="card-header" id="heading${i}">
		<h2 class="mb-0">
		<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
		${curso.nombre}
		</button>
		</h2>
		</div>

		<div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">\
		<div class="card-body">
		<div class="form-row form-dark">
		<div class="col">
		<label>Id</label>
		</div>
		<div class="col">
		<label>Nombre</label>
		</div>
		<div class="col">
		<label>Telefono</label>
		</div>
		<div class="col">
		<label>Email</label>
		</div>
		<div class="col">
		<label>Eliminar</label>
		</div>
		</div>

		`;
		listaInscritosFiltrada.forEach(inscrito => {
			let estudiante = usuarios.filter(x => x.documento == inscrito.estudiante)
			texto = texto + ` <form action="/EliminarInscritoAdmin" method="post"> 
			<div class="form-row" style="padding-top: 10px;">
			<div class="col">
			<label>${estudiante[0].documento}</label>
			<input style="visibility:hidden" type="number" class="form-control" name="EstudianteId" value="${estudiante[0].documento}">
			<input style="visibility:hidden" type="number" class="form-control" name="cursoId" value="${curso.identificador}">
			</div>
			<div class="col">
			<label for="Id">${estudiante[0].nombre}</label>
			</div>
			<div class="col">
			<label for="Id">${estudiante[0].telefono}</label>
			</div>
			<div class="col">
			<label for="Id">${estudiante[0].correo}</label>
			</div>
			<div class="col">
			<button type="submit" class="btn btn-primary">Eliminar</button>
			</div>
			</div>
			</form>
			`;
			j = j+1;
		});

		texto = texto +`  </tbody></table>  </div> 
		</div>
		</div>`;
		i = i+1;

	})
	texto = texto + '</div>';
	return texto;
})




hbs.registerHelper('ListarUsuarios', (usuarios) => {
	j=1;
	let texto = `<div class="form-row form-dark">
	<div class="col">
	<label>Id</label>
	</div>
	<div class="col">
	<label>Nombre</label>
	</div>
	<div class="col">
	<label>Telefono</label>
	</div>
	<div class="col">
	<label>Email</label>
	</div>
	<div class="col">
	<label>Actualizar</label>
	</div>
	</div>`;
	usuarios.forEach(user => {
		texto = texto + ` <form action="/ListarUsuarios" method="post"> 
		<div class="form-row" style="padding-top: 10px;">
		<div class="col" style="display:inline-flex">
		<input style="visibility:hidden; height:0px; width:0px" type="number" class="form-control" name="id" value="${user.documento}">
		<label for="Id">${user.documento}</label>
		</div>
		<div class="col">
		<label for="Id">${user.nombre}</label>
		</div>
		<div class="col">
		<label for="Id">${user.telefono}</label>
		</div>
		<div class="col">
		<label for="Id">${user.correo}</label>
		</div>
		<div class="col">
		<button type="submit" class="btn btn-primary">Actualizar</button>
		</div>
		</div>
		</form>
		`;
		j = j+1;
	});
	texto = texto + '</div>';
	return texto;
})

hbs.registerHelper('ListarRolesDropdown', (rol) => {

	let texto = `<select  class="form-control" name="rol" id="curso" required>
	<option value="">-</option>
	`;
	if(rol == 'Aspirante'){
		texto = texto + `<option selected value="Aspirante">Aspirante</option>
		<option value="Docente">Docente</option>`;
	}
	else 
	{
		texto = texto + `<option value="Aspirante">Aspirante</option>
		<option selected  value="Docente">Docente</option>`;
	}
	texto = texto + '</select>';
	return texto;
})


hbs.registerHelper('ListaCursosDocente', (cursos, usuarios, inscritos, cursosDocente) => {

	let texto = "<div class='accordion' id='accordionExample'>";
	let listaInscritosFiltrada = [];
	i = 1;
	j=1;
	texto = texto + 
			`
			<div class="form-row form-dark">
			<div class="col">
			<label>Id</label>
			</div>
			<div class="col">
			<label>Nombre</label>
			</div>
			<div class="col">
			<label>Valor</label>
			</div>
			<div class="col">
			<label>Descripción</label>
			</div>
			<div class="col">
			<label>Ver Inscritos</label>
			</div>
			</div>`;
	cursosDocente.forEach(cursoAsgindado => {
		listaCursosFiltrada = cursos.filter(x => x.identificador == cursoAsgindado.curso);
		listaCursosFiltrada.forEach(curso => {
			listaInscritosFiltrada = inscritos.filter(x => x.curso == curso.identificador)
			texto = texto + 
			`
			
			<div class="form-row" style="padding-top: 10px;">
			<div class="col">
			<label>${curso.identificador}</label>
			</div>
			<div class="col">
			<label for="Id">${curso.nombre}</label>
			</div>
			<div class="col">
			<label for="Id">${curso.valor}</label>
			</div>
			<div class="col">
			<label for="Id">${curso.descripcion}</label>
			</div>
			<div class="col">
			<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
			Ver Inscritos
			</button>
			</div>
			</div>

			
			

			<div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">\
			<div class="card-body">
			<div class="form-row form-dark">
			<div class="col">
			<label>Id</label>
			</div>
			<div class="col">
			<label>Nombre</label>
			</div>
			<div class="col">
			<label>Telefono</label>
			</div>
			<div class="col">
			<label>Email</label>
			</div>
			</div>

			`;
			listaInscritosFiltrada.forEach(inscrito => {
				let estudiante = usuarios.filter(x => x.documento == inscrito.estudiante)
				texto = texto + ` 
				<div class="form-row" style="padding-top: 10px;">
				<div class="col">
				<label>${estudiante[0].documento}</label>
				<input style="visibility:hidden" type="number" class="form-control" name="EstudianteId" value="${estudiante[0].documento}">
				<input style="visibility:hidden" type="number" class="form-control" name="cursoId" value="${curso.identificador}">
				</div>
				<div class="col">
				<label for="Id">${estudiante[0].nombre}</label>
				</div>
				<div class="col">
				<label for="Id">${estudiante[0].telefono}</label>
				</div>
				<div class="col">
				<label for="Id">${estudiante[0].correo}</label>
				</div>
				</div>
				`;
				j = j+1;
			});
		});

		texto = texto +`  </tbody></table>  </div> 
		</div>
		</div>`;
		i = i+1;

	})
	texto = texto + '</div>';
	return texto;

	
})










