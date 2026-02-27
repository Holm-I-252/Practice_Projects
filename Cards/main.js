const apiUrl = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1";
let piles = {"discard": [],
                "player1": [],
                "player2": [],
                "player3": [],
                "player4": []
            };

let selectedCards = [];

async function getDeck(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error fetching deck:', error);
    }
}

function drawCard(deckId) {
    const drawUrl = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`;
    return fetch(drawUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => data.cards[0])
        .catch(error => {
            console.error('Error drawing card:', error);
        });
}

async function dealCards(deckId, players) {
    for (let i = 1; i <= players; i++) {
    let dealUrl = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${Math.floor(52/players)}`;
    try {
        const response = await fetch(dealUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`Dealt cards:`, data.cards);
        piles[`player${i}`] = piles[`player${i}`].concat(data.cards);
    }
    catch (error) {
        console.error('Error dealing cards:', error);
    }
}
    return piles;
}


async function setupGame() {
    const deckData = await getDeck(apiUrl);
    console.log('Deck data:', deckData);
    // const card = await drawCard(deckData.deck_id);
    // console.log('Drew card:', card);
    const players = 2;
    const dealtCards = await dealCards(deckData.deck_id, players);
    console.log(`Dealt cards to ${players} players:`, dealtCards);
}
setupGame();

// 1. Your 'Hand' of Card Objects
function sortCards(cards) {
  
  const valueMap = {
    'ACE': 14,
    'KING': 13,
    'QUEEN': 12,
    'JACK': 11
  };

  function getWeight(valueStr) {
    // 1. Check if it is a Face Card in our map
    if (valueMap[valueStr]) {
      return valueMap[valueStr];
    }
    
    // 2. If not, parse the string into an Integer
    // "10" becomes 10, "2" becomes 2
    return parseInt(valueStr, 10);
  }

  return cards.sort((a, b) => {
    return getWeight(a.value) - getWeight(b.value);
  });
}

function selectCard(code, value, playerPile) {
    let cardIndex = piles[playerPile].findIndex(card => card.code === code);
    if (cardIndex === -1) {
        console.error(`Card with code ${code} not found in ${playerPile}'s pile.`);
        return;
    }
    if (selectedCards.length < 1) {
        let selectedCard = piles[playerPile].splice(cardIndex, 1)[0];
        selectedCards.push(selectedCard);
        displayCards(playerPile);
    } else if (value == selectedCards[0].value) {
        let selectedCard = piles[playerPile].splice(cardIndex, 1)[0];
        selectedCards.push(selectedCard);
        displayCards(playerPile);
    } else {
        console.log(`You can only select multiple cards of the same value.`);
    }
    
}

function playCards() {
    if (selectedCards.length === 0) {
        console.log('No cards selected to play.');
        return;
    }
    piles['discard'] = piles['discard'].concat(selectedCards);
    selectedCards = [];
    displayCards("player1");
    console.log('Played selected cards to discard pile.' + piles['discard'].length + ' cards in discard pile now.' );

}

function displayCards(playerPile) {
    let selected_cards_div = document.getElementById('selected_cards');
    selected_cards_div.innerHTML = '';
    selectedCards.forEach(card => {
        let cardImg = document.createElement('img');
        cardImg.src = card.image;
        cardImg.alt = `${card.value} of ${card.suit}`;
        cardImg.classList.add('card');
        selected_cards_div.appendChild(cardImg);
    });
    sortCards(piles[playerPile]);
    let playerDiv = document.getElementById(`${playerPile}_hand`);
    playerDiv.innerHTML = ''; // Clear existing cards
    playerDiv.style.setProperty('--total', piles[playerPile].length);
    let cardNum = 1
    piles[playerPile].forEach(card => {
        let cardImg = document.createElement('img');
        cardImg.src = card.image;
        cardImg.alt = `${card.value} of ${card.suit}`;
        cardImg.classList.add('card');
        cardImg.classList.add(`card${cardNum}`);
        cardImg.style = "--i: " + cardNum; // For CSS variable

        cardImg.addEventListener('click', () => {
            console.log(`Clicked on ${card.value} of ${card.suit}`);
            selectCard(card.code, card.value, playerPile);
        });

        playerDiv.appendChild(cardImg);
        cardNum++;
    });
    console.log(`Displayed cards for ${playerPile}`);
}

document.getElementById('playButton').addEventListener('click', () => {
    playCards();
});
setTimeout(() => {
    displayCards("player1");
}, 1000);    