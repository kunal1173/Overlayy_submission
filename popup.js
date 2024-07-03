async function fetchAndDisplayInterests() {
  try {
    const userInterests = await getUserInterests();
    const response = await fetch('http://localhost:3000/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInterests }),
    });

    const data = await response.json();
    document.getElementById('interest-data').textContent = data.response;

    // Update the paragraph every 10 seconds
    setTimeout(fetchAndDisplayInterests, 10000);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function getUserInterests() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('userInterests', (result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(result.userInterests);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('analyze-button').addEventListener('click', fetchAndDisplayInterests);
});
