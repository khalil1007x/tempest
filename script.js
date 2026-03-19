// Active navigation state management
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');

// Function to update active nav link
function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Listen for scroll events
window.addEventListener('scroll', updateActiveNav);

// Mobile menu toggle functionality
const menuToggle = document.getElementById('menuToggle');
const navLinksContainer = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navLinksContainer.contains(e.target)) {
        navLinksContainer.classList.remove('active');
    }
});

// Founders Carousel Functionality
const founders = [
    { name: "GILGAMESH", role: "CEO & FOUNDER" },
    { name: "GAARA", role: "CREATIVE DIRECTOR" },
    { name: "KIM DOKJA", role: "CTO & TECH LEAD" },
    { name: "NAGI", role: "MARKETING HEAD" },
    { name: "NAGUMO", role: "OPERATIONS DIRECTOR" },
    { name: "SHADOW", role: "DATA SCIENTIST" }
];

const foundersCards = document.querySelectorAll(".founders-card");
const foundersDots = document.querySelectorAll(".founders-dot");
const foundersName = document.querySelector(".founders-name");
const foundersRole = document.querySelector(".founders-role");
const leftBtn = document.querySelector(".founders-left");
const rightBtn = document.querySelector(".founders-right");

let foundersIndex = 0;
let foundersAnimating = false;

function updateFoundersCarousel(newIndex) {
    if (foundersAnimating) return;
    foundersAnimating = true;

    foundersIndex = (newIndex + foundersCards.length) % foundersCards.length;

    foundersCards.forEach((card, i) => {
        const offset = (i - foundersIndex + foundersCards.length) % foundersCards.length;
        card.classList.remove("center", "left-1", "left-2", "right-1", "right-2", "hidden");

        if (offset === 0) card.classList.add("center");
        else if (offset === 1) card.classList.add("right-1");
        else if (offset === 2) card.classList.add("right-2");
        else if (offset === foundersCards.length - 1) card.classList.add("left-1");
        else if (offset === foundersCards.length - 2) card.classList.add("left-2");
        else card.classList.add("hidden");
    });

    foundersDots.forEach((dot, i) => {
        dot.classList.toggle("active", i === foundersIndex);
    });

    foundersName.style.opacity = "0";
    foundersRole.style.opacity = "0";

    setTimeout(() => {
        foundersName.textContent = founders[foundersIndex].name;
        foundersRole.textContent = founders[foundersIndex].role;
        foundersName.style.opacity = "1";
        foundersRole.style.opacity = "1";
    }, 300);

    setTimeout(() => {
        foundersAnimating = false;
    }, 800);
}

// ========================================
//   AUTO-ROTATE CAROUSEL FUNCTIONALITY
// ========================================

// متغير للتحكم في التمرير التلقائي
let autoRotateInterval;
const autoRotateDelay = 5000; // 5 ثواني بين كل بطاقة

// دالة التمرير التلقائي
function startAutoRotate() {
    autoRotateInterval = setInterval(() => {
        updateFoundersCarousel(foundersIndex + 1);
    }, autoRotateDelay);
}

// دالة إيقاف التمرير التلقائي
function stopAutoRotate() {
    clearInterval(autoRotateInterval);
}

// Mobile-specific auto-rotate with touch support
function initMobileAutoRotate() {
    let isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Slower 8-second rotation on mobile for better UX
        autoRotateInterval = setInterval(() => {
            updateFoundersCarousel(foundersIndex + 1);
        }, 8000); // 8 seconds on mobile
        
        // Pause on touch for better mobile experience
        document.addEventListener('touchstart', () => {
            stopAutoRotate();
            setTimeout(initMobileAutoRotate, 8000 * 2); // Resume after 16 seconds
        });
    } else {
        startAutoRotate(); // 5 seconds on desktop
    }
}

// بدء التمرير التلقائي مع دعم الهاتف
initMobileAutoRotate();

// إيقاف التمرير التلقائي عند تفاعل المستخدم
leftBtn.addEventListener("click", () => {
    stopAutoRotate();
    updateFoundersCarousel(foundersIndex - 1);
    setTimeout(initMobileAutoRotate, 8000); // إعادة التشغيل بعد 8 ثواني على الهاتف
});

rightBtn.addEventListener("click", () => {
    stopAutoRotate();
    updateFoundersCarousel(foundersIndex + 1);
    setTimeout(initMobileAutoRotate, 8000); // إعادة التشغيل بعد 8 ثواني على الهاتف
});

foundersDots.forEach((dot, i) => dot.addEventListener("click", () => {
    stopAutoRotate();
    updateFoundersCarousel(i);
    setTimeout(initMobileAutoRotate, 8000); // إعادة التشغيل بعد 8 ثواني على الهاتف
}));

foundersCards.forEach((card, i) => card.addEventListener("click", () => {
    stopAutoRotate();
    updateFoundersCarousel(i);
    setTimeout(initMobileAutoRotate, 8000); // إعادة التشغيل بعد 8 ثواني على الهاتف
}));

// إيقاف التمرير التلقائي عند استخدام لوحة المفاتيح
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        stopAutoRotate();
        if (e.key === "ArrowLeft") updateFoundersCarousel(foundersIndex - 1);
        else if (e.key === "ArrowRight") updateFoundersCarousel(foundersIndex + 1);
        setTimeout(initMobileAutoRotate, 8000); // إعادة التشغيل بعد 8 ثواني على الهاتف
    }
});

let touchStart = 0;
let touchEnd = 0;

document.addEventListener("touchstart", (e) => {
    touchStart = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", (e) => {
    touchEnd = e.changedTouches[0].screenX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
        stopAutoRotate();
        if (diff > 0) updateFoundersCarousel(foundersIndex + 1);
        else updateFoundersCarousel(foundersIndex - 1);
        setTimeout(initMobileAutoRotate, 8000); // إعادة التشغيل بعد 8 ثواني على الهاتف
    }
});

// Initialize the static button with visual effects
const chaosButton = document.querySelector('.chaos-button');

chaosButton.addEventListener('click', function(e) {
    // Create ripple effect
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    this.appendChild(ripple);
    
    // Position ripple
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
});

// Initialize carousel
updateFoundersCarousel(0);

// ========================================
//   ANIMATED COUNTER FUNCTIONALITY
// ========================================

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
                // Add animation class
                counter.classList.add('counted');
            }
        };
        
        // Start animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Initialize counters when page loads
document.addEventListener('DOMContentLoaded', animateCounters);

// ========================================
//   VERTICAL MUSIC PLAYER FUNCTIONALITY
// ========================================

class VerticalMusicPlayer {
    constructor() {
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 225; // 3:45 in seconds
        this.tracks = [];
        this.currentTrackIndex = 0;
        this.isRepeat = false;
        this.isShuffle = false;
        this.audioContext = null;
        this.currentAudio = null;
        this.hasInteracted = false; // Track user interaction
        this.audioBuffer = null;
        this.sourceNode = null;
        this.videoAudio = null; // Video audio element
        
        this.initializeElements();
        this.loadMusicFiles();
        this.attachEventListeners();
        this.setupWebAudio();
        this.setupVideoAudio();
        this.setupInteractionDetection();
    }
    
    async loadMusicFiles() {
        try {
            // Load music files from the specified directory
            const musicDirectory = 'media/music/'; // Relative path instead of absolute
            
            // Use the actual music files found in the directory
            this.tracks = [
                { name: "the weeknd", duration: "4:12", url: musicDirectory + "the weeknd.mp3" },
                { name: "tama impala", duration: "3:45", url: musicDirectory + "tama impala.mp3" }
            ];
            
            this.updateTrackInfo();
            this.updatePlaylistDisplay();
            
            // Log the detected tracks for debugging
            console.log('Tracks loaded:', this.tracks);
            console.log(`Total tracks: ${this.tracks.length}`);
            
            // Auto-play the first track after a short delay (only if user has interacted)
            if (this.hasInteracted) {
                setTimeout(() => {
                    this.play();
                    console.log('Auto-playing first track after user interaction');
                }, 1000);
            } else {
                console.log('Waiting for user interaction before auto-playing');
                // Try immediate play anyway (might work in some browsers)
                setTimeout(() => {
                    this.play();
                    console.log('Attempting immediate auto-play');
                }, 500);
            }
            
        } catch (error) {
            console.log('Error loading music files:', error);
            // Fallback to default tracks
            this.tracks = [
                { name: "أغنية 1", duration: "4:12", url: "" },
                { name: "أغنية 2", duration: "3:45", url: "" }
            ];
            this.updateTrackInfo();
            this.updatePlaylistDisplay();
            
            // Auto-play the first track after a short delay (only if user has interacted)
            if (this.hasInteracted) {
                setTimeout(() => {
                    this.play();
                    console.log('Auto-playing first fallback track after user interaction');
                }, 1000);
            } else {
                console.log('Waiting for user interaction before auto-playing fallback');
                // Try immediate play anyway (might work in some browsers)
                setTimeout(() => {
                    this.play();
                    console.log('Attempting immediate auto-play for fallback');
                }, 500);
            }
        }
    }
    
    setupVideoAudio() {
        this.videoAudio = document.getElementById('videoAudio');
        if (this.videoAudio) {
            this.videoAudio.volume = 0.7;
            this.videoAudio.addEventListener('loadedmetadata', () => {
                console.log('Video audio loaded successfully');
                this.duration = this.videoAudio.duration;
                this.totalTimeEl.textContent = this.formatTime(this.videoAudio.duration);
                
                // Try to unmute and play
                setTimeout(() => {
                    this.videoAudio.muted = false;
                    this.videoAudio.play().then(() => {
                        console.log('Video audio autoplay successful!');
                        this.isPlaying = true;
                        this.playBtn.textContent = '⏸';
                        this.animateVisualizer(true);
                        this.startProgressSimulation();
                    }).catch(e => {
                        console.log('Video audio autoplay failed:', e);
                    });
                }, 500);
            });
            
            this.videoAudio.addEventListener('error', (e) => {
                console.log('Video audio error:', e);
            });
            
            this.videoAudio.addEventListener('timeupdate', () => {
                if (this.isPlaying && !this.currentAudio) {
                    this.currentTime = this.videoAudio.currentTime;
                    this.updateProgress();
                }
            });
            
            this.videoAudio.addEventListener('ended', () => {
                console.log('Video audio ended');
                if (this.isRepeat) {
                    this.videoAudio.currentTime = 0;
                    this.videoAudio.play();
                } else {
                    this.playNext();
                }
            });
            
            console.log('Video audio setup complete');
        }
    }
    
    setupWebAudio() {
        // Use global audio context if available
        if (window.globalAudioContext) {
            this.audioContext = window.globalAudioContext;
            console.log('Using global Web Audio API context');
            
            // Try to resume context immediately
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume().then(() => {
                    console.log('Audio context resumed');
                    this.tryAutoplay();
                }).catch(e => {
                    console.log('Failed to resume context:', e);
                });
            } else {
                this.tryAutoplay();
            }
        } else {
            console.log('Web Audio API not available, falling back to regular audio');
        }
    }
    
    tryAutoplay() {
        console.log('Attempting autoplay with Web Audio API');
        // Try to play immediately
        setTimeout(() => {
            this.play();
            console.log('Autoplay attempt initiated');
        }, 100);
    }
    
    setupInteractionDetection() {
        // Detect user interaction to enable autoplay
        const enableAutoplay = () => {
            if (!this.hasInteracted) {
                this.hasInteracted = true;
                console.log('User interaction detected, autoplay enabled');
                
                // Resume audio context if suspended
                if (this.audioContext && this.audioContext.state === 'suspended') {
                    this.audioContext.resume().then(() => {
                        console.log('Audio context resumed on interaction');
                        this.play();
                    }).catch(e => {
                        console.log('Failed to resume context:', e);
                        this.play();
                    });
                } else {
                    // Try to auto-play after interaction
                    setTimeout(() => {
                        this.play();
                        console.log('Auto-playing after user interaction');
                    }, 200);
                }
            }
        };
        
        // Listen for various user interactions
        document.addEventListener('click', enableAutoplay, { once: true });
        document.addEventListener('keydown', enableAutoplay, { once: true });
        document.addEventListener('touchstart', enableAutoplay, { once: true });
        document.addEventListener('mousedown', enableAutoplay, { once: true });
        
        console.log('Interaction detection setup complete');
    }
    
    updatePlaylistDisplay() {
        const playlistItems = document.querySelector('.playlist-items-vertical');
        if (!playlistItems) {
            console.log('Playlist container not found');
            return;
        }
        
        console.log('Updating playlist with tracks:', this.tracks);
        playlistItems.innerHTML = '';
        
        this.tracks.forEach((track, index) => {
            const item = document.createElement('div');
            item.className = `playlist-item-vertical ${index === this.currentTrackIndex ? 'active' : ''}`;
            item.innerHTML = `
                <span class="item-number">${index + 1}</span>
                <div class="item-info">
                    <span class="item-name">${track.name}</span>
                </div>
                <span class="item-duration">${track.duration}</span>
            `;
            item.addEventListener('click', () => this.selectTrack(index));
            playlistItems.appendChild(item);
            console.log(`Added track ${index + 1}: ${track.name}`);
        });
        
        // Re-select playlist items
        this.playlistItems = document.querySelectorAll('.playlist-item-vertical');
        console.log(`Total playlist items: ${this.playlistItems.length}`);
    }
    
    initializeElements() {
        this.playBtn = document.querySelector('.play-vertical');
        this.prevBtn = document.querySelector('.prev-vertical');
        this.nextBtn = document.querySelector('.next-vertical');
        this.shuffleBtn = document.querySelector('.shuffle');
        this.repeatBtn = document.querySelector('.repeat');
        
        this.progressLine = document.querySelector('.progress-line');
        this.progressTrack = document.querySelector('.progress-track');
        this.currentTimeEl = document.querySelector('.current-time-vertical');
        this.totalTimeEl = document.querySelector('.total-time-vertical');
        
        this.trackName = document.querySelector('.track-name-vertical');
        
        this.vizBars = document.querySelectorAll('.viz-bar');
    }
    
    attachEventListeners() {
        this.playBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        
        this.progressTrack.addEventListener('click', (e) => this.seekTo(e));
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.isPlaying = true;
        this.playBtn.textContent = '⏸';
        this.animateVisualizer(true);
        this.startProgressSimulation();
        
        // Try video audio first (most likely to work)
        if (this.videoAudio) {
            this.videoAudio.muted = false;
            this.videoAudio.play().then(() => {
                console.log('Video audio playing successfully');
            }).catch(e => {
                console.log('Video audio play failed:', e);
                // Fallback to regular audio
                this.playRegularAudio();
            });
        } else {
            // Fallback to regular audio
            this.playRegularAudio();
        }
        
        // Mark that user has interacted
        this.hasInteracted = true;
    }
    
    pause() {
        this.isPlaying = false;
        this.playBtn.textContent = '▶';
        this.animateVisualizer(false);
        this.stopProgressSimulation();
        this.stopAudioFile();
        
        // Also pause video audio
        if (this.videoAudio && !this.videoAudio.paused) {
            this.videoAudio.pause();
        }
    }
    
    playAudioFile(url) {
        try {
            this.stopAudioFile();
            
            console.log('Attempting to play:', url);
            
            if (!url || url === "") {
                console.log('No audio URL provided, using simulation only');
                return;
            }
            
            // Create audio element with Web Audio API support
            const audio = new Audio(url);
            this.currentAudio = audio;
            
            // Connect to Web Audio API if available
            if (this.audioContext) {
                const source = this.audioContext.createMediaElementSource(audio);
                source.connect(this.audioContext.destination);
                console.log('Connected to Web Audio API');
            }
            
            // Set audio properties for better compatibility
            audio.preload = 'auto';
            audio.crossOrigin = 'anonymous';
            
            audio.addEventListener('loadedmetadata', () => {
                this.duration = audio.duration;
                this.totalTimeEl.textContent = this.formatTime(audio.duration);
                console.log('Audio metadata loaded, duration:', audio.duration);
            });
            
            audio.addEventListener('timeupdate', () => {
                this.currentTime = audio.currentTime;
                this.updateProgress();
            });
            
            audio.addEventListener('ended', () => {
                console.log('Audio ended');
                if (this.isRepeat) {
                    audio.currentTime = 0;
                    audio.play().catch(e => console.log('Repeat play failed:', e));
                } else {
                    this.playNext();
                }
            });
            
            audio.addEventListener('error', (e) => {
                console.log('Audio error:', e);
                console.log('Audio error details:', audio.error);
                console.log('Audio error code:', audio.error ? audio.error.code : 'unknown');
                // Fall back to simulation if audio fails
                this.currentAudio = null;
            });
            
            audio.addEventListener('canplay', () => {
                console.log('Audio can play');
            });
            
            audio.addEventListener('loadstart', () => {
                console.log('Audio loading started');
            });
            
            // Try to play the audio with Web Audio API context
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume().then(() => {
                    console.log('Audio context resumed, playing audio');
                    return audio.play();
                }).catch(error => {
                    console.log('Failed to resume context:', error);
                    return audio.play();
                });
            } else {
                const playPromise = audio.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log('Audio playing successfully');
                    }).catch(error => {
                        console.log('Audio play failed:', error);
                        console.log('Play error details:', error.message);
                        // Fall back to simulation
                        this.currentAudio = null;
                    });
                }
            }
            
        } catch (error) {
            console.log('Error loading audio file:', error);
            this.currentAudio = null;
        }
    }
    
    stopAudioFile() {
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }
    }
    
    playPrevious() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
        this.loadTrack();
    }
    
    playNext() {
        if (this.isShuffle) {
            this.currentTrackIndex = Math.floor(Math.random() * this.tracks.length);
        } else {
            this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        }
        this.loadTrack();
    }
    
    selectTrack(index) {
        this.currentTrackIndex = index;
        this.loadTrack();
    }
    
    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.shuffleBtn.style.opacity = this.isShuffle ? '1' : '0.5';
        this.shuffleBtn.style.color = this.isShuffle ? '#666' : '#999';
        console.log('Shuffle:', this.isShuffle ? 'ON' : 'OFF');
    }
    
    toggleRepeat() {
        this.isRepeat = !this.isRepeat;
        this.repeatBtn.style.opacity = this.isRepeat ? '1' : '0.5';
        this.repeatBtn.style.color = this.isRepeat ? '#666' : '#999';
        console.log('Repeat:', this.isRepeat ? 'ON' : 'OFF');
    }
    
    loadTrack() {
        this.currentTime = 0;
        this.stopAudioFile();
        this.updateTrackInfo();
        this.updateProgress();
        this.updatePlaylistActive();
        
        if (this.isPlaying) {
            this.stopProgressSimulation();
            this.startProgressSimulation();
            
            // Always play new track
            const currentTrack = this.tracks[this.currentTrackIndex];
            this.playAudioFile(currentTrack.url);
        }
    }
    
    updateTrackInfo() {
        const track = this.tracks[this.currentTrackIndex];
        console.log('Updating track info:', track);
        
        if (this.trackName) {
            this.trackName.textContent = track.name;
            console.log('Track name updated to:', track.name);
        } else {
            console.log('Track name element not found');
        }
        
        if (this.totalTimeEl) {
            this.totalTimeEl.textContent = track.duration;
            console.log('Track duration updated to:', track.duration);
        } else {
            console.log('Total time element not found');
        }
    }
    
    updatePlaylistActive() {
        this.playlistItems.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentTrackIndex);
        });
    }
    
    seekTo(event) {
        const rect = this.progressTrack.getBoundingClientRect();
        const percent = (event.clientX - rect.left) / rect.width;
        this.currentTime = percent * this.duration;
        this.updateProgress();
        
        // Seek audio if playing
        if (this.currentAudio) {
            this.currentAudio.currentTime = this.currentTime;
        }
    }
    
    stopProgressSimulation() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
    }
    
    updateProgress() {
        const percent = (this.currentTime / this.duration) * 100;
        this.progressLine.style.width = percent + '%';
        this.currentTimeEl.textContent = this.formatTime(this.currentTime);
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    animateVisualizer(playing) {
        this.vizBars.forEach(bar => {
            if (playing) {
                bar.style.animationPlayState = 'running';
            } else {
                bar.style.animationPlayState = 'paused';
            }
        });
    }
    
    startProgressSimulation() {
        this.progressInterval = setInterval(() => {
            if (this.currentTime >= this.duration) {
                if (this.isRepeat) {
                    this.currentTime = 0;
                } else {
                    this.playNext();
                    return;
                }
            }
            
            // Only simulate if no real audio is playing
            if (!this.currentAudio) {
                this.currentTime += 0.1;
                this.updateProgress();
            }
        }, 100);
    }
    
    stopProgressSimulation() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
    }
}

// Initialize vertical music player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const verticalPlayer = new VerticalMusicPlayer();
    
    // Try immediate play with Web Audio API
    setTimeout(() => {
        console.log('Attempting immediate play with Web Audio API');
        if (window.globalAudioContext && window.globalAudioContext.state === 'suspended') {
            window.globalAudioContext.resume().then(() => {
                console.log('Global context resumed, attempting play');
                verticalPlayer.play();
            }).catch(e => {
                console.log('Failed to resume global context:', e);
                verticalPlayer.play();
            });
        } else {
            verticalPlayer.play();
        }
    }, 100);
});