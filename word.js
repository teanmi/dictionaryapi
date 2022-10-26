const searchWord = async (word = "") => {
  const wordsHTML = document.querySelector(".words");

  wordsHTML.removeChild(wordsHTML.lastChild);

  // loading state

  wordsHTML.classList.add("loading");

  await waitOneSecond();

  wordsHTML.classList.remove("loading");
  if (!word) {
    word = document.getElementById("search-bar").value;
  }

  word = word.toLowerCase();

  // check if a word is entered

  if (!word) {
    wordsHTML.innerHTML += `<div class="word">
  <h1 class="word__title">${"Please enter a word"}</h1>
    <div class="word__eachMeaning"></div>
  </div>`;
    return;
  }

  // check if word exists in api
  let request;
  if (window.XMLHttpRequest) request = new XMLHttpRequest();
  else request = new ActiveXObject("Microsoft.XMLHTTP");
  request.open(
    "GET",
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    false
  );
  request.send();
  if (request.status === 404) {
    wordsHTML.innerHTML += `<div class="word">
  <h1 class="word__title">${word}</h1>
    <div class="word__eachMeaning">${"Cannot find word you are searching for"}</div>
  </div>`;
    return;
  }

  const wordJson = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  const wordData = await wordJson.json();

  console.log(wordData);

  wordsHTML.innerHTML += `<div class="word">
  <h1 class="word__title">${word}</h1>
  </div>`;

  console.log(wordData);

  displayEachWordMeaning(wordData);
};

// display meaning of each word

const displayEachWordMeaning = (word) => {
  const eachMeaningHTML = document.querySelector(".words").lastElementChild;

  const phonetic = getPhonetic(word); // fix phonetic

  eachMeaningHTML.innerHTML += `<p class="word__phonetics">Phonetic: ${phonetic}</p>`;

  word.forEach((ele) => {
    const meanings = getWordMeanings(ele.meanings);

    eachMeaningHTML.innerHTML += `<div class="word__meaning">
      ${meanings}
    </div>
    `;
  });
};

// gets phonetic of word

const getPhonetic = (word) => {
  if (typeof word[0].phonetic !== "undefined") {
    return word[0].phonetic;
  }

  const phonetics = word[0].phonetics.filter((ele) => {
    if (typeof ele.text !== "undefined") {
      return true;
    }
  });

  console.log(phonetics);

  return phonetics[0].text;
};

const getWordMeanings = (meanings) => {
  let returnMeaning = "";

  meanings.forEach((ele) => {
    const definitions = getWordDefinitions(ele.definitions);

    returnMeaning += `<div class="word__definition">
    <ul class word__definitions>
    <em>${ele.partOfSpeech}</em>
    ${definitions}
    </ul>
    </div>`;
  });

  return returnMeaning;
};

const getWordDefinitions = (definitions) => {
  let returnDefinitions = "";

  definitions.forEach((ele) => {
    returnDefinitions += `<p class="word__defintion">${ele.definition} </p>`;
  });

  return returnDefinitions;
};

const waitOneSecond = () => {
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

// check if enter was pressed and search if so

const enterSearchIndex = (e) => {
  if (e.keyCode === 13) {
    changeWebsites();
  }
};

const enterSearchWords = (e) => {
  if (e.keyCode === 13) {
    searchWord();
  }
};

const toggleDropDown = () => {
  document.querySelector(".navbar").classList.toggle("visable")
}

// for home website
// keeps word stored and searches once arrives
const changeWebsites = () => {
  let word = document.getElementById("search__input-box").value;

  sessionStorage.setItem("word", word);
  sessionStorage.setItem("enteredWord", true);

  document.location.href = "http://127.0.0.1:5500/js/dictionaryapi/words.html"; //change later
};

if (sessionStorage.getItem("enteredWord")) {
  searchWord(sessionStorage.getItem("word"));

  sessionStorage.removeItem("word");
  sessionStorage.removeItem("enteredWord");
}
