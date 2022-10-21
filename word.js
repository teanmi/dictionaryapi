let error;

const searchWord = async () => {
  error = false;
  const wordsHTML = document.querySelector(".words");
  wordsHTML.innerHTML = "";

  const word = document.getElementById("search-bar").value.toLowerCase();

  if (!word) {
    wordsHTML.innerHTML += `<div class="word">
  <h1 class="word__title">${"Please enter a word"}</h1>
    <div class="word__eachMeaning"></div>
  </div>`;
    return;
  }

  var request;
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
    <div class="word__eachMeaning">${"Cannot find word"}</div>
  </div>`;
    return;
  }

  const wordJson = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
  );
  const wordData = await wordJson.json();

  wordsHTML.innerHTML += `<div class="word">
  <h1 class="word__title">${word}</h1>
    <div class="word__eachMeaning"></div>
  </div>`;

  displayEachWordMeaning(wordData);
};

const displayEachWordMeaning = (word) => {
  const eachMeaningHTML = document.querySelector(".words").lastElementChild;

  word.forEach((ele) => {
    const meanings = getWordMeanings(ele.meanings);

    // fix phoneitic?
    eachMeaningHTML.innerHTML += `<p class="word__phonetics">Phonetic:</p>
    <div class="word__meaning">
      ${meanings}
    </div>
    `;
  });
};

const getWordMeanings = (meanings) => {
  let returnMeaning = "";

  meanings.forEach((ele) => {
    const definitions = getWordDefinitions(ele.definitions);

    returnMeaning += `<div class="word__definition">
    <ul class word__definitions>
    ${ele.partOfSpeech}
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
