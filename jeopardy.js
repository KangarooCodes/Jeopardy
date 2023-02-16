const APIURL = "https://jservice.io/api/";
const catNUM = 6;
const clueNUM = 5;

// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",h
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];


/** Get catNUM random category from API.
 *
 * Returns array of category ids
 */

async function getCategoryIds() {
  let response = await axios.get(`${APIURL}categories?count=75`);
  let ID = response.data.map(c => c.id);
  return _.sampleSize(ID, catNUM);
/// ABOVE helps produce random samples from the mapped Response IDs
/// Learned some LODASH to help with this application
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

async function getCategory(ID) {
  let response = await axios.get(`${APIURL}category?id=${ID}`);
  let cat = response.data;
  let allClues = cat.clues;
  let randomClues = _.sampleSize(allClues, clueNUM);
  let clues = randomClues.map(c => ({
    question: c.question,
    answer: c.answer,
    showing: null,
  }));

  return { title: cat.title, clues };
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
  // BELOW adds rows for Header //
  $("#jeopardy thead").empty();
  let $tr = $("<tr>");
  for (let i = 0; i < catNUM; i++) {
    $tr.append($("<th>").text(categories[i].title));
  };

  $("#jeopardy thead").append($tr);

  // BELOW adds rows for questions //
  $("#jeopardy tbody").empty();
  for (let x = 0; x < clueNUM; x++) {
    let $tr = $("<tr>");
    for (let i = 0; i < catNUM; i++) {
      $tr.append($("<td>").attr("id", `${i}-${x}`).text("?"));
    }
    $("#jeopardy tbody").append($tr);
  };
}

function money() {   // ADDS $ to each box, like real Jeopardy
  const one = document.getElementById("0-0")
  const one1 = document.getElementById("1-0")
  const one2 = document.getElementById("2-0")
  const one3 = document.getElementById("3-0")
  const one4 = document.getElementById("4-0")
  const one5 = document.getElementById("5-0")
  one.innerHTML = "$200"
  one1.innerHTML = "$200"
  one2.innerHTML = "$200"
  one3.innerHTML = "$200"
  one4.innerHTML = "$200"
  one5.innerHTML = "$200"
  const two = document.getElementById("0-1")
  const two1 = document.getElementById("1-1")
  const two2 = document.getElementById("2-1")
  const two3 = document.getElementById("3-1")
  const two4 = document.getElementById("4-1")
  const two5 = document.getElementById("5-1")
  two.innerHTML = "$400"
  two1.innerHTML = "$400"
  two2.innerHTML = "$400"
  two3.innerHTML = "$400"
  two4.innerHTML = "$400"
  two5.innerHTML = "$400"
  const three = document.getElementById("0-2")
  const three1 = document.getElementById("1-2")
  const three2 = document.getElementById("2-2")
  const three3 = document.getElementById("3-2")
  const three4 = document.getElementById("4-2")
  const three5 = document.getElementById("5-2")
  three.innerHTML = "$600"
  three1.innerHTML = "$600"
  three2.innerHTML = "$600"
  three3.innerHTML = "$600"
  three4.innerHTML = "$600"
  three5.innerHTML = "$600"
  const four = document.getElementById("0-3")
  const four1 = document.getElementById("1-3")
  const four2 = document.getElementById("2-3")
  const four3 = document.getElementById("3-3")
  const four4 = document.getElementById("4-3")
  const four5 = document.getElementById("5-3")
  four.innerHTML = "$800"
  four1.innerHTML = "$800"
  four2.innerHTML = "$800"
  four3.innerHTML = "$800"
  four4.innerHTML = "$800"
  four5.innerHTML = "$800"
  const five = document.getElementById("0-4")
  const five1 = document.getElementById("1-4")
  const five2 = document.getElementById("2-4")
  const five3 = document.getElementById("3-4")
  const five4 = document.getElementById("4-4")
  const five5 = document.getElementById("5-4")
  five.innerHTML = "$1000"
  five1.innerHTML = "$1000"
  five2.innerHTML = "$1000"
  five3.innerHTML = "$1000"
  five4.innerHTML = "$1000"
  five5.innerHTML = "$1000"
}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(e) {
  let id = e.target.id;
  let [ID, clueId] = id.split("-");
  let clue = categories[ID].clues[clueId]; //acquires the amount Q/As
  let msg;

  if (!clue.showing) {  // changes $ box based on what is showing
    msg = clue.question;
    clue.showing = "question";
  } else if (clue.showing === "question") {  // if is question when
    msg = clue.answer;                    // clicked, show answer    
    clue.showing = "answer";
  } else {
    return  // if already showing answer; ignore
  };

  $(`#${ID}-${clueId}`).text(msg); //innerHTML would not work for this
}



/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() { //Created my own Loading screen to display
  const thead = document.getElementById('th');
  const img = document.createElement('img');
  img.src = "loading.png";

  if (thead.hasChildNodes() == false) {
    thead.appendChild(img)
  }
}


/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
  let IDs = await getCategoryIds();

  categories = [];

  for (let ID of IDs) {
    categories.push(await getCategory(ID));
  }

  fillTable();
  money();
}

$("#restart").on("click", setupAndStart);  //button to restart/reload

$(async function () {     //sets the motion for click events
    setupAndStart();    
    $("#jeopardy").on("click", "td", handleClick);
  }
);

showLoadingView() //shows loading screen while initial request is being pulled