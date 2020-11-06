const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

function createRandomInt(){
    let random = Math.floor(Math.random() * (+canvas.height/2 - +0)) + (+0);
    return random;
}

class Ball{
    constructor(x,radius,color){
        this.x = x;
        this.y = canvas.height/2;
        this.radius = radius;
        this.color = color;
        this.gravity = 0.7;
        this.velocity = 0;
        this.lift = -25;
    }
    draw(){
        // console.log('drew');
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI *2,false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
    up(){
        this.velocity += this.lift;
    }
    update(){
        // console.log('update ')
        this.velocity += this.gravity;
        this.y += this.velocity;
        this.velocity *= 0.8;
        // console.log("y",this.y);
        if(this.y > canvas.height-this.radius){
            this.y = canvas.height-this.radius;
            this.velocity = 0;
        }
    }
}

class Pipe{
    constructor(x){
        this.top = createRandomInt();
        this.bottom = canvas.height - createRandomInt();
        this.x = x;
        this.w = 40;
        this.speed = 2;
        this.redFlag = false;
    }
    draw(){
        // console.log('drew pipe');
        // console.log('window height',canvas.height);
        // console.log('top',this.top);  
        if(this.redFlag){
            ctx.fillStyle = 'red';
        }
        ctx.beginPath();
        ctx.rect(this.x, 0, this.w, this.top);
        ctx.rect(this.x,this.top+150,this.w,canvas.height-(this.top +150));
        ctx.fill();
    }
    update(){
        this.x -= this.speed;
    }
    offScreen(){
        if(this.x < 40){
            score.value++;
            score.best = Math.max(score.value,score.best);
            localStorage.setItem('best',score.best);
            console.log('score',score.value);
            return true;
        }
        else{
            return false;  
        }
    }
    hits(ball){
        if(ball.y < this.top || ball.y > this.top + 150){
            if(ball.x + ball.radius +3 > this.x && ball.x < this.x + this.w ){
                this.redFlag = true;
                this.speed = 0;
                return true;
            }
        }
        else{
            this.redFlag = false;
            return false;
        }
    }
}   
var pipes = [];
let frames = 0;
var score = {
    value: 0,
    best: parseInt(localStorage.getItem("best")) || 0
};
var requestId;
function animate(){
    requestId = requestAnimationFrame(animate);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ball.draw();
    ball.update();
    if(frames % 250 == 0){
        // pipes.push(new Pipe(1400));
        pipes.push(new Pipe(700));
        pipes.push(new Pipe(1400));
    }
    for(var i=pipes.length-1;i>=0;i--){
        pipes[i].draw();
        pipes[i].update();

        if(pipes[i].hits(ball)){
            console.log('hits');
            // window.cancelAnimationFrame(requestId);

            // ctx.beginPath();
            // ctx.rect(canvas.width/2-250, canvas.height/2-200, 400, 300);
            // ctx.fillStyle = 'white';
            // ctx.fill();
            // var overlay = document.getElementById('overlay');
            // canvas.style.visibility = 'hidden';
            // overlay.style.visibility = 'visible';

            ctx.font = "70px Comic Sans MS";
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2);
            ctx.fillStyle = "green";
            ctx.fillText("SCORE "+ score.value, canvas.width/2, canvas.height/2 +70);
            ctx.fillStyle = "yellow";
            ctx.fillText("BEST SCORE "+ score.best, canvas.width/2, canvas.height/2 +140);
            ctx.fillStyle = "green";
            ctx.fillText("CLICK TO RESTART",canvas.width/2, canvas.height/2 +210);
            ctx.fillStyle = "red";
            canvas.addEventListener('click',function(){
                history.go(0);
            })

        }

        if(pipes[i].offScreen()){
            pipes.splice(i,2);
        }
    }
    frames++;
}


ball = new Ball(400,20,'white');
// pipes.push(new Pipe(400));
animate();
document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        // console.log('spacebar hit')
        ball.up();
    }
}    

// console.log('ball',ball);
