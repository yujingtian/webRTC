var audioPlay = document.querySelector("audio#player")
function gotMediaStream(stream){
    console.log(stream)
    audioPlay.srcObject = stream
}
function handleError(err){
    console.log("getUser:",err)
}

if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
    console.log("getUserMedia is not supported")
}
else{
    var constrants = {
        video:false,
        audio:true
    }
    navigator.mediaDevices.getUserMedia(constrants)
    .then(gotMediaStream)
    .catch(handleError)
}