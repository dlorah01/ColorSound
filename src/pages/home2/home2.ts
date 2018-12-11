import { Component } from '@angular/core';
import { NavController,  NavParams, LoadingController  } from 'ionic-angular';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { HomePage3 } from './../home3/home3';
import { TextToSpeech } from '@ionic-native/text-to-speech';




@Component({
  selector: 'page-home2',
  templateUrl: 'home2.html'
})
export class HomePage2 {

  textColor:string ="Hola" ;
	image: string;
	date: any;
	dataAudio:any[];
	wav:any[];
	dataURI:string = '';
	dataURI2: any;
  texto: string = "2. Ya tienes la imagen. Transfórmala tocando la imagen que está en el centro de la pantalla.";
	

  constructor(public navCtrl: NavController, private tts: TextToSpeech, public navParams: NavParams, public loading: LoadingController) {
  	this.image = this.navParams.get('data');
  	this.date = this.navParams.get('date');
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

  //Metodo que transforma la imagen
	transformar(){
    this.tts.stop();
    let loader = this.loading.create({
    content: 'Transformando...',
    });
    this.tts.speak({
      text: "Transformando",
      rate: 12 / 10,
      locale: "es-ES"
    })
   .then(() => console.log('Success'))
   .catch((reason: any) => console.log(reason));
    var song;
    var dataURI;

	  //Agarra la Imagen y obtiene los valores RGB por pixel
    loader.present().then(() => {	
      
  	  var image = new Image();

      //Evento de carga de imagen
  	  image.onload = () =>{

        //Creacion de elemento canvas
        var canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        //Valores para obtención de imagen a valores de sonido
  	    var durationSeconds = 3;
        var tmpData = [];
        var maxFreq = 0;
        var data = [];
        var sampleRate = 44100;
        var channels = 1;
        var numSamples = Math.round(sampleRate * durationSeconds);
        var samplesPerPixel = Math.floor(numSamples / image.width);
        var maxSpecFreq = 20000;
        var C = maxSpecFreq / image.height;
        var yFactor = 100;

        //Obtencion de valores de la imagen
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

        var r=0; var g=0; var b=0; var a=0; var count=0;
        for (var i=0;i<imageData.data.length;i = i+20) {
        ++count;
        r += imageData.data[i];
        g += imageData.data[i+1];
        b += imageData.data[i+2];
        a += imageData.data[i+3];
    }
    
     // ~~ used to floor values
      r = ~~(r/count);
      g = ~~(g/count);
      b = ~~(b/count);
      a = ~~(b/count);
      var valor = "rgba("+r+","+g+","+b+")";
      console.log(r,g,b,a);
      this.textColor = valor;


        r=0;g=0;b=0;a=0;count=0;
    	  // Recorrido de la imagen
        var x = 0; var y = 0;
        var red; var green; var blue; var alpha;
        var pixel_x=0; 
        var rez = 0;

        for (x=0; x<numSamples;x++){
      	  rez=0;
      	  pixel_x = Math.floor(x / samplesPerPixel);

      	  for(y = 0; y < canvas.height; y += yFactor){
            count++;
      		  var pixel_index = (y * canvas.width + pixel_x) * 4;
      	    red = imageData.data[pixel_index]; r+=red;
      	    green = imageData.data[pixel_index + 1];g+=green;
      	    blue = imageData.data[pixel_index + 2];b+=blue;
      	    alpha = imageData.data[pixel_index + 3];a+=alpha;

      	    var s = red + blue + green;
            var volume = Math.pow(s * 100 / 765, 2);
         
            var freq = Math.round(C * (canvas.height - y + 1));
            rez += Math.floor(volume * Math.cos(freq * 6.28 * x / canvas.width));
          }
          tmpData.push(rez);

          if (Math.abs(rez) > maxFreq) {
              maxFreq = Math.abs(rez);
          }
        }
            r = ~~(r/count);
            g = ~~(g/count);
            b = ~~(b/count);
            a = ~~(b/count);

        this.textColor = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        console.log("Esto es: "+this.textColor);
      
        for (var i = 0; i < tmpData.length; i++) {
          data.push(32767 * tmpData[i] / maxFreq); //32767
        }


        //Funciones de Encoder
        function u32ToArray(i) {
          return [i&0xFF, (i>>8)&0xFF, (i>>16)&0xFF, (i>>24)&0xFF];
        }

        function u16ToArray(i) {
          return [i&0xFF, (i>>8)&0xFF];
        }

        function split16bitArray(data) {
          var r = [];
          var j = 0;
          var len = data.length;
          for (var i=0; i<len; i++) {
            r[j++] = data[i] & 0xFF;
            r[j++] = (data[i]>>8) & 0xFF;
            }
          return r;
        }

        //Transformación a Audio
        var chunkId = [0x52,0x49,0x46,0x46]; // 0    4    "RIFF" = 0x52494646
        var chunkSize= 0;                     // 4    4    36+SubChunk2Size = 4+(8+SubChunk1Size)+(8+SubChunk2Size)
        var format = [0x57,0x41,0x56,0x45]; // 8    4    "WAVE" = 0x57415645
        var subChunk1Id = [0x66,0x6d,0x74,0x20]; // 12   4    "fmt " = 0x666d7420
        var subChunk1Size= 16;                    // 16   4    16 for PCM
        var audioFormat= 1;                     // 20   2    PCM = 1
        var numChannels= 1;                    // 22   2    Mono = 1, Stereo = 2....
        var byteRate= 0;                     // 28   4    SampleRate*NumChannels*BitsPerSample/8
        var blockAlign= 0;                     // 32   2    NumChannels*BitsPerSample/8
        var bitsPerSample= 16;                     // 34   2    8 bits = 8, 16 bits = 16
        var subChunk2Id = [0x64,0x61,0x74,0x61]; // 36   4    "data" = 0x64617461
        var subChunk2Size= 0;

        var wav = [];         // Array containing the generated wave file
        dataURI = '';     // http://en.wikipedia.org/wiki/Data_URI_scheme

        blockAlign = (numChannels * bitsPerSample) >> 3;
        byteRate = blockAlign * sampleRate;
        subChunk2Size = data.length * (bitsPerSample >> 3);
        chunkSize = 36 + subChunk2Size;
        wav = chunkId.concat(
          u32ToArray(chunkSize), 
          format, 
          subChunk1Id, 
          u32ToArray(subChunk1Size),
          u16ToArray(audioFormat),
          u16ToArray(numChannels),
          u32ToArray(sampleRate),
          u32ToArray(byteRate),
          u16ToArray(blockAlign),
          u16ToArray(bitsPerSample),
          subChunk2Id,
          u32ToArray(subChunk2Size),
          split16bitArray(data)
         );

        //Base 64
        var chars= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var encLookup= [];

        //Inicializar
        for (var i=0; i<4096; i++) {
          encLookup[i] = chars[i >> 6] + chars[i & 0x3F];
        }

        //Decodifica
        var len = wav.length;
        var dst = '';
        var i = 0;
        while (len > 2) {
            var n = (wav[i] << 16) | (wav[i+1]<<8) | wav[i+2];
            dst+= encLookup[n >> 12] + encLookup[n & 0xFFF];
            len-= 3;
            i+= 3;
        }

        if (len > 0) {
            var n1= (wav[i] & 0xFC) >> 2;
            var n2= (wav[i] & 0x03) << 4;
            if (len > 1) n2 |= (wav[++i] & 0xF0) >> 4;
            dst+= chars[n1];
            dst+= chars[n2];
            if (len == 2) {
                var n3= (wav[i++] & 0x0F) << 2;
                n3 |= (wav[i] & 0xC0) >> 6;
                dst+= chars[n3];
            }
            if (len == 1) dst+= '=';
            dst+= '=';
        }
        dataURI = 'data:audio/wav;base64,'+ dst;

        console.log("Aquie es: " +dataURI);

         var byteString;
         if (dataURI.split(',')[0].indexOf('base64') >= 0){
          byteString = atob(dataURI.split(',')[1]);
         }
         else{
          byteString = decodeURI(dataURI.split(',')[1]);
        }

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        song = new Blob([ia], {type: mimeString});

        this.pushear(dataURI, song);
        console.log("songooooooo es: "+song);
        loader.dismiss();
        console.log("song es: "+song);  
    	};
  		image.src = this.image;
    });		
	}

  pushear(dataURI, song){
    this.navCtrl.push(HomePage3, {
      text: dataURI,
      song: song,
      textColor: this.textColor
    });
  }
}
