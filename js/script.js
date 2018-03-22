'use strict';

//Глобальные переменные

const gameWindows = document.querySelectorAll('div[class$="-window"]');
const cards = document.querySelectorAll('.card');
const scoresBoard = document.getElementById('currentScores');
const scoresResultBoard = document.getElementById('resultScores');
const notice = document.getElementById('notice');
const buttons = document.querySelectorAll('.button-start');
const AMOUNT_GAME_CARD_PAIRS = 9;
const SCORES_MULTIPLIER = 42;
const parameters = {
    cardAmount: AMOUNT_GAME_CARD_PAIRS,
    multiplier: SCORES_MULTIPLIER,
    countClosedPairs: 9,
    sumPoints: 0,
    gameCardArr: [],
    guesCard: null,
    noticeCountDownTimer: 0,
    cardCloseTimer: 0
};

// задание обработчиков кнопкам игры

document.addEventListener("DOMContentLoaded", ready);

function ready() {
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', startGame);
    }
}


//Функция старта игры

function startGame() {

    toggleWindow(gameWindows, 'game');
    
    clearParameters(parameters);
    
    printScores(0);
    
    unDisappearAllCard(cards);
    
    parameters.gameCardArr = getPreparedCards(parameters.gameCardArr, parameters.cardAmount);

    distributeCardPicture(cards, parameters.gameCardArr); 

    countDownStart(5);
}


//Функция переключения окон игры 

function toggleWindow(windowsCollection, windowName) {
    for (let i = 0; i < windowsCollection.length; i++) {
        if (windowsCollection[i].classList.contains(windowName + '-window')) {
            windowsCollection[i].style.display = 'block';
            continue;
        }
        
        windowsCollection[i].style.display = 'none';
    }
}


//Функция перезагрузки глобальных параметров

function clearParameters(paramsObject) {
    paramsObject.gameCardArr = [];
    clearInterval(paramsObject.noticeCountDownTimer);
    clearInterval(paramsObject.cardCloseTimer);
    paramsObject.countClosedPairs = paramsObject.cardAmount;
    paramsObject.sumPoints = 0;
    paramsObject.guesCard = null;
}

// Функция подготовки карт к игре 

function getPreparedCards(cardArr, n) {
    cardArr = getRandomCard(cardArr, n, cardMap);
    cardArr = addTwinCard(cardArr);
    cardArr = setCardPosition(cardArr);
    return cardArr;
}


// Функция для прикрепления изображения карты 

function distributeCardPicture(cardImgElements, cardArr) {
    let cardPosition;
    let frontface;
    let backface;
    
    for (let i = 0; i < cardArr.length; i++) {
        cardPosition = cardArr[i].position;
        frontface = cardImgElements[cardPosition].querySelector('.frontface');
        backface = cardImgElements[cardPosition].querySelector('.backface');
        
        frontface.setAttribute('src', 'img/cards/' + cardArr[i].cardFileName);
        backface.setAttribute('src', 'img/backface.jpg');
        cardImgElements[cardPosition].setAttribute('data-card-file', 'img/cards/' + cardArr[i].cardFileName);
    }
}


//Функция закрытия карт по таймеру и показа объявления

function countDownStart(countDown) {
    for (let i = 0; i < cards.length; i++) {
        openCard(cards[i]);
    }
    
    notice.style.display = 'block';
    notice.innerHTML = 'Карты закроются через ' + countDown + ' секунд';
    
    parameters.noticeCountDownTimer = setInterval( function() {
        countDown --;
        notice.innerHTML='Карты закроются через ' + countDown + ' секунд';
         
    }, 1000);
    
    parameters.cardCloseTimer = setTimeout( function() {
        clearInterval(parameters.noticeCountDownTimer);
        notice.style.display = 'none';
        
        for (let i = 0; i < cards.length; i++) {
            closeCard(cards[i]);    
        }
        
        setCardClick(cards);
    }, 1000 * countDown);
}


//Функция установки обработчика кликов на карту

function setCardClick(cardElements) {
    for (let i = 0; i < cardElements.length; i++) {
        cardElements[i].addEventListener('click', onCardClick);
    }
}


//Обработчик клика на карту

function onCardClick() {
    let clickedCard = this;
    clickedCard.removeEventListener('click', onCardClick);
    
    if (parameters.guesCard == null) {
        parameters.guesCard = clickedCard;
        openCard(clickedCard);
        return;
    }
    
    openCard(clickedCard);
    
    const isHit = compareCards(parameters.guesCard, clickedCard);
    
    printScores(countPoints(isHit, parameters));
    
    if (isHit) {
        disappearCard(clickedCard);
        disappearCard(parameters.guesCard);
        clickedCard = null;
        parameters.guesCard = null;
    } else {
        closeCard(parameters.guesCard);
        closeCard(clickedCard);
        parameters.guesCard.addEventListener('click', onCardClick);
        clickedCard.addEventListener('click', onCardClick);
        clickedCard = null;
        parameters.guesCard = null;
    }
    
    if (parameters.countClosedPairs == 0) {
        setTimeout ( function() {
            toggleWindow(gameWindows, 'result');
            scoresResultBoard.innerHTML = parameters.sumPoints.toString();
            }, 1000);
    }
}


//Функция для отбора карт из cardMap

function getRandomCard(cardArr, n, cardDeck) {
    let randomCardNumberArr = []; 
    randomCardNumberArr = getRandomArr(randomCardNumberArr, 0, cardDeck.length, n);
    
    for (let i = 0; i < n; i++) {
        let randomIndexCard = randomCardNumberArr[i];
        cardArr[i] = cardDeck[randomIndexCard];
    }
    
    return cardArr;
}

function compareCards(card1, card2) {
    return (card1.getAttribute('data-card-file') == card2.getAttribute('data-card-file'));
}


//Функция для добавления дублированных карт

function addTwinCard(cardArr) {
    const arrLength = cardArr.length;
    
    for (let i = 0; i < arrLength; i++) {
        let twinCard = {}
        
        for (let key in cardArr[i]) {
            twinCard[key] = cardArr[i][key];
        }
        
        cardArr[i+arrLength] = twinCard; 
    }
    
    return cardArr;
}


//Функция для распределения позиций карт

function setCardPosition(cardArr) {
    
    let cardPointerArr = [];
    
    cardPointerArr = getRandomArr(cardPointerArr, 0, cardArr.length, cardArr.length);
    
    for (let i = 0; i < cardArr.length; i++) {
        cardArr[i].position = cardPointerArr[i];
    }
    
    return cardArr;
}

            
//Функция для открытия карты

function openCard(cardElement) {
    if (cardElement.classList.contains('flip')) {
        cardElement.classList.remove('flip');
    }
    
    cardElement.setAttribute('data-tid', 'Card'); //для автотестов СКБ Контур
}


//Функция для закрытия карты

function closeCard(cardElement) {
    cardElement.setAttribute('data-tid', 'Card-flipped');     //для автотестов СКБ Контур
    
    setTimeout( function() {
        if (!cardElement.classList.contains('flip'))
            cardElement.classList.add('flip');
    }, 500);
}


//Функция делает карту прозрачной

function disappearCard(cardElement) {
    setTimeout( function() {
        if (!cardElement.classList.contains('disappear')) {
            cardElement.classList.add('disappear');
        }
    }, 500);
}


//Функция для проявления всех исчезнувших карт

function unDisappearAllCard(cardsElements) {
    for (let i = 0; i < cardsElements.length; i++) {
        if (cardsElements[i].classList.contains('disappear')) {
            cardsElements[i].classList.remove('disappear');
        }
    }
}


//Функция подсчета очков

function countPoints(isHit, paramsObject) {
    if (isHit) {
        paramsObject.sumPoints += paramsObject.countClosedPairs * paramsObject.multiplier;
        paramsObject.countClosedPairs--;
    } else {
        paramsObject.sumPoints -= paramsObject.countClosedPairs * paramsObject.multiplier;
    }
    
    return paramsObject.sumPoints;
}


//Функция вывода очков на табло

function printScores(points) {
    scoresBoard.innerHTML = points.toString();
}


//Функция для вычисления массива со случайными уникальными значениями из диапазона
//Краткое описание: взять из диапазона minValue - maxValue, amountValues штук случайных уникальных значений и заполнить массив arr

function getRandomArr(arr, minValue, maxValue, amountValues) {
    let avalibleValueArr = [];
    let randomIndex;
    let randomValue;
    
    for (let i = 0; i < (maxValue - minValue); i++) {
        avalibleValueArr[i] = minValue + i;
    }
    
    for (let i = 0; i < amountValues; i++) {
        randomIndex = getRandomValue(0, avalibleValueArr.length - 1);
        randomValue = avalibleValueArr[randomIndex];
        arr[i] = randomValue;
        avalibleValueArr.splice(randomIndex, 1);
    }
    
    return arr;
}


//Функция выдачи случайного значения из диапазона min - max

function getRandomValue(minValue, maxValue) {
    return Math.floor(Math.random()*(maxValue - minValue) + minValue + 0.5);
}