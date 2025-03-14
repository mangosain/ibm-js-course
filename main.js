async function fetchDestinations() {
  try {
    const response = await fetch("./travel_recommendation_api.json");
    const data = await response.json();
    console.log("Fetched destinations:", data);
    return data;
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return null;
  }
}

function getAllDestinations(data) {
  const destinations = [];

  // Add countries and cities
  data.countries.forEach((country) => {
    destinations.push({
      name: country.name,
      description: `Country with cities like ${country.cities
        .map((city) => city.name.split(",")[0])
        .join(", ")}`,
      imageUrl: country.imgUrl,
    });

    country.cities.forEach((city) => {
      destinations.push({
        name: city.name,
        description: city.description,
        imageUrl: city.imageUrl,
      });
    });
  });

  // Add temples
  data.temples.forEach((temple) => {
    destinations.push({
      name: temple.name,
      description: temple.description,
      imageUrl: temple.imageUrl,
    });
  });

  // Add beaches
  data.beaches.forEach((beach) => {
    destinations.push({
      name: beach.name,
      description: beach.description,
      imageUrl: beach.imageUrl,
    });
  });

  return destinations;
}

function searchDestinations(query, destinations) {
  if (!query) return [];

  query = query.toLowerCase();
  return destinations.filter((destination) => {
    const name = destination.name.toLowerCase();
    const description = destination.description.toLowerCase();

    return name.includes(query) || description.includes(query);
  });
}

function createResultItem(destination) {
  return `
    <div class="result-item">
      <img src="${destination.imageUrl}" alt="${destination.name}" class="result-image">
      <div class="result-content">
        <div class="result-title">${destination.name}</div>
        <div class="result-description">${destination.description}</div>
        <button class="result-visit">Visit</button>
      </div>
    </div>
  `;
}

async function initializeSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const clearBtn = document.getElementById("clearBtn");

  const data = await fetchDestinations();
  if (!data) return;

  const destinations = getAllDestinations(data);

  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.trim();
    const results = searchDestinations(query, destinations);

    if (query && results.length > 0) {
      searchResults.innerHTML = results.map(createResultItem).join("");
      searchResults.classList.add("active");
    } else {
      searchResults.innerHTML = "";
      searchResults.classList.remove("active");
    }
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchResults.innerHTML = "";
    searchResults.classList.remove("active");
  });

  // Close search results when clicking outside
  document.addEventListener("click", (e) => {
    if (!searchResults.contains(e.target) && !searchInput.contains(e.target)) {
      searchResults.classList.remove("active");
    }
  });
}

initializeSearch();

const submitBtn = document.querySelector(".submit-form");

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("message").value = "";

  alert(
    `Your query has been successfully submitted!!!! \nName: ${name}, \nEmail: ${email}, \nMessage: ${message}`
  );
});
