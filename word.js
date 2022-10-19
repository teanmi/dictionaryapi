
const searchWord = async () => {
  const wordsHTML = document.querySelector(".words");
  wordsHTML.innerHTML = ""

  const word = document.getElementById("search-bar").value;

  if (!word) {
    alert("please enter a word");
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