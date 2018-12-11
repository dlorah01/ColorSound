import { Component } from '@angular/core';
import { NavController,  NavParams  } from 'ionic-angular';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { HomePage } from './../home/home';


@Component({
  selector: 'page-home3',
  templateUrl: 'home3.html'
})
export class HomePage3 {
	textColor: string = "#000000";
	text: string;
	song: any;
	texto: string = "3. Listo! Ya está transformado. Toca el botón que está en el centro de la pantalla para reproducir el sonido. Para empezar de nuevo toca el botón que está en la zona inferior de la pantalla.";

  constructor(public navCtrl: NavController, private tts: TextToSpeech, public navParams: NavParams) {
  	this.text = this.navParams.get('text');
  	this.song = this.navParams.get('song');
  	this.textColor = this.navParams.get('textColor');
  	console.log("blabal "+this.textColor);
  }

  //Cuando se carga completamente la vista
  ionViewDidLoad() {
    setTimeout( () => {
     // somecode
  }, 2000);
    console.log("I'm alive!");
    this.tts.speak({
      text: this.texto,
      rate: 12 / 10,
      locale: "es-ES"
    })
   .then(() => console.log('Success'))
   .catch((reason: any) => console.log(reason));
  }

  //Metodo que reproduce el parrafo de la vista
  reproducir(){

  	setTimeout( () => {
     // somecode
	}, 2000);
    console.log("I'm alive!");
    this.tts.speak({
      text: this.texto,
      rate: 12 / 10,
      locale: "es-ES"
    })
   .then(() => console.log('Success'))
   .catch((reason: any) => console.log(reason));
  }

  //Reproducir sonido
  boton(){
    this.tts.stop();
    this.tts.speak({
      text: "Reproduciendo.",
      rate: 12 / 10,
      locale: "es-ES"
    })
   .then(() => {var Sound = (function () {
    var df = document.createDocumentFragment();
    return function Sound(src) {
      var snd = new Audio(src);
      df.appendChild(snd); // keep in fragment until finished playing
      snd.addEventListener('ended', function () {df.removeChild(snd);});
      console.log("va a play");
      snd.play();
      return snd;
    }
   }());

   // then do it
   var snd = Sound(this.text);})
   .catch((reason: any) => console.log(reason));
  }

  begin(){

    this.tts.stop();
    this.tts.speak({
      text: "Empezar de nuevo.",
      rate: 12 / 10,
      locale: "es-ES"
    })
   .then(() => {
     this.navCtrl.remove(1,1); // This will remove the 'ResultPage' from stack.
      this.navCtrl.pop();  // This will pop the 'DetailPage', and take you to 'SearchPage'
   })
   .catch((reason: any) => console.log(reason));
  }
}