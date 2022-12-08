let currentLetter = 1;
let currentWordNumber = 1;
let word = '';
let currentWord;
const getApi = `https://words.dev-apis.com/word-of-the-day`;
const postApi = `https://words.dev-apis.com/validate-word`;
let wordOTD; //word of the day
const wordLength = 5;
let isValidWord;
let result = document.querySelector("#result");
const loading = document.querySelector(".loading");

window.addEventListener("keydown",async function enterInput(e){
    let letter = e.key;
    let input = document.querySelector(`#letter-${currentLetter}-word-${currentWordNumber}`);
    result.innerText = "";
    result.classList = "";  
    if(isLetter(letter) && (currentLetter<6) && (currentWordNumber<7)){
        input.innerText = letter;
        word += letter;
        currentLetter++;
        isLoading = true;
        loadingToggle(isLoading);
        isValidWord = await checkValidity(word);
        isLoading = false;
        loadingToggle(isLoading);
        result.innerText = "";
        if((word.length === wordLength) && isValidWord===true){
            console.log(`Yeah this word is a valid 5-Letter word: ${word}`);
            wordOTD = await wordle();
            let map = makeMap(wordOTD);
            for(let i=0; i<word.length; i++){
                let letter = word[i];
                let x = document.querySelector(`#letter-${i+1}-word-${currentWordNumber}`);
                if(letter === wordOTD[i]){
                    x.classList.add("green");
                    map[letter]--;
                }else if(wordOTD.includes(letter) && map[letter]){
                    x.classList.add("yellow");
                }else{
                    x.classList.add("gray");
                }
                /*isLoading = true;
                loadingToggle(isLoading);
                let colorCode = await checkLetterIncluded(letter, i);
                isLoading = false;
                loadingToggle(isLoading);
                result.innerText = "";
               
                switch(colorCode){
                    case `G`:
                        x.classList.add("green");
                      break;
                    case `Y`:
                        x.classList.add("yellow");
                      break;
                    default:
                        x.classList.add("gray");
                }*/
                console.log(map);
            }if(word != wordOTD){
                result.innerText = 
                `Opps! Wrong guess try again.
                `;
                result.classList.add("result");
            }else if(word === wordOTD){
                result.innerText = 
                `Exactly the wordle of the day was 
                "${word.toUpperCase()}"
                Congratulations You Win!!!
                Please Come again tomorrow for a new wordle.
                `;
                result.classList.add("result");
                return;
            }
            currentWordNumber++;
            currentLetter = 1;
            word = '';
        }if(isValidWord===false){
            result.innerText = 
                `this word is not valid
                `;
                result.classList.add("result");
        }else if((currentLetter>6) && (currentWordNumber>7)){
            this.alert(`you lose, sorry`);
        } 
    }else if(letter === `Backspace` && currentLetter>1){
        document.querySelector(`#letter-${--currentLetter}-word-${currentWordNumber}`).innerText = '';
        word = word.substring(0,word.length-1);
    }
});    

//to check for letter
function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

//to get the word of the day
//using async - await
async function wordle(){
    isLoading = true;
    loadingToggle(isLoading);
    const promise = await fetch(getApi);
    const wordObject = await promise.json();
    isLoading = false;
    loadingToggle(isLoading);
    return wordObject.word;
}
//using .then() (which is much worse)
function wordle2(){
    const promise = fetch(getApi);
    promise
    .then((res)=>{
        const processedRes = res.text();
        return processedRes;
    })
    .then((processedRes)=>{
        const finalRes = JSON.parse(processedRes);
    })
}
//checking if the word is valid five letter word
async function checkValidity(word){
    isLoading = true;
    loadingToggle(isLoading);
    const promise = await fetch(postApi,{
        method: 'POST', 
        body: JSON.stringify({
            "word": word 
        })
    })
    const processedResponse = await promise.json();
    isLoading = false;
    loadingToggle(isLoading);
    let valid = processedResponse.validWord;
    return valid;
}
//function to check the inclusivity of the letters with respect to the word of the day
async function checkLetterIncluded(letter, order){
    let code = `N`;
    for(let i=0;i<wordOTD.length;i++){
        if(letter === wordOTD[i] && i === order){
            return code = `G`; 
        }
    }
    for(let i=0;i<wordOTD.length;i++){
        if(letter === wordOTD[i] && map[letter]){
            console.log(map[letter]);
            code = `Y`; 
        }
    }
    return code;
}
function loadingToggle(isLoading){
    loading.classList.toggle("hidden", !isLoading);
    result.innerText = "";
    result.classList = ""
}

function makeMap(aWord){
    const obj = {};
    for(let i=0; i<aWord.length; i++){
        letter = aWord[i];
        if(obj[letter]){
            obj[letter]++
        }else{
            obj[letter] = 1
        }
    }
    return obj;
}


