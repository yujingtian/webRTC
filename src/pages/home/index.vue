<template>
    <div id="Home">
        <video ref="video" autoplay playsinline></video>
        <div class="btnGroup">
            <!-- <button type="button" @click="photoClick">拍照</button>
            <button type="button" @click="save(2)">保存</button>
            <button type="button" @click="photoRecording">录制</button>
            <button type="button" @click="playRecord">播放</button>
            <button type="button" @click="stopRecord">暂停</button> -->
        </div>
        <canvas  ref="canvas" id="canvas"></canvas>
    </div>
</template>
<script>
export default {
    data(){
        return{
            buffer:[],
            mediaRecorder:null,
            roomid:10,
            localStream:null,
            socket:null,
            pc:null,
            remoteStream:null,
        }
    },
    mounted(){
        // this.initVideo()
        this.socketConn()
    },
    methods:{
        initVideo(){
            let _this = this
            //检测音视频设备
            // navigator.mediaDevices.enumerateDevices()
            // .then(function(deviceInfos){
            //     deviceInfos.forEach(function(item){
            //         console.log(item)
            //     })
            // })
            _this.$refs.canvas.width = _this.$refs.video.clientWidth
            _this.$refs.canvas.height = _this.$refs.video.clientHeight
            if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
                console.log("getUserMedia is not supported")
            }
            else{
                var constrants = {
                    video:{facingMode: "face"}
                }
                navigator.mediaDevices.getUserMedia(constrants)
                .then(function (stream){
                    _this.localStream = stream
                    _this.socketConn()  
                })
                .catch(function(err){
                    console.log("getUser:",err)
                })
            }
        },
        socketConn(){
            let _this = this
            _this.socket = io.connect("https://192.168.27.158:3303");
            _this.socket.on("joined",function(room, id){
                  _this.createPeerConnection();
                  _this.bindTracks()
            })
            _this.socket.on("message",function(room, data){
                if(data == null || data === undefined){
                    console.log("this message is invalid")
                    return
                }
                if(data.hasOwnProperty('type') && data.type === 'offer'){
                    _this.pc.setRemoteDescription(new RTCSessionDescription(data))
                    _this.pc.createAnswer()
                    .then(getAnswer)
                    .catch(_this.handleOfferError)
                }
                else if(data.hasOwnProperty('type') && data.type == 'answer'){
                    _this.pc.setRemoteDescription(new RTCSessionDescription(data))
                }
                else if(data.hasOwnProperty('type') && data.type == 'candidate'){
                    let candidate = new RTCIceCandidate({
                        sdpMLineIndex: data.label,
                        candidate: data.candidate
                    });
                    _this.pc.addIceCandidate(candidate);
                }
                else{
                    console.log("this message is invalid")  
                }
            })
            _this.socket.on("otherjoin",function(room){
                _this.createOffer()
            })
            _this.socket.on("leaved",function(room, id){
                _this.socket.disconnect();
		        console.log('receive leaved message');
            })
            _this.socket.emit('join',1);
        },
        createPeerConnection(){
            let _this = this
            console.log("create RTCPeerConnection!")
            if(!_this.pc){
                _this.pc = new RTCPeerConnection({
                    'iceServers': [{
                        'urls': 'turn:stun.al.learningrtc.cn:3478',
                        'credential': "mypasswd",
                        'username': "lichao"
                    }]
                })
                _this.pc.onicecandidate = (e) => {
                    if(e.candidate){
                        sendMessage({
                            type: 'candidate',
                            label:event.candidate.sdpMLineIndex, 
                            id:event.candidate.sdpMid, 
                            candidate: event.candidate.candidate
                        });
                    }else{
                        console.log("this is the end candidate")
                    }
                }
                _this.pc.ontrack = _this.getRemoteStream
            }
        },
        getRemoteStream(e){
            console.log(e.streams)
            this.remoteStream = e.streams[0];
            this.$refs.video.srcObject = e.streams[0]
        },
        bindTracks(){
            let _this = this
            console.log('bind tracks into RTCPeerConnection')
            if(_this.pc === null || _this.localStream === null){
                console.log("not have RTCPeerConnection Object",_this.localStream)
                return
            }
            if(localStream === null || localStream === undefined) {
                console.error('localstream is null or undefined!')
                return
            }
            this.localStream.getTracks().forEach((track) => {
                _this.pc.addTrack(track, _this.localStream)  
            });
        },
        createOffer(){
            let _this = this
            let offerOptions = {
                offerToRecieveAudio: 1,
                offerToRecieveVideo: 1
            }
            this.pc.createOffer(offerOptions)
            .then(_this.getOffer)
            .catch(_this.handleOfferError)
        },
        getOffer(desc){
           this.pc.setLocalDescription(desc)
            //    offer.value = desc.sdp;
           offerdesc = desc;
           this.sendMessage(desc)
        },
        getAnswer(desc){
           this.pc.setLocalDescription(desc)
            //    offer.value = desc.sdp;
           offerdesc = desc;
           this.sendMessage(desc)
        },
        handleOfferError(err){
            console.log('fail to create Offer', err)
        },
        sendMessage(data){
            if(!this.socket){
                console.log(" socket is null ")
                return
            }
            this.socket.emit("message", 1, data)
        },
        photoClick(){
            var context = this.$refs.canvas.getContext('2d')
            context.drawImage(this.$refs.video, 0, 0, 
            this.$refs.canvas.width, this.$refs.canvas.height)
        },
        save(type){
            if(type == 1){
                var oA = document.createElement("a"); 
                oA.download = 'photo';
                oA.href = this.$refs.canvas.toDataURL("image/jpeg");
                document.body.appendChild(oA); 
                oA.click(); 
                oA.remove(); 
            }else{
                let blob = new Blob(this.buffer, { type:'video/webm' })
                let url = window.URL.createObjectURL(blob)
                var a = document.createElement('a'); 
                a.href = url; 
                a.style.display = 'none'; 
                a.download = 'aaa.webm';
                a.click();
            }
        },
        photoRecording(){
            //设置录制下来的多媒体格式
            let _this = this
            var videoPlay = document.querySelector("video")
            var options = {
                mimeType:"video/webm;codecs=vp8"
            }
            if(!MediaRecorder.isTypeSupported(options.mimeType)){
                console.log("格式不支持")
                return;
            }
            try{
                _this.mediaRecorder = new MediaRecorder(_this.localStream, options);
            }catch(e){
                console.error('Failed to create MediaRecorder:', e); 
                return;
            }
            _this.mediaRecorder.ondataavailable = function(e){
                if(e && e.data && e.data.size > 0){
                    _this.buffer.push(e.data)
                }
            }
            _this.mediaRecorder.start(10)
        },
        playRecord(){
            let blob = new Blob(this.buffer, {type: 'video/webm'})
            let videoPlay = document.querySelector("video")
            videoPlay.src = window.URL.createObjectURL(blob)
            videoPlay.srcObject = null
            videoPlay.controls = true
            videoPlay.play()
        },
        stopRecord(){
            this.mediaRecorder.stop();
        }
    }
}
</script>
<style lang="less" scoped>
    #Home{
        height:100%;
    }      
    video{
        height:100%;
        width:100%;
        border:1px solid red;
    }
    .btnGroup{
        // display: flex;
        text-align: center;
        button{
            width:80px;
            height:30px;
        }
    }
</style>
