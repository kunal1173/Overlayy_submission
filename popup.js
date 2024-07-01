function updateInterestData() {
  chrome.storage.local.get('userInterests', (data) => {
    let interestDataDiv = document.getElementById('interest-data');
    interestDataDiv.innerHTML = "";
    let interests = data.userInterests;
    for (let interest in interests) {
      let interestElement = document.createElement('p');
      interestElement.textContent = `${interest}: ${interests[interest]}`;
      interestDataDiv.appendChild(interestElement);
    }
  });
}

async function analyzeInterests() {
  chrome.storage.local.get('userInterests', async (data) => {
    const response = await fetch('http://localhost:3000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userInterests: data.userInterests })
    });

    const result = await response.json();
    console.log("response", result.response);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  updateInterestData();
  setInterval(updateInterestData, 10000);

  document.getElementById('analyze-button').addEventListener('click', analyzeInterests);
});
