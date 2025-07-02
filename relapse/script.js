// Array of 25 random spell words
const spellWords = [
    "matutulog", "pagkakaibigan", "pamilya", "pag-ibig", "pangarap",
    "kaligayahan", "kapayapaan", "katarungan", "katotohanan", "kalayaan",
    "paggalang", "pagmamahalan", "pasensya", "pananampalataya", "pag-asa",
    "kabaitan", "katapangan", "karunungan", "kaginhawahan", "kasiyahan",
    "pagkakaisa", "pagtulong", "pagbabago", "magandang", "masayang"
];

let currentWordIndex = Math.floor(Math.random() * spellWords.length);
let targetWord = spellWords[currentWordIndex];
const userInput = document.getElementById('userInput');
const gameContainer = document.getElementById('gameContainer');
const videoContainer = document.getElementById('videoContainer');
const video = document.getElementById('celebrationVideo');

// Background music functionality
let backgroundMusic;
const backgroundMusicSources = [
    "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", // Placeholder - you can replace with actual music files
    "https://www.soundjay.com/misc/sounds/church-bells-1.wav"   // Add your own music files to attached_assets folder
];

function initializeBackgroundMusic() {
    backgroundMusic = new Audio();
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3; // Default volume
    
    // Try to load a background music file (you can add your own to attached_assets)
    // For now, we'll create a simple ambient sound using Web Audio API
    createAmbientBackground();
}

function createAmbientBackground() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create a peaceful ambient tone
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3 note
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 2);
        
        oscillator.start();
        
        // Store references for later control
        window.ambientOscillator = oscillator;
        window.ambientGain = gainNode;
        window.ambientContext = audioContext;
        
    } catch (error) {
        console.log('Web Audio not supported, using fallback');
    }
}

function startBackgroundMusic() {
    if (window.ambientContext && window.ambientGain) {
        window.ambientGain.gain.linearRampToValueAtTime(0.1, window.ambientContext.currentTime + 1);
    }
}

function fadeBackgroundMusic() {
    if (window.ambientContext && window.ambientGain) {
        window.ambientGain.gain.linearRampToValueAtTime(0.02, window.ambientContext.currentTime + 1);
    }
}

function restoreBackgroundMusic() {
    if (window.ambientContext && window.ambientGain) {
        window.ambientGain.gain.linearRampToValueAtTime(0.1, window.ambientContext.currentTime + 1);
    }
}

// Available video sources
const videoSources = [
    "attached_assets/SnapTik-dot-Kim-f8ede9407dcbaa56f8d28e4e08097489_1751448850183.mp4",
    "attached_assets/SnapTik-dot-Kim-d137cdaf64ad04564c0ca875338429f8_1751450385264.mp4",
    "attached_assets/SnapTik-dot-Kim-ffce20b90f44717e3f6ba377039d6245_1751451472711.mp4",
    "attached_assets/SnapTik-dot-Kim-ca8f8ebde9258277fed8e2c6190c06c8_1751451481822.mp4"
];

// Bible verses about love and heartbreak
const bibleVerses = [
    "Ang Panginoon ay malapit sa mga may sirang puso. - Psalm 34:18",
    "Pinapagaling niya ang mga may sirang puso at binibigyan ng lunas ang kanilang mga sugat. - Psalm 147:3",
    "Lumapit kayo sa akin, kayong lahat na napapagal at nabibigatan, at kayo'y aking pagpapahingahin. - Matthew 11:28",
    "Huwag kang matakot, sapagkat ako'y kasama mo. - Isaiah 41:10",
    "Ang sakripisyo ng Diyos ay isang sirang espiritu; hindi mo itatakwil, O Diyos, ang isang pusong nagsisisi. - Psalm 51:17",
    "At alam natin na sa lahat ng bagay ay gumagawa ang Diyos para sa ikabubuti ng mga umiibig sa Kanya. - Romans 8:28",
    "Sapagkat alam ko ang mga plano ko para sa inyo, mga plano para sa kapayapaan at hindi para sa kasamaan. - Jeremiah 29:11",
    "Huwag kayong mabalisa sa anuman, kundi sa lahat ng bagay sa pamamagitan ng panalangin. - Philippians 4:6-7",
    "Purihin ang Diyos at Ama ng ating Panginoong Jesucristo, na nagbibigay ng kaaliwan sa lahat ng ating mga kapighatian. - 2 Corinthians 1:3-4",
    "Ang pag-iyak ay maaaring magtagal sa isang gabi, ngunit ang kagalakan ay dumarating sa umaga. - Psalm 30:5",
    "Ilagak ninyo sa Kanya ang lahat ng inyong kabigatan, sapagkat Siya'y nagmamalasakit sa inyo. - 1 Peter 5:7",
    "Pinahiran ako ng Panginoon upang ipangaral ang mabuting balita sa mga dukha. - Isaiah 61:1",
    "Ang aking laman at puso ay manghihina, ngunit ang Diyos ang aking lakas. - Psalm 73:26",
    "Ang mga kabutihan ng Panginoon ay hindi nagwawakas; ang Kanyang mga awa ay hindi natatapos. - Lamentations 3:22-23",
    "Mapapalad ang mga nagdadalamhati, sapagkat sila'y aaliwin. - Matthew 5:4",
    "Magsaya kayo sa pag-asa, magtiis sa kapighatian, at magpatuloy sa panalangin. - Romans 12:12",
    "Bakit ka nalulumbay, O aking kaluluwa? At bakit ka nagugulumihanan? - Psalm 42:11",
    "Tumiwala ka sa Panginoon ng buong puso at huwag kang manangan sa iyong sariling kaalaman. - Proverbs 3:5-6",
    "Hindi kita iiwan o pababayaan. - Hebrews 13:5",
    "Ang iyong salita ay nagbibigay sa akin ng buhay sa aking kapighatian. - Psalm 119:50",
    "Ang kapayapaang ibinibigay ko sa inyo ay hindi gaya ng ibinibigay ng mundo. - John 14:27",
    "Ang Panginoon ay isang matibay na kanlungan para sa mga napipighati. - Psalm 9:9",
    "Magpakatatag kayo at magpalakas ng loob sa isa't isa. - 1 Thessalonians 5:11",
    "Isaalang-alang ninyo ang lahat ng pagsubok bilang kagalakan. - James 1:2-3",
    "Ang mga naghasik ng luha ay mag-aani ng kagalakan. - Psalm 126:5"
];

const sendButton = document.getElementById('sendButton');

function checkSpelling() {
    const userWord = userInput.value.trim().toLowerCase();

    if (userWord === targetWord) {
        // Add success styling
        userInput.classList.add('correct');
        sendButton.disabled = true;
        sendButton.textContent = 'Correct!';

        // Fade out game, fade in video
        setTimeout(() => {
            gameContainer.classList.add('fade-out');
            videoContainer.classList.add('show');

            // Start automatic Bible verse rotation
            startBibleVerseRotation();
            
            // Start background music if not already playing
            startBackgroundMusic();
            
            // Fade background music when video starts
            fadeBackgroundMusic();

            // Select and load random video
            const randomVideoSource = videoSources[Math.floor(Math.random() * videoSources.length)];
            video.src = randomVideoSource;
            video.load(); // Reload the video with new source

            // Set up and play video with sound
            video.currentTime = 0;
            video.volume = 1.0; // Full volume
            
            // Add event listeners for background music control
            video.addEventListener('play', () => {
                fadeBackgroundMusic();
            });
            
            video.addEventListener('pause', () => {
                restoreBackgroundMusic();
            });
            
            video.addEventListener('ended', () => {
                restoreBackgroundMusic();
            });
            
            // Try to play with sound first
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Video autoplay with sound failed, trying muted:', error);
                    // If autoplay with sound fails, try muted
                    video.muted = true;
                    return video.play();
                }).then(() => {
                    // If muted autoplay works, try to unmute after a delay
                    if (video.muted) {
                        setTimeout(() => {
                            video.muted = false;
                        }, 500);
                    }
                }).catch(error => {
                    console.log('Video autoplay completely failed:', error);
                });
            }
        }, 600);
    } else {
        // Show incorrect feedback
        userInput.classList.add('incorrect');
        sendButton.textContent = 'Try Again';
        setTimeout(() => {
            userInput.classList.remove('incorrect');
            sendButton.textContent = 'Send';
        }, 1000);
    }
}

// Send button click event
sendButton.addEventListener('click', checkSpelling);

// Check on Enter key
userInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkSpelling();
    }
});

// Reset button text when typing
userInput.addEventListener('input', function() {
    sendButton.textContent = 'Send';
    sendButton.disabled = false;
    userInput.classList.remove('correct', 'incorrect');
});

// Rating System Variables
let currentRating = 0;
const adminCredentials = {
    id: "admin123",
    password: "secure456"
};

// Store ratings in localStorage
function saveRating(rating, message, senderName) {
    const ratings = JSON.parse(localStorage.getItem('websiteRatings') || '[]');
    const newRating = {
        id: Date.now(),
        rating: rating,
        message: message,
        sender: senderName,
        timestamp: new Date().toLocaleString()
    };
    ratings.push(newRating);
    localStorage.setItem('websiteRatings', JSON.stringify(ratings));
}

// Rating System Functions
function openRatingModal() {
    document.getElementById('ratingModal').classList.add('show');
}

function closeRatingModal() {
    document.getElementById('ratingModal').classList.remove('show');
    resetRatingForm();
}

function resetRatingForm() {
    currentRating = 0;
    document.querySelectorAll('.star').forEach(star => star.classList.remove('active'));
    document.getElementById('ratingMessage').value = '';
    document.getElementById('senderName').value = '';
}

function setRating(rating) {
    currentRating = rating;
    document.querySelectorAll('.star').forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function submitRating() {
    const message = document.getElementById('ratingMessage').value.trim();
    const senderName = document.getElementById('senderName').value.trim();
    
    if (!senderName) {
        alert('Please enter your name');
        return;
    }
    
    if (currentRating === 0) {
        alert('Please select a rating');
        return;
    }
    
    if (!message) {
        alert('Please enter a message');
        return;
    }
    
    saveRating(currentRating, message, senderName);
    alert('Thank you for your rating!');
    closeRatingModal();
}

// Store heart reactions in localStorage
function saveHeartReaction(ratingId, userId) {
    const reactions = JSON.parse(localStorage.getItem('ratingReactions') || '{}');
    if (!reactions[ratingId]) {
        reactions[ratingId] = [];
    }
    
    // Check if user already reacted
    const existingReaction = reactions[ratingId].find(r => r.userId === userId);
    if (!existingReaction) {
        reactions[ratingId].push({
            userId: userId,
            timestamp: new Date().toLocaleString()
        });
        localStorage.setItem('ratingReactions', JSON.stringify(reactions));
        return true; // New reaction added
    }
    return false; // User already reacted
}

function removeHeartReaction(ratingId, userId) {
    const reactions = JSON.parse(localStorage.getItem('ratingReactions') || '{}');
    if (reactions[ratingId]) {
        reactions[ratingId] = reactions[ratingId].filter(r => r.userId !== userId);
        localStorage.setItem('ratingReactions', JSON.stringify(reactions));
        return true;
    }
    return false;
}

function getReactionCount(ratingId) {
    const reactions = JSON.parse(localStorage.getItem('ratingReactions') || '{}');
    return reactions[ratingId] ? reactions[ratingId].length : 0;
}

function hasUserReacted(ratingId, userId) {
    const reactions = JSON.parse(localStorage.getItem('ratingReactions') || '{}');
    return reactions[ratingId] ? reactions[ratingId].some(r => r.userId === userId) : false;
}

// Generate or get user ID for reactions
function getUserId() {
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('userId', userId);
    }
    return userId;
}

// Bible verse rotation functionality
let verseRotationInterval;
let currentVerseIndex = 0;

function startBibleVerseRotation() {
    const bibleVerseElement = document.getElementById('bibleVerse');
    
    // Set initial verse
    currentVerseIndex = Math.floor(Math.random() * bibleVerses.length);
    bibleVerseElement.textContent = bibleVerses[currentVerseIndex];
    
    // Start rotation
    verseRotationInterval = setInterval(() => {
        // Add fade out animation
        bibleVerseElement.classList.add('verse-fade-out');
        
        setTimeout(() => {
            // Change to next random verse
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * bibleVerses.length);
            } while (newIndex === currentVerseIndex && bibleVerses.length > 1);
            
            currentVerseIndex = newIndex;
            bibleVerseElement.textContent = bibleVerses[currentVerseIndex];
            
            // Add fade in animation
            bibleVerseElement.classList.remove('verse-fade-out');
            bibleVerseElement.classList.add('verse-fade-in');
            
            setTimeout(() => {
                bibleVerseElement.classList.remove('verse-fade-in');
            }, 500);
        }, 250);
    }, 5000);
}

function stopBibleVerseRotation() {
    if (verseRotationInterval) {
        clearInterval(verseRotationInterval);
        verseRotationInterval = null;
    }
}

// Dashboard Functions
function openDashboard() {
    const ratings = JSON.parse(localStorage.getItem('websiteRatings') || '[]');
    const ratingsContainer = document.getElementById('ratingsContainer');
    const currentUserId = getUserId();
    
    if (ratings.length === 0) {
        ratingsContainer.innerHTML = '<p class="no-ratings">No ratings yet</p>';
    } else {
        ratingsContainer.innerHTML = ratings.map(rating => {
            const reactionCount = getReactionCount(rating.id);
            const hasReacted = hasUserReacted(rating.id, currentUserId);
            
            return `
                <div class="rating-card">
                    <div class="rating-header">
                        <div class="rating-stars">
                            ${'★'.repeat(rating.rating)}${'☆'.repeat(5 - rating.rating)}
                        </div>
                        <div class="rating-date">${rating.timestamp}</div>
                    </div>
                    <div class="rating-sender">From: ${rating.sender}</div>
                    <div class="rating-message">${rating.message}</div>
                    
                    <div class="heart-reaction-section">
                        <div class="heart-container">
                            <button onclick="toggleHeartReaction(${rating.id})" 
                                    class="heart-btn ${hasReacted ? 'liked' : ''}" 
                                    id="heartBtn_${rating.id}">
                                <span class="heart-icon">❤️</span>
                                <span class="heart-count" id="heartCount_${rating.id}">${reactionCount}</span>
                            </button>
                            <div class="reaction-text">
                                ${reactionCount === 0 ? 'Be the first to love this!' : 
                                  reactionCount === 1 ? '1 person loves this' : 
                                  `${reactionCount} people love this`}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    document.getElementById('dashboard').classList.add('show');
}

function closeDashboard() {
    document.getElementById('dashboard').classList.remove('show');
}

function toggleHeartReaction(ratingId) {
    const currentUserId = getUserId();
    const heartBtn = document.getElementById(`heartBtn_${ratingId}`);
    const heartCount = document.getElementById(`heartCount_${ratingId}`);
    
    if (hasUserReacted(ratingId, currentUserId)) {
        // Remove reaction
        removeHeartReaction(ratingId, currentUserId);
        heartBtn.classList.remove('liked');
        
        // Add animation for unlike
        heartBtn.classList.add('unliked');
        setTimeout(() => heartBtn.classList.remove('unliked'), 300);
    } else {
        // Add reaction
        saveHeartReaction(ratingId, currentUserId);
        heartBtn.classList.add('liked');
        
        // Add animation for like
        heartBtn.classList.add('pulse');
        setTimeout(() => heartBtn.classList.remove('pulse'), 600);
    }
    
    // Update count and text
    const newCount = getReactionCount(ratingId);
    heartCount.textContent = newCount;
    
    // Update reaction text
    const reactionText = heartBtn.parentElement.querySelector('.reaction-text');
    reactionText.textContent = newCount === 0 ? 'Be the first to love this!' : 
                              newCount === 1 ? '1 person loves this' : 
                              `${newCount} people love this`;
}

function selectNewRandomWord() {
    currentWordIndex = Math.floor(Math.random() * spellWords.length);
    targetWord = spellWords[currentWordIndex];
    document.querySelector('.word-display').textContent = targetWord;
    userInput.value = '';
    userInput.classList.remove('correct', 'incorrect');
    sendButton.disabled = false;
    sendButton.textContent = 'Send';
    userInput.focus();
}

function resetGame() {
    gameContainer.classList.remove('fade-out');
    videoContainer.classList.remove('show');
    videoContainer.classList.add('hidden');
    stopBibleVerseRotation();
    restoreBackgroundMusic();
    selectNewRandomWord();
}

// Focus input on load
document.addEventListener('DOMContentLoaded', function() {
    // Set initial random word
    document.querySelector('.word-display').textContent = targetWord;
    userInput.focus();
    
    // Initialize background music (will start when user completes spelling)
    initializeBackgroundMusic();
    
    // Add event listeners for rating system
    document.getElementById('rateButton').addEventListener('click', openRatingModal);
    document.getElementById('dashboardButton').addEventListener('click', openDashboard);
    
    // Add click outside to close modals
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            if (e.target.id === 'ratingModal') closeRatingModal();
            if (e.target.id === 'dashboard') closeDashboard();
        }
    });
});