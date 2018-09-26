/*console*/
/*version:1.0*/
/*Support AMD and CMD*/
(function (root, deps,factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(deps, factory);
    } else if (typeof exports==="object"&&typeof module!=="undefined") {
        // Node, CommonJS之类的,CMD
        var reqDeps=[];
        for(var i=0;i<deps.length;i++){
        	reqDeps.push(require(deps[i]));
        }
        module.exports = factory.apply(root,reqDeps);
    } else {
        // 浏览器全局变量(root 即 window)
        var reqDeps=[];
        for(var i=0;i<deps.length;i++){
        	reqDeps.push(root[deps[i]]);
        }
        root.yuxConsole = factory.apply(root,reqDeps);
    }
}(window,[],function () {
//init 初始化
var canvasDom=document.createElement("canvas");
canvasDom.style.display="none";
document.getElementsByTagName("body")[0].appendChild(canvasDom);
//默认配置
var defaultOption={
    textData:"A",//默认文字数据
    imageData:"",//默认图数据
    type:"text",//类型 目前可以取值：text,url
    font:"Arial",//字体
    size:15,//字体大小，如果为图像的话，则为图像高度，图像显示的时候按照同比率进行缩放。如果为文字，则单字长宽比为1:1
    foreColor:"#000",
    backColor:"#fff",
    fill:"*"//单像素填充字符
};
//判断是否支持canvas
var isSupportCanvas=function(dom){
    if(dom && dom.getContext("2d")){
        return true;
    }
    return false;
}
//10进制转16进制颜色
var color2Hex=function(colorVal){
    return colorVal<16?("0"+colorVal.toString(16)):colorVal.toString(16);
}
//获取以半角字符长度为单位的字符串总长度
var getRealLength=function(str){
    var len=0;
    for(var i=0;i<str.length;i++){
        if(str.charCodeAt(i)>=255){
            len+=2;
        }else{
            len++;
        }
    }
    return len;
}
//检查传入参数
var checkParams=function(args){
    var data,opt;
    if(!isSupportCanvas(canvasDom)){
        throw "本方法调用需要浏览器支持Canvas特性。";
        return false;
    }
    if(1==args.length){
        if("object"==typeof args[0]){
            opt=args[0];
        }else if("string"==typeof args[0]){
            opt=defaultOption;
            opt.data=args[0];
        }else{
            opt=defaultOption;
        }
        data=("data" in opt && opt.data) || defaultOption.data;
    }else if(2== args.length && "string"==typeof args[0] && "object" == typeof args[1]){
        data=args[0];
        opt=args[1]
    }else{
        data=defaultOption.textData;
        opt=defaultOption;
    }
    return {
        "data":data,
        "opt":opt
    }
}
//按像素打印
var drawPixel=function(imageData,opt){//{data:array,width:,height:}
    var printS="";
    var printColorArr=[];
    for(var i=0;i<imageData.data.length;i+=4){
        if(0==i%(imageData.width*4)){
            printS+="\n"
        }
        printColorArr.push("color:#"+color2Hex(imageData.data[i])+color2Hex(imageData.data[i+1])+color2Hex(imageData.data[i+2]));
        printS+="%c"+opt.fill.substr(0,1)+opt.fill.substr(0,1);
    }
    printColorArr.unshift(printS);
    console.log.apply(window,printColorArr);
}

var yuxConsole={
    drawImage:function(){
        var data,opt,obj;
        if(!(obj=checkParams(arguments))){
            return;
        }
        data=obj.data;
        opt=obj.opt;
        //size
        opt.size=opt.size || defaultOption.size;
        //fill
        opt.fill=opt.fill || defaultOption.fill;
        var img=new Image();
        img.onload=function(info){
            //图片加载完后
            var w=parseInt(img.width/img.height*opt.size);
            var h=opt.size;
            canvasDom.width=w;
            canvasDom.height=h;
            var ctx=canvasDom.getContext("2d");
            //水平居中
            ctx.textAlign="center";
            //垂直居中
            ctx.textBaseline="middle";
            //清除画布
            ctx.clearRect(0,0,w,h);
            ctx.drawImage(img,0,0,w,h);
            //获取像素
            var pix=ctx.getImageData(0,0,w,h);
            drawPixel(pix,opt);
        }
        img.onerror=function(info){
            throw '加载图片失败';
        }
        img.src=data;
    },
    drawText:function(){//data,opt
        var data,opt,obj;
        if(!(obj=checkParams(arguments))){
            return;
        }
        data=obj.data;
        opt=obj.opt;
        //size
        opt.size=opt.size || defaultOption.size;
        //foreColor
        opt.foreColor=opt.foreColor || defaultOption.foreColor;
        //backColor
        opt.backColor=opt.backColor || defaultOption.backColor;
        //font
        opt.font=opt.font || defaultOption.font;
        //fill
        opt.fill=opt.fill || defaultOption.fill;
        var len=getRealLength(data);
        var w=parseInt(len/2*opt.size);
        var h=opt.size;
        canvasDom.width=w;
        canvasDom.height=h;
        var ctx=canvasDom.getContext("2d");
        //设置字体等
        ctx.font=opt.size+"px "+opt.font;
        ctx.fillStyle=opt.backColor;
        //水平居中
        ctx.textAlign="center";
        //垂直居中
        ctx.textBaseline="middle";
        ctx.fillRect(0,0,w,h);
        ctx.fillStyle=opt.foreColor;
        ctx.fillText(data,parseInt(w/2),parseInt(h/2));

        //获取像素
        var pix=ctx.getImageData(0,0,w,h);
        drawPixel(pix,opt);
    }
}
return yuxConsole;
}));
