const wikiUrl = 'https://en.wikipedia.org/api/rest_v1/page/summary/';
const searchInput = document.getElementById('search-input');
const placeInfo = document.getElementById('place-info');
const form = document.querySelector('form');

async function fetchJSON(url) {
  try {
    const response = await fetch(url);
    return await response.json(); 
  } catch (err) {
    throw err;
  }
}

// Handle fetch request
async function getPlace() {
  const { value } = searchInput;
  
  const placeJSON = await fetchJSON(wikiUrl + value);
  return placeJSON;
}

// check json data has coordinates object that makes this a place
function checkPlaceHasCoords(json) {
  return typeof json.coordinates === "object" ? json : null;
}

// Generate HTML displaying place information
function generateHTML(place) {
  const section = document.createElement('section');

  if (placeInfo.childNodes.length) {
    placeInfo.replaceChild(section, placeInfo.childNodes[0]);
  } else {
    placeInfo.appendChild(section);
  }

  section.setAttribute('class', 'row my-2');
  section.innerHTML = `
    <div class="col-md-6 d-flex flex-column mb-2 mb-md-0">
      <img src="${place.originalimage ? place.originalimage.source : "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"}" class="mx-auto" />
    </div>
    <div class="col-md-6">
      <table class="table table-striped">
        <tbody class="text-right">
          <tr>
            <th>Name</th>
            <td>${place.title}</td>
          </tr>
          <tr>
            <th>Latitude</th>
            <td>${place.coordinates.lat}</td>
          </tr>
          <tr>
            <th>Longitude</th>
            <td>${place.coordinates.lon}</td>
          </tr>
          <tr>
            <th>Description</th>
            <td>${place.description}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="col-12 mt-3">
      <p>${place.extract}</p>
    </div>
  `;
}

// Form submit event listener
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (searchInput.value !== '') {
    getPlace()
      .then(checkPlaceHasCoords)
      .then(generateHTML)
      .catch((err) => {
        placeInfo.innerHTML = `<h4 class="text-center w-100">What you searched for isn't a place or can't be found.</h4>`
      })
      .finally(() => searchInput.value = '');
  }
});