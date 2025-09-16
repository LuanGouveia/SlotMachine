const chance = new Chance()

const spinSound = new Audio("sounds/spinning.wav")
const winSound = new Audio("sounds/win.wav")

let win = 0
let lost = 0
let tries = 0

let flamengo = 0
let fluminense = 0
let vasco = 0

const btnPlay = document.getElementById("btnPlay")
if(btnPlay){btnPlay.addEventListener("click", playGame)}

let barChart; 
let pieChart; 

function playGame(){
    btnPlay.disabled = true;
    spinSound.play()
    
    firstCard = document.getElementById("idFirstImage")
    secondCard = document.getElementById("idSecondImage")
    thirdCard = document.getElementById("idThirdImage")

    const cards = [firstCard, secondCard, thirdCard]

    const firstImage = "images/flamengo-logo-2020.svg"
    const secondImage = "images/fluminense-logo-escudo.svg"
    const thirdImage = "images/vasco-da-gama-logo-2021.svg"

    const images = [firstImage, secondImage, thirdImage]

    const timelines = [
        gsap.timeline({repeat:-1, yoyo: true}).to(".firstCard",{rotation: 15, duration:0.07, ease:"power1"}).to(".firstCard",{rotation: -15, duration:0.07, ease:"power1"}),
        gsap.timeline({repeat:-1, yoyo: true}).to(".secondCard",{rotation: 15, duration:0.07, ease:"power1"}).to(".secondCard",{rotation: -15, duration:0.07, ease:"power1"}),
        gsap.timeline({repeat:-1, yoyo: true}).to(".thirdCard",{rotation: 15, duration:0.07, ease:"power1"}).to(".thirdCard",{rotation: -15, duration:0.07, ease:"power1"})
    ]

    const imageIntervals = cards.map((card, i) => {
        return setInterval(() => {
            const randomImage = chance.pickone(images);
            card.src = randomImage;
        }, 20);
    });

    function stopCard(cardIndex,cardInterval){
        timelines[cardIndex].kill()
        gsap.to(cards[cardIndex],{rotation:0,duration:0.3,ease:"power2.out"})
        clearInterval(imageIntervals[cardIndex])
    }

    setTimeout(() => stopCard(0), 1000); 
    setTimeout(() => stopCard(1), 2000); 
    setTimeout(() => {
        stopCard(2);

        btnPlay.disabled = false;

        if(cards[0].src == cards[1].src && cards[1].src == cards[2].src){
            winSound.play()
            setTimeout(() => {
                winSound.pause();
                winSound.currentTime = 0;
            }, 1500);
            document.getElementById("result").innerHTML = "Parabéns, você ganhou!" 
            win++
        }else{
            document.getElementById("result").innerHTML = "Poxa, você perdeu, tente novamente!" 
            lost++
        }
        tries++

        for(let element of cards){
            if(element.src.includes(firstImage)){
                flamengo++
            }else if(element.src.includes(secondImage)){
                fluminense++
            }else{
                vasco++
            }
        }

        localStorage.setItem("tries", tries);
        localStorage.setItem("win", win);
        localStorage.setItem("lost", lost);

        localStorage.setItem("flamengo",flamengo)
        localStorage.setItem("fluminense",fluminense)
        localStorage.setItem("vasco",vasco)

        if (barChart && pieChart) {
        barChart.data.datasets[0].data = [tries, lost, win];
        barChart.update();

        pieChart.data.datasets[0].data = [flamengo, fluminense, vasco];
        pieChart.update();
        }

        spinSound.pause()
        spinSound.currentTime = 0
    }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {

    flamengo = parseInt(localStorage.getItem("flamengo")) || 0;
    fluminense = parseInt(localStorage.getItem("fluminense")) || 0;
    vasco = parseInt(localStorage.getItem("vasco")) || 0;


    tries = parseInt(localStorage.getItem("tries")) || 0;
    win = parseInt(localStorage.getItem("win")) || 0;
    lost = parseInt(localStorage.getItem("lost")) || 0;

    const ctxBar = document.getElementById('graphicBar').getContext('2d')
    const ctxPie = document.getElementById('graphicPie').getContext('2d')

    barChart = new Chart(ctxBar, {

        type: 'bar',   

        data: {
        labels: ['Vezes jogadas', 'Perdedores', 'Vencedores'],

        datasets: [{
            label: 'Estatísticas do jogo',              
            data: [tries, lost, win],
            backgroundColor: [
                "rgba(54, 163, 235, 1)",
                "rgba(197, 13, 13, 1)",
                "rgba(16, 131, 31, 1)"
            ],
            borderWidth: 1
        }]
    },
        options: {
            responsive: true,
            scales: {
                y: {
                        beginAtZero: true,
                        grid: {
                            color: "white"
                        },
                        ticks: {
                            color: "white"
                        }
                },
                x: {
                    grid:{
                        color: "white,"
                    },
                    ticks: {
                        color: "white"
                    }
                }
            }
        }
    })
    pieChart = new Chart(ctxPie, {

    type: 'pie',   

    data: {
    labels: ['Flamengo', 'Fluminense', "Vasco"],

    datasets: [{              
        data: [flamengo, fluminense, vasco],
        backgroundColor: [      
            "rgba(197, 13, 13, 0.83)",
            "rgba(16, 131, 31, 0.84)",
            "rgba(255, 255, 255, 0.83)"
        ],
        borderWidth: 1
        }]
    },
    })
})