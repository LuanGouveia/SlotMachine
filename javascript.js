const chance = new Chance()

let win = 0
let lost = 0
let tries = 0

const btnPlay = document.getElementById("btnPlay")
if(btnPlay){btnPlay.addEventListener("click", play)}

let barChart; 
let pieChart; 

function play(){
    btnPlay.disabled = true;
    
    let firstCard = document.getElementById("idFirstImage")
    let secondCard = document.getElementById("idSecondImage")
    let thirdCard = document.getElementById("idThirdImage")

    const cards = [firstCard, secondCard, thirdCard]

    const firstImage = "images/cachorro.jpg"
    const secondImage = "images/elefante.jpg"
    const thirdImage = "images/galo.jpg"

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
        }, 50);
    });

    function stopCard(cardIndex,cardInterval){
        timelines[cardIndex].kill()
        gsap.to(cards[cardIndex],{rotation:0,duration:0.3,ease:"power2.out"})
        clearInterval(imageIntervals[cardIndex])
    }

    setTimeout(() => stopCard(0), 3000); 
    setTimeout(() => stopCard(1), 4000); 
    setTimeout(() => {
        stopCard(2);
        btnPlay.disabled = false;
    }, 5000);

    if(cards[0].src == cards[1].src && cards[1].src == cards[2].src){
        document.getElementById("result").innerHTML = "Parabéns, você ganhou!" 
        win++
    }else{
        document.getElementById("result").innerHTML = "Poxa, você perdeu, tente novamente!" 
        lost++
    }
    tries++
    localStorage.setItem("tries", tries);
    localStorage.setItem("win", win);
    localStorage.setItem("lost", lost);

    if (barChart && pieChart) {
    barChart.data.datasets[0].data = [tries, lost, win];
    barChart.update();

    pieChart.data.datasets[0].data = [lost, win];
    pieChart.update();
    }
}

document.addEventListener("DOMContentLoaded", () => {

    let tries = parseInt(localStorage.getItem("tries")) || 0;
    let win = parseInt(localStorage.getItem("win")) || 0;
    let lost = parseInt(localStorage.getItem("lost")) || 0;

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
    labels: ['Perdedores', 'Vencedores'],

    datasets: [{              
        data: [lost, win],
        backgroundColor: [      
            "rgba(197, 13, 13, 0.83)",
            "rgba(16, 131, 31, 0.84)"
        ],
        borderWidth: 1
        }]
    },
    })
})