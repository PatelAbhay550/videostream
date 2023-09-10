
const apiKey = '4OLvd5Qn46oA4lwWIOwUG1Td5Chl45LQiMCFUZparv1v6EytAUXkYmw5';
const apiUrl = 'https://api.pexels.com/videos/search';

// Function to create the video card HTML structure
function createVideoCard(videoData) {
  const videoCard = document.createElement('div');
  videoCard.classList.add('video-card');

  // Create and set the thumbnail video
  const videoElement = document.createElement('video');
  videoElement.classList.add('video-thumbnail');
  videoElement.style.background = 'rgb(167, 175, 178)';
  videoElement.src = videoData.video_files[1].link;
  videoElement.alt = 'Video Thumbnail';

  // Create a sub-container for channel details
  const detailsContainer = document.createElement('div');
  detailsContainer.classList.add('dets');

  // Create and set the channel avatar
  const channelAvatar = document.createElement('img');
  channelAvatar.classList.add('channel-avatar');
  channelAvatar.src = videoData.image;
  channelAvatar.alt = 'Channel Avatar';

  // Create a sub-container for video info
  const infoContainer = document.createElement('div');
  infoContainer.classList.add('video-info');
 const time = document.createElement('div');
  time.classList.add('timeline');
  const slider = document.createElement('div');
  slider.classList.add('slider');



  // Create and set the video title
  const videoTitle = document.createElement('div');
  videoTitle.classList.add('video-title');
  videoTitle.textContent = videoData.user.name + ' uploaded'; // Adjust based on actual response
const videoDuration = document.createElement('span');
  videoDuration.classList.add('duration');
  videoDuration.textContent = videoData.duration + " sec"; // Adjust based on actual response

  // Create and set the channel name, views, and upload date
  const videoMetadata = document.createElement('div');
  videoMetadata.classList.add('video-metadata');
  videoMetadata.innerHTML = `<span style="cursor: pointer;" class="channel-name">${videoData.user.name}</span><br />• <span class="views">${videoData.height} views</span> • <span class="upload-date">${videoData.duration + ' hours ago'}</span>`;

  // Append elements to their respective containers
  detailsContainer.appendChild(channelAvatar);
  infoContainer.appendChild(videoTitle);
  infoContainer.appendChild(videoMetadata);
  infoContainer.appendChild(videoDuration);
  infoContainer.appendChild(time);
  time.appendChild(slider);

  // Append containers to the main video card
  videoCard.appendChild(videoElement);
  videoCard.appendChild(detailsContainer);
  videoCard.appendChild(infoContainer);

  // Add mouseover and mouseleave event listeners
  let timeoutId; // Variable to store the timeout ID

  videoElement.addEventListener('mouseover', () => {
    // Play the video after 1.5 seconds of mouseover
    timeoutId = setTimeout(() => {
      videoElement.play();
      videoElement.style.cursor = "none";
      videoDuration.style.opacity = 0;
      time.style.display="block";
      videoElement.addEventListener('timeupdate', () => {
        // Calculate the width based on current time and duration
        const width = (videoElement.currentTime / videoElement.duration) * 100 + '%';
        slider.style.width = width;
      });
      videoElement.style.opacity = 0.9;
    }, 1500);
  });

  videoElement.addEventListener('mouseleave', () => {
    // Clear the timeout when the mouse leaves
    clearTimeout(timeoutId);
    videoDuration.style.opacity = 1;
    videoElement.style.cursor = "auto";
    videoElement.pause();
    time.style.display="none";
    videoElement.currentTime = "0";
  });

  return videoCard;
}

// Function to fetch and display videos based on a query
function fetchAndDisplayVideos(query) {
  // Construct the URL with query parameters
  const numberOfVideos = 50; // Specify the number of videos you want to fetch
  const url = `${apiUrl}?query=${query}&per_page=${numberOfVideos}`;

  // Make the API request with the API key in the headers
  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': apiKey,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Clear existing video cards
      const videosContainer = document.querySelector('.videos');
      videosContainer.innerHTML = '';

      // Process and display the video data by creating and appending video cards
      data.videos.forEach((videoData) => {
        const videoCard = createVideoCard(videoData);
        videosContainer.appendChild(videoCard);
      });
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Get references to the search input element
const searchInput = document.getElementById('searchbox');

// Add an event listener to the search input
searchInput.addEventListener('input', (event) => {
  const searchTerm = event.target.value.trim(); // Get the search term from the input

  if (searchTerm) {
    // Call the fetchAndDisplayVideos function with the search term
    fetchAndDisplayVideos(searchTerm);
  }
});

// Initial load with the default query
const defaultQuery = 'india'; // Replace with your desired default query
fetchAndDisplayVideos(defaultQuery);

