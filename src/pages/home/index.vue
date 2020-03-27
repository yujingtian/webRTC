<template>
    <div id="Home">
        <video ref="video" autoplay playsinline></video>
        <div class="btnGroup">
            <button type="button" @click="photoClick">拍照</button>
            <button type="button" @click="save(2)">保存</button>
            <button type="button" @click="photoRecording">录制</button>
            <button type="button" @click="playRecord">播放</button>
            <button type="button" @click="stopRecord">暂停</button>
        </div>
        <canvas  ref="canvas" id="canvas"></canvas>
    </div>
</template>
<script>
export default {
    data(){
        return{
            buffer:[],
            mediaRecorder:null
        }
    },
    mounted(){
        this.initVideo()
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
            var videoPlay = document.querySelector("video")
            if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
                console.log("getUserMedia is not supported")
            }
            else{
                var constrants = {
                    video:{facingMode: "environment"}
                }
                navigator.mediaDevices.getUserMedia(constrants)
                .then(function (stream){
                    window.stream = stream
                    videoPlay.srcObject = stream
                })
                .catch(function(err){
                    console.log("getUser:",err)
                })
            }
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
                _this.mediaRecorder = new MediaRecorder(window.stream, options);
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
