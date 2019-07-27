const mongoose = require('mongoose');
//var uniqueValidator = require('mongoose-unique-validator');


const Schema = mongoose.Schema;
const inscritosSchema = new Schema({
	estudiante : {
		type : Number, 
		require : true
	},
	curso : {
		type : Number, 
		require : true
	}
})


//inscritosSchema.plugin(uniqueValidator, { message: 'Ya existe un usuario con el documento ingresado.' });
inscritosSchema.set('autoIndex', false);
const Inscrito = mongoose.model('Inscrito', inscritosSchema);


module.exports = Inscrito;