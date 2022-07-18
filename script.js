const inputcep = document.querySelector('.cep-input');
const buttonSubmit = document.querySelector('#cep-submit')
const getResult = document.querySelector('#result')
const getAddrInfo = document.querySelector('.addr-info')
const getLoadContainer = document.querySelector('.load-search');
const getLottiePlayer = document.querySelector('lottie-player');
const getFoundAddressJson = document.querySelector('.found-address');
const getNotFoundAddressJson = document.querySelector('.notfound-address');
const getFindingText = document.querySelector('.load-search p')
const activeClass = 'active';
let cepnumber;
let cepSplit;
let search;

const addressReturned = [
  {
    name: 'cep',
    optional: 'CEP',
    value: ''
  },
  {
    name: 'logradouro',
    optional: 'Rua',
    value: '',
  },
  {
    name: 'bairro',
    optional: 'Bairro',
    value: ''
  },
  {
    name: 'localidade',
    optional: 'Cidade',
    value: ''
  },
  {
    name: 'uf',
    optional: 'Estado',
    value: ''
  },
  {
    name: 'ddd',
    optional: 'DDD',
    value: ''
  },
]


buttonSubmit.addEventListener('click', handleClick);

function handleClick(event) {
  event.preventDefault();
  if(inputcep.value.length == 10) {
    inputcep.classList.remove('error');
    let cep = inputcep.value;
    if(cepSplit) {
      getLottiePlayer.style.display = 'block';
      getNotFoundAddressJson.style.display = 'none';
      getFoundAddressJson.style.display = 'none';
    }
    cepSplit = cep.split('.').join('').split('-').join('');
    getLoadContainer.classList.add(activeClass);
    getFindingText.innerHTML = 'Finding location<span>.</span><span>.</span><span>.</span>'
    getLottiePlayer.getLottie().goToAndPlay(0, false);
    fetch(`https://viacep.com.br/ws/${cepSplit}/json/`)
    .then(response => response.json())
    .then(address => {
      switch(address.erro) {
        case 'true':
          getLottiePlayer.addEventListener('complete', handleSearching);
          cepSplit = '';
          search = 'notfound';
          break;
        case undefined:
          search = 'found';
          getLottiePlayer.addEventListener('complete', handleSearching);
          setTimeout(() => {
            getResult.style.display = 'block';
            Object.entries(address).map(item => {
              const getItem = document.querySelectorAll('.addr-info');
              addressReturned.forEach((arrItem, index) => {
                if(arrItem.name == item[0]) {
                  arrItem.value = item[1];
                  getItem[index].innerHTML = `<strong>${arrItem.optional}</strong> <p>${arrItem.value}</p>`;
                }
              })
            })
          }, 2500)
          break;
        default: return;
      }
    })
  } else {
    inputcep.classList.add('error');
  }
}


function handleSearching() {
  switch(search) {
    case 'found':
      getFindingText.innerHTML = 'Location found!';
      getFoundAddressJson.getLottie().goToAndPlay(0, false);
      getLottiePlayer.style.display = 'none';
      getFoundAddressJson.style.display = 'block';
      getFindingText.style.left = "195px";
      getFoundAddressJson.addEventListener('complete', handleComplete);
      break;
    case 'notfound':
      getFindingText.innerHTML = 'Location not found!'
      getNotFoundAddressJson.getLottie().goToAndPlay(0, false);
      getResult.style.display = 'none';
      getLottiePlayer.style.display = 'none';
      getNotFoundAddressJson.style.display = 'block';
      getFindingText.style.left = "185px";
      inputcep.value = '';
      getNotFoundAddressJson.addEventListener('complete', handleComplete);      
      break;
    default: return;
  }
}

function handleComplete() {
  setTimeout(() => {
  getLoadContainer.classList.remove(activeClass);
  getLottiePlayer.style.display = 'block';
  getNotFoundAddressJson.style.display = 'none';
  getFoundAddressJson.style.display = 'none';
  }, 500)
}


function inputHandler(masks, max, event) {
	const c = event.target;
	const v = c.value.replace(/\D/g, '');
	const m = c.value.length > max ? 1 : 0;
	VMasker(c).unMask();
	VMasker(c).maskPattern(masks[m]);
	c.value = VMasker.toPattern(v, masks[m]);
}

const cepMask = ['99.999-999'];
VMasker(inputcep).maskPattern(cepMask[0]);
inputcep.addEventListener('input', inputHandler.bind(undefined, cepMask, 14), false);