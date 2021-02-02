// 程式碼寫在這裡!
let yourdeck=[];
let dealerdeck=[];
let yourPoint = 0;
let dealerPoint = 0;
let inGame = false;
let winner = 0; //0: 未定 1: 玩家贏 2: 莊家贏 3: 平手

$(document).ready(function() {
    initCards();
    initButtons();
});


//
function newGame() {
    resetGame(); //重置遊戲
    deck = shuffle(buildDeck());

    yourdeck.push(deal()); //發你的牌
    dealerdeck.push(deal()); //發莊家的牌
    yourdeck.push(deal());  //發你的牌

    //開始遊戲
    inGame = true;

    renderGameTable();
    console.log('New Game!');
}

function deal (){
    return deck.shift();
}

function resetGame() {
    deck = [];
    yourdeck = [];
    dealerdeck = [];
    yourPoint = 0;
    dealerPoint = 0;
    winner = 0;
    $('.card div').html('發'); //重至每局牌面
    $('.your-cards').removeClass('win');
    $('.dealer-cards').removeClass('win');
}


function dealerRound(){
    //1.發牌
    //2.如果點數>=玩家,結束,莊家贏
    //3.<玩家,繼續發牌,重複1
    //4.>21 爆炸,結束,玩家贏

    while(true){
        dealerPoint = calcPoint(dealerdeck);
        if(dealerPoint < yourPoint){
            dealerdeck.push(deal());
        } else{
            break;
        }
    }

    inGame = false;

    renderGameTable();
}
    

function initButtons() {
    // document.querySelector('#action-new-game').addEventListener('click', evt => {
    //     alert('123')
    // });
    $('#action-new-game').click( evt => { newGame() }); //newGame按鈕

    //stand按鈕
    $('#action-stand').click( evt => {
        evt.preventDefault();
        dealerdeck.push(deal()); 
        dealerRound();
    })

    //hit按鈕
    $('#action-hit').click( evt => {
        evt.preventDefault();
        yourdeck.push(deal()); 
        renderGameTable();
    })
}

//卡牌背面圖案
function initCards() {
    // let allCards = document.querySelectorAll('.card div')
    // allCards.forEach( card => {
    //     card.innerHTML = '發';
    // }) //ES6寫法
    $('.card div').html('發'); //jquery 寫法
}

//建立牌組
function buildDeck() {
    let deck = [];


    for(let suit = 1; suit<=4 ; suit++ ) {
        for(let number = 1; number<=13 ; number++) {
            let c = new card(suit , number);
            deck.push(c);
        }
    }

    return deck;
}

//
function renderGameTable() {
    //牌面顯示
    yourdeck.forEach((card , i) => {
        let Thecard = $(`#yourCard${i + 1}`);
        Thecard.html(card.cardNunber());
        Thecard.prev().html(card.cardSuit());  //prev() 抓取上一層元素
    });
    dealerdeck.forEach((card , i) => {
        let Thecard = $(`#dealerCard${i + 1}`);
        Thecard.html(card.cardNunber());
        Thecard.prev().html(card.cardSuit());  //prev() 抓取上一層元素
    });

    //算點數並呈現至畫面
    yourPoint = calcPoint(yourdeck);
    dealerPoint = calcPoint(dealerdeck);
    $('.your-cards h1').html(`玩家 (${yourPoint}點)`);
    $('.dealer-cards h1').html(`莊家 (${dealerPoint}點)`);

    if(yourPoint >= 21 || dealerPoint >= 21) {
        inGame = false;
    }
    //論輸贏
    checkWinner();
    showWinStamp();


    console.log(winner)
    //按鈕
    // if(inGame){
    //     $('#action-hit').attr('disabled', false);
    //     $('#action-stand').attr('disabled', false);
    // }else{
    //     $('#action-hit').attr('disabled', true);
    //     $('#action-stand').attr('disabled', true);
    // }
    $('#action-hit').attr('disabled', !inGame);
    $('#action-stand').attr('disabled', !inGame);
}

//論輸贏
function checkWinner(){
    switch(true){
        //1.玩家21點 
        case yourPoint == 21:
            winner = 1;
            break;
        //2.如果點數爆
        case yourPoint > 21:
            winner = 2;
            break;

        case dealerPoint > 21:
            winner = 1;
            break;

        //3.莊家21點
        case dealerPoint == 21:
            winner = 2;
            break;

        //3.平手
        case dealerPoint == yourPoint:
            winner = 3;
            break;

        //避免觸發莊開局>閒時 出現勝利印記
        case dealerPoint  < 12:
            winner = 0;
            break;

        //4.比點數
        case dealerPoint > yourPoint:
            winner = 2;
            break;

        default:
            winner = 0;
            break;
    }
}



//印章
function showWinStamp(){
    switch(winner){
        case 1:
            $('.your-cards').addClass('win');
            break;
        case 2:
            $('.dealer-cards').addClass('win');
            break;
        case 3:
            break;
        default:
            break;
    }
}

function hideWinStamp(){
    $('.your-cards').remove('win');
}




//點數計算
function calcPoint(deck) {
    let point = 0 ;

    deck.forEach(card => {
        point += card.cardPoint(); //累加card點數
    });

    if(point > 21 && point > 11){
        deck.forEach(card => {
            if(card.cardNunber() === 'A'){
                point -= 10; //A
            }
        })
    }

    return point;
}
//定義卡牌(卡牌、遊戲中的值、花色)
class card{
    constructor(suit, number) {
        this.suit = suit;
        this.number = number;
    }
    //顯示牌面
    cardNunber() {
        switch(this.number){
            case 1:
                return 'A';
            case 11:
                return 'J';
            case 12:
                return 'Q';
            case 13:
                return 'K';
            default :
                return this.number;
        }
    }
    //卡牌點數
    cardPoint() {
        switch(this.number) {
            case 1:
                return 11;
            case 11:
            case 12:
            case 13:
                return 10;
            default :
                return this.number;
        }
    }
    //卡牌花色
    cardSuit() {
        switch(this.suit) {
            case 1:
             return '♠';
            case 2:
                return '♥';
            case 3:
                return '♦';
            case 4:
                return '♣';
        }
    }
}


//洗牌
//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }


  
