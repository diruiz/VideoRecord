
let blob = null;
function getStreamAndPlay () {
    
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            height: { max: 480 }
        }
    })
    .then(function(stream) {
        video.srcObject = stream;
        video.play();
    }).catch( (error) =>{
            console.log(error);
    });
}

function getStreamAndRecord () {
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            height: { max: 480 }
        }
    }).then(async function(stream) {
        video.srcObject = stream;
        video.play();
        let recorder = RecordRTC(stream, {
                type: 'gif',
                frameRate: 1,
                quality: 10,
                width: 360,
                hidden: 240           
            }
        );
        recorder.startRecording();

        const sleep = m => new Promise(r => setTimeout(r, m));
        await sleep(3000);

        recorder.stopRecording(function() {
            blob = recorder.getBlob();
            console.log("este es el video",blob);
            //subirvideo(blob);
        });
    });
}

function subirGif(){
    let formdata = new FormData();
    formdata.append("api_key", "Aca va api Key");
    formdata.append("file", blob);
    formdata.append("tags", "Anny");

    let requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    fetch("http://upload.giphy.com/v1/gifs", requestOptions)
    .then(response => response.json())
    .then(result => {
        //aca muestro o oculto html
        console.log(result)
        let idsAnteriores = localStorage.getItem("misGuifos");
        if(idsAnteriores == undefined)
        {
            idsAnteriores = "";
        }
        idsAnteriores = idsAnteriores+","+result.data.id
        localStorage.setItem("misGuifos", idsAnteriores)
        obtenerGifs(result.data.id); //esta debe ser otra funcion
        obtenerGifs(idsAnteriores);
        alert("todo ok el id es: "+result.data.id);
    })
    .catch(error => {
        console.log('error', error)
    });

}

function obtenerGifs(ids){
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      
      fetch("http://api.giphy.com/v1/gifs?api_key=Aca va api Key&ids="+ids, requestOptions)
        .then(response => response.json())
        .then(result =>{
             console.log(result)
        })
        .catch(error => {
            console.log('error', error)
        });
}
