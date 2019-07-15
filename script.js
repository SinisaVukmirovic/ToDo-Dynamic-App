const clear = document.querySelector('.clear');
const dateElem = document.getElementById('date');
const list = document.getElementById('list');
const input = document.getElementById('input');

// class names
const CHECK = 'fa-check-circle';
const UNCHECK = 'fa-circle';
const LINE_THROUGH = 'lineThrough';

// show todays date functionality
const options = {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
}

const today = new Date();

dateElem.innerHTML = today.toLocaleDateString('en-US', options);

// getting variables from local storage
let LIST, id;
// getting items array from local storage
let data = localStorage.getItem('TODO');

// checking if local storage is empty
if (data) {
    LIST = JSON.parse(data);

    id = LIST.length;

    loadToDo(LIST);
}
else {
    LIST = [];
    id = 0;
}

function loadToDo(arr) {
    arr.forEach(item => {
        addToDo(item.name, item.id, item.done, item.trash);
    });
}

// clearing list and local storage of clear button click functionality
clear.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
}); 

function addToDo(toDo, id, done, trash) {

    // first checking if item is deleted (trash) trash = true
    if (trash) { return; }

    // if trash is false, running code below
    // checking if done or not state 
    const DONE = done ? CHECK : UNCHECK;
    const LINE = done ? LINE_THROUGH : '';

    const text = `
        <li class="item" job="list-item">
            <i class="far ${DONE} complete" job="complete" id=${id}></i>
            <p class="text ${LINE}" job="list-text">${toDo}</p>
            <i class="far fa-trash-alt delete" job="delete" id=${id}></i>
        </li>
    `;
    // job list item and job list text are just to prevent error if list is clicked
    // outside of completed circle or trash 

    const position = 'beforeend';

    list.insertAdjacentHTML(position, text);
}

document.addEventListener('keyup', (e) => {
    // checking if the enter key is pressed
    if (e.keyCode === 13) {
        const toDo = input.value;

        // checking if the input field is not empty
        if (toDo ) {
            addToDo(toDo, id, false, false);

            LIST.push(
                {
                    name: toDo,
                    id: id,
                    done: false,
                    trash: false
                }
            );

            // setting items array to local storage
            localStorage.setItem('TODO', JSON.stringify(LIST));

            id++;
        }

        input.value = '';
    }
});

// check or uncheck buttond display functionality
function completeToDo(elem) {
    elem.classList.toggle(CHECK);
    elem.classList.toggle(UNCHECK);

    // to change text after check/uncheck button
    elem.parentNode.querySelector('.text').classList.toggle(LINE_THROUGH);

    // checking and updating DONE property inside LIST array
    LIST[elem.id].done = LIST[elem.id].done ? false : true;
}

// removing item from list functionality
function removeToDo(elem) {
    elem.parentNode.parentNode.removeChild(elem.parentNode);

    // updating LIST array
    LIST[elem.id].trash = true;
}

// targeting dynamically created elements inside list
list.addEventListener('click', (e) => {
    let elem = e.target;
    const elementId = elem.id;
    const elementJob = elem.attributes.job.value;

    if (elementJob === 'complete') {
        completeToDo(elem);
    }
    else if (elementJob === 'delete') {
        removeToDo(elem);
    }

   // setting items array to local storage
    localStorage.setItem('TODO', JSON.stringify(LIST));
});