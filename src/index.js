const form = document.getElementById('form');
const button = document.getElementById('submit-button');
const list = document.getElementById('list');
const onlineList = document.querySelector('#online-list');
const onlineButton = document.querySelector('#online-button');
const localButton = document.querySelector('#local-button');
const name = form.name;
const price = form.price;
let productList = [];
const nodesItems = [];
const onlineListArray = [];

localButton.addEventListener('click', clearLocalStorage);
onlineButton.addEventListener('click', () =>
  fetchData(`${API}?limit=10&offset=10`)
);

const API = 'https://api.escuelajs.co/api/v1/products';

let startPosition;
let finalPosition;

if (getLocalStorage()) {
  productList = getLocalStorage();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  productList.push({ name: name.value, price: price.value });
  window.localStorage.setItem('local', JSON.stringify(productList));
  createItem(name.value, price.value, list, nodesItems);
  cleanInputs();
});

function getLocalStorage() {
  let obj = JSON.parse(window.localStorage.getItem('local'));
  return obj;
}

function createItem(name, price, container, array) {
  if (name === '' || price === '') return;

  const li = document.createElement('li');
  li.classList.add('list--item');

  li.setAttribute('data-index', array.length);

  li.innerHTML = `
    <span>${array.length}</span>
    <div class='item--draggable' draggable='true'>
      <p>${name}</p>
      <p>${price}$</p>
      <span>...</span>
    </div>
`;
  array.push(li);
  container.appendChild(li);
  addEvents(li);
}

function clearLocalStorage() {
  window.localStorage.clear();
}

function cleanInputs() {
  name.value = '';
  price.value = '';
}

function addEvents(node) {
  const draggable = node.children[1];
  draggable.addEventListener('dragstart', dragStart);

  node.addEventListener('drop', dragDrop);
  node.addEventListener('dragover', dragOver);
  node.addEventListener('dragenter', dragEnter);
  node.addEventListener('dragleave', dragLeave);
}

function dragStart() {
  startPosition = Number(this.closest('li').getAttribute('data-index'));
}

function dragDrop() {
  finalPosition = Number(this.getAttribute('data-index'));
  swapItems(startPosition, finalPosition);
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter() {
  //   console.log('dragEnter');
  this.classList.add('over');
}
function dragLeave() {
  this.classList.remove('over');
  //  console.log('dragLeave');
}

function swapItems(initialPosition, finalPosition) {
  console.log(initialPosition, finalPosition);
  const firstElement =
    nodesItems[initialPosition].querySelector('.item--draggable');
  const secondElement =
    nodesItems[finalPosition].querySelector('.item--draggable');

  nodesItems[initialPosition].appendChild(secondElement);
  nodesItems[finalPosition].appendChild(firstElement);

  if (nodesItems[finalPosition].classList.contains('over')) {
    nodesItems[finalPosition].classList.remove('over');
  }
}

function fetchData(APIWithQuery) {
  fetch(APIWithQuery)
    .then((data) => data.json())
    .then((products) => {
      products.map((product) => {
        createItem(product.title, product.price, onlineList, onlineListArray);
      });
    });
}

fetchData(`${API}?limit=10&offset=0`);
// for (let i = 0; i < 10; i++) {
//   createItem(`Product${i}`, i * 1000);
// }
