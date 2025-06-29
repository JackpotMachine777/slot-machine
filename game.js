class Game{
    constructor(index){
        this.initCanvas();
        
        this.images = {
            red: "images/jackpot.png",    
            green: "images/bar.png",  
            blue: "images/orange.png"
        };

        this.rolls = document.querySelectorAll('.color');
        this.h1 = document.querySelector('.gamename');
        this.btn = document.querySelector('#start');

        this.panel = document.querySelector('.panel');
        this.score = document.querySelector('.score');
        this.money = document.querySelector('.gains');
        
        this.wrap = document.querySelector(".wrap")

        this.slotSound = document.querySelector('#slotsound');
        this.jackpotSound = document.querySelector('#jackpotsound');
        this.ambient = document.querySelector('#ambient');
        this.bancruptcy = document.querySelector("#bancrupt");

        this.minus = document.querySelector('.btn-minus');
        this.amount = document.querySelector('#amount');
        this.plus = document.querySelector('.btn-plus');

        if (!this.slotSound || !this.jackpotSound || !this.ambient){
            console.error("Nie znaleziono elementów audio!");
        }

        this.index = index;

        this.wallet = 1000;
        this.played = 0;
        this.wins = 0;
        this.loses = 0;

        this.amountEl = document.querySelector('#amount');
        this.amount = 2.00;
        this.step = 1.00;
        this.minBet = 2.00;
        this.maxBet = 1000.00;

        this.btn.addEventListener('click', (e) => {
            this.bgmusic();
            this.bid = this.amount;
            if(!this.bid){
                this.panel.innerHTML = "Najpierw podaj stawke";
                return;
            }
            if(this.wallet === 0 || this.wallet < 0){
                this.bancruptfx();
                this.panel.innerHTML = "Zbankrutowałeś! Aby grać dalej doładuj środki";
                this.score.innerHTML = `Zagrano ${this.played} gier, Liczba zwycięstw: ${this.wins}, Liczba porażek: ${this.loses}`; 
                this.money.innerHTML = "";
                return;
            }
            if(this.bid > this.wallet){
                this.score.innerHTML = "Masz za mało pieniędzy, zmniejsz stawkę";
                this.money.innerHTML = "";
                return;
            }
            else{
                this.roll();
            } 
        });
        document.addEventListener('keydown', (e) => {
            if(e.code === 'Space'){
                this.bgmusic();
                this.bid = this.amount;
                if(!this.bid){
                    this.panel.innerHTML = "Najpierw podaj stawke";
                    return;
                }
                if(this.wallet === 0 || this.wallet < 0){
                    this.bancruptfx();
                    this.panel.innerHTML = "Zbankrutowałeś! Aby grać dalej doładuj środki";
                    this.score.innerHTML = `Zagrano ${this.played} gier, Liczba zwycięstw: ${this.wins}, Liczba porażek: ${this.loses}`; 
                    this.money.innerHTML = "";
                    this.recover.style.opacity = "1";
                    return;
                }
                if(this.bid > this.wallet){
                    this.score.innerHTML = "Masz za mało pieniędzy, zmniejsz stawkę";
                    this.money.innerHTML = "";
                    return;
                }
                else{
                    this.roll();
                } 
            }
        });

        this.minus.addEventListener('click', () => {
            if(this.amount - this.step >= this.minBet){
                this.amount -= this.step;
                this.updateDisp();
            }
            if(this.amount <= 15.00){
                this.step = 1.00;
                this.updateDisp();
            }
            if(this.amount === 100.00){
                this.step = 10.00;
                this.updateDisp();
            }
            if(this.amount === 300.00){
                this.step = 100.00;
                this.updateDisp();
            }
        });
        this.plus.addEventListener('click', () => {
            if(this.amount + this.step <= this.maxBet){
                this.amount += this.step;
                this.updateDisp();
                
            } 
            if(this.amount === 20.00){
                this.step = 5.00;
                this.updateDisp();
            }
            if(this.amount === 100.00){
                this.step = 10.00;
                this.updateDisp();
            }
            if(this.amount === 300.00){
                this.step = 100.00;
                this.updateDisp();
            }
        });
    }

    initCanvas(){
        this.canvas = document.querySelector("#bgCanvas");
        if(!this.canvas){
            console.error("Nie znaleziono canvas");
            return;
        }
        this.ctx = this.canvas.getContext("2d");
        this.background = new Image();
        this.background.src = "images/bg.jpg";

        this.background.onload = () => this.resizeCanvas();
        window.addEventListener("resize", () => this.resizeCanvas());
    }

    resizeCanvas(){
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.drawBg();
    }

    drawBg(){
        this.ctx.drawImage(this.background, 0, 0, this.canvas.width, this.canvas.height);
    }    

    updateDisp(){
        this.amountEl.textContent = this.amount.toFixed(2);
    }

    walletDisp(){
        this.panel.innerHTML = `Twój stan konta to ${this.wallet}$`;
    }

    games(){
        this.played++; 
    }

    roll(){
        this.slotfx();
        let interval;
        let selectedIndex = [];
        interval = setInterval(() =>{
            const imageKeys = Object.keys(this.images);
            selectedIndex = [];
            for (let i = 0; i < 3; i++) {
                let index = Math.floor(Math.random() * imageKeys.length);
                selectedIndex.push(index);
                console.log(index);
            }
            for (let i = 0; i < 3; i++) {
                let selectedImage = this.images[imageKeys[selectedIndex[i]]]; 
                this.rolls[i].style.backgroundImage = `url(${selectedImage})`; 
                this.rolls[i].style.backgroundSize = 'cover';  
                this.rolls[i].style.backgroundPosition = 'center'; 
                for(let j = 0; j < 3; j++){
                    this.rolls[i].style.animation = 'none';
                    void this.rolls[i].offsetWidth;
                    this.rolls[i].style.animation = "rollUp 0.1s 1";
                    this.btn.disabled = true;
                    this.rolls.forEach(roll => {
                        roll.style.border = "3px solid darkred";
                        roll.style.boxShadow = "0 10px 20px red";
                    });
                    this.wrap.classList.remove("wrapshadow");
                }
            } 
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            this.btn.disabled = false;
            const imageKeys = Object.keys(this.images);
            for(let i = 0; i < 3; i++){
                let selectedImage = this.images[imageKeys[selectedIndex[i]]]; 
                this.rolls[i].style.backgroundImage = `url(${selectedImage})`;
            }
            setTimeout(()=>{
                const jackpot = selectedIndex[0] === selectedIndex[1] && selectedIndex[0] === selectedIndex[2] && selectedIndex[1] === selectedIndex[2];
                const twoSame = selectedIndex[0] === selectedIndex[1] || selectedIndex[0] === selectedIndex[2] || selectedIndex[1] === selectedIndex[2];
                const allDif = selectedIndex[0] != selectedIndex[1] && selectedIndex[0] != selectedIndex[2] && selectedIndex[1] != selectedIndex[2];
                      
                if (jackpot) {
                    this.jackpotfx();
                    this.wins++;
                    let gains = this.bid * 4;
                    this.money.innerHTML = `Wygrałeś ${gains}$`;

                    this.jackpotSound.play();
                    this.wallet += gains;

                    this.rolls.forEach(roll => {
                        roll.style.animation = "border 1s infinite alternate, boxshadow 1s infinite alternate";
                    });
                    this.wrap.classList.add("wrapshadow");

                    setTimeout(()=>{
                        this.money.innerHTML = "";
                    },3000)
                } else if (twoSame || allDif) {
                    let gains = this.bid;
                    this.loses++;
                    this.money.innerHTML = `Przegrałeś ${gains}$`;
                    this.wallet -= gains;
                    setTimeout(()=>{
                        this.money.innerHTML = "";
                    },1000)
                } 
                this.walletDisp();
                this.games();
            },500);
        },2500);
    }
    slotfx(){
        this.slotSound.volume = "0.03";
        this.slotSound.currentTime = 0;
        this.slotSound.play();
    }
    jackpotfx(){
        this.jackpotSound.volume = "0.3";
        this.jackpotSound.currentTime = 0;
        this.jackpotSound.play();
    }
    bancruptfx(){
        if (!this.bancruptcy){
            console.error("Nie znaleziono elementu audio");
            return;
        }
        this.bancruptcy.volume = "0.05";
        this.bancruptcy.play();
    }
    bgmusic(){
        this.ambient.volume = "0.05";
        this.ambient.play().catch(error => console.error("Błąd odtwarzania muzyki: ", error));
        this.ambient.loop = true;
    }
    
}    

document.addEventListener("DOMContentLoaded", () => {
    const game = new Game();
});