var app = {

	inicio: function(){

		diametro_bola = 50;
		dificultad = 0;
		velocidadX = 0;
		velocidadY = 0;
		puntuacion = 0;

		alto = document.documentElement.clientHeight; 	//Alto pantalla
		ancho = document.documentElement.clientWidth;	//Ancho pantalla

		app.vigilaSensores();
		app.iniciaJuego();
	},

	//Funcion que inicia el juego 
	iniciaJuego: function(){

		//Carga el juego
		function preload(){
			game.physics.startSystem(Phaser.Physics.ARCADE);	//Motor Fisica

			game.stage.backgroundColor = '#f27d0c';
			game.load.image('bola','assets/bola.png');	//bola
			game.load.image('objetivo','assets/objetivo.png');	//objetivo
		}

		//Funcion crear
		function create(){
			scoreText = game.add.text(16,16,puntuacion,{fontsize:'100px', fill:'#757676'});	//texto

			objetivo = game.add.sprite(app.inicioX(), app.inicioY(), 'objetivo');
			bola = game.add.sprite(app.inicioX(),app.inicioY(), 'bola');

			game.physics.arcade.enable(bola);
			game.physics.arcade.enable(objetivo);

			bola.body.collideWorldBounds = true;
			bola.body.onWorldBounds = new Phaser.Signal();
			bola.body.onWorldBounds.add(app.decrementaPuntuacion, this);
		}

		//Funcion Actualizar
		function update(){
			var factorDificultad = (300 + (dificultad * 100));

			bola.body.velocity.y = (velocidadY * factorDificultad);	//dificultad
			bola.body.velocity.x = (velocidadX * (-1 * factorDificultad));

			//Cruce de bola y objetivo
			game.physics.arcade.overlap(bola, objetivo, app.incrementaPuntuacion, null, this);
		}

		var estados = {preload: preload, create: create, update: update};
		var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser', estados);
	},

	//Funcion decrementa puntuacion
	decrementaPuntuacion: function(){
		puntuacion = puntuacion-1;
		scoreText.text = puntuacion;

		if(puntuacion < 0){
			puntuacion = 1;
		}
	},

	//Funcion incrementa puntuacion
	incrementaPuntuacion: function(){
		puntuacion = puntuacion+1;
		scoreText.text = puntuacion;

		objetivo.body.x = app.inicioX();
		objetivo.body.y = app.inicioY();

		if(puntuacion > 0){
			dificultad = dificultad + 1;
		}
	},

	inicioX: function(){
		return app.numeroAleatorioHasta(ancho - diametro_bola);
	},

	inicioY: function(){
		return app.numeroAleatorioHasta(alto - diametro_bola);
	},

	numeroAleatorioHasta: function(limite){
		return Math.floor(Math.random() * limite);
	},

	vigilaSensores: function(){

		function onError(){
			console.log('onError');
		}

		function onSuccess(datosAceleracion){
			app.detectaAgitacion(datosAceleracion);
			app.registraDireccion(datosAceleracion);
		}

		navigator.accelerometer.watchAcceleration(onSuccess, onError,{ frequency:10});
	},


	detectaAgitacion: function(datosAceleracion){
		agitacionX = datosAceleracion.x;
		agitacionY = datosAceleracion.y;

		if(agitacionX > 10 || agitacionY >10){
			setTimeout(app.recomienza, 1000);	//Reiniciamos el juego al agitar
		}
	},

	recomienza: function(){
		document.location.reload(true);
	},

	registraDireccion: function(datosAceleracion){
		velocidadX = datosAceleracion.x;
		velocidadY = datosAceleracion.y;
	}

};

if('addEventListener' in document){
	document.addEventListener('deviceready', function(){
		app.inicio();
	},false);
}