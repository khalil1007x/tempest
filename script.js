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

// Throttled scroll handler for better performance
let scrollTimer;
window.addEventListener('scroll', () => {
    if (scrollTimer) {
        clearTimeout(scrollTimer);
    }
    scrollTimer = setTimeout(updateActiveNav, 16); // ~60fps
});

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

// Optimized counter animation
const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 1500; // Shorter duration
    const start = performance.now();
    
    const updateCounter = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };
    
    requestAnimationFrame(updateCounter);
};

// Intersection Observer for performance
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number[data-target]');
            statNumbers.forEach(number => {
                if (!number.classList.contains('counted')) {
                    number.classList.add('counted');
                    animateCounter(number);
                }
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections with stats
const sectionsWithStats = document.querySelectorAll('#about');
sectionsWithStats.forEach(section => {
    observer.observe(section);
});

// Simple button effects
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
//   THEME TOGGLE FUNCTIONALITY
// ========================================

class ThemeToggle {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.querySelector('.theme-icon');
        this.body = document.body;
        
        // Load saved theme or default to red (no dark-theme class)
        this.currentTheme = localStorage.getItem('theme') || 'red';
        this.applyTheme();
        
        this.attachEventListeners();
    }
    
    attachEventListeners() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Add keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 't' && e.ctrlKey) {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'red' ? 'light' : 'red';
        this.applyTheme();
        this.saveTheme();
        this.animateToggle();
    }
    
    applyTheme() {
        if (this.currentTheme === 'light') {
            this.body.classList.add('dark-theme');
            this.themeIcon.textContent = '🌙';
        } else {
            this.body.classList.remove('dark-theme');
            this.themeIcon.textContent = '☀️';
        }
    }
    
    saveTheme() {
        localStorage.setItem('theme', this.currentTheme);
    }
    
    animateToggle() {
        // Add rotation animation to the button
        this.themeToggle.style.transform = 'scale(0.9) rotate(180deg)';
        
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1) rotate(360deg)';
        }, 150);
        
        setTimeout(() => {
            this.themeToggle.style.transform = '';
        }, 300);
    }
}

// Initialize theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeToggle();
});

// ========================================
//   VERTICAL MUSIC PLAYER FUNCTIONALITY
// ========================================

class NeonMusicPlayer {
    constructor() {
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 225;
        this.tracks = [];
        this.currentTrackIndex = 0;
        this.isRepeat = false;
        this.isShuffle = false;
        this.audioContext = null;
        this.currentAudio = null;
        this.hasInteracted = false;
        this.videoAudio = null;
        
        this.initializeElements();
        this.loadMusicFiles();
        this.attachEventListeners();
        this.setupWebAudio();
        this.setupVideoAudio();
        this.setupInteractionDetection();
        
        // Auto-play after user interaction
        if (this.hasInteracted) {
            setTimeout(() => {
                this.play();
                console.log('Auto-playing first track after user interaction');
            }, 1000);
        } else {
            console.log('Waiting for user interaction before auto-playing');
            setTimeout(() => {
                this.play();
                console.log('Attempting immediate auto-play');
            }, 500);
        }
    }
    
    initializeElements() {
        this.playBtn = document.querySelector('.play-btn');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.shuffleBtn = document.querySelector('.shuffle-btn');
        this.repeatBtn = document.querySelector('.repeat-btn');
        
        this.progressFill = document.querySelector('.progress-fill');
        this.progressBar = document.querySelector('.progress-bar');
        this.currentTimeEl = document.querySelector('.current-time');
        this.totalTimeEl = document.querySelector('.total-time');
        
        this.trackName = document.querySelector('.track-name');
        this.artistName = document.querySelector('.artist-name');
        this.liveDot = document.querySelector('.live-dot');
        
        this.vizBars = document.querySelectorAll('.viz-bar');
        
        this.playlistItems = document.querySelector('.playlist-items');
        this.trackCount = document.querySelector('.track-count');
    }
    
    attachEventListeners() {
        this.playBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        
        this.progressBar.addEventListener('click', (e) => this.seekTo(e));
        
        // Playlist tracks will be added dynamically
    }
    
    async loadMusicFiles() {
        try {
            const musicDirectory = 'media/music/';
            
            // Load single track only
            this.tracks = [
                { name: "House of Balloons", artist: "House of Balloons", duration: "4:12", url: musicDirectory + "house of balloons.mp3" }
            ];
            
            this.updateTrackInfo();
            this.updatePlaylistDisplay();
            
            console.log('Single track loaded:', this.tracks[0]);
            
        } catch (error) {
            console.log('Error loading music file:', error);
            this.tracks = [
                { name: "Track 1", artist: "Artist", duration: "4:12", url: "" }
            ];
            this.updateTrackInfo();
            this.updatePlaylistDisplay();
        }
    }
    
    updateTrackInfo() {
        const track = this.tracks[this.currentTrackIndex];
        
        if (this.trackName) {
            this.trackName.textContent = track.name;
        }
        
        if (this.artistName) {
            this.artistName.textContent = track.artist;
        }
        
        if (this.totalTimeEl) {
            this.totalTimeEl.textContent = track.duration;
        }
    }
    
    updatePlaylistDisplay() {
        if (!this.playlistItems) return;
        
        this.playlistItems.innerHTML = '';
        
        this.tracks.forEach((track, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = `playlist-item ${index === this.currentTrackIndex ? 'active' : ''}`;
            itemEl.innerHTML = `
                <span class="item-number">${index + 1}</span>
                <div class="item-info">
                    <span class="item-name">House of Balloons</span>
                    <span class="item-duration">${track.duration}</span>
                </div>
                <span class="playing-indicator">▶</span>
            `;
            itemEl.addEventListener('click', () => this.selectTrack(index));
            this.playlistItems.appendChild(itemEl);
        });
        
        if (this.trackCount) {
            this.trackCount.textContent = `${this.tracks.length} tracks`;
        }
        
        this.playlistItemElements = document.querySelectorAll('.playlist-item');
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        if (this.isPlaying) return Promise.resolve();
        
        // Update live indicator
        if (this.liveDot) {
            this.liveDot.style.animationPlayState = 'running';
        }
        
        // Update play button
        if (this.playBtn) {
            this.playBtn.innerHTML = `
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
            `;
        }
        
        // Start visualizer
        this.animateVisualizer(true);
        
        if (this.videoAudio) {
            return this.videoAudio.play().then(() => {
                console.log('Video audio playing successfully');
                this.isPlaying = true;
                this.startProgressSimulation();
            }).catch(e => {
                console.log('Video audio play failed:', e);
                return this.playRegularAudio();
            });
        } else {
            return this.playRegularAudio();
        }
        
        this.hasInteracted = true;
    }
    
    pause() {
        this.isPlaying = false;
        
        // Update live indicator
        if (this.liveDot) {
            this.liveDot.style.animationPlayState = 'paused';
        }
        
        // Update play button
        if (this.playBtn) {
            this.playBtn.innerHTML = `
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            `;
        }
        
        this.stopProgressSimulation();
        this.stopAudioFile();
        this.animateVisualizer(false);
        
        if (this.videoAudio && !this.videoAudio.paused) {
            this.videoAudio.pause();
        }
    }
    
    playRegularAudio() {
        return new Promise((resolve, reject) => {
            try {
                // Stop current audio if playing
                if (this.currentAudio) {
                    this.currentAudio.pause();
                    this.currentAudio.src = '';
                    this.currentAudio = null;
                }
                
                // Always play the same track
                const audio = new Audio('media/music/house of balloons.mp3');
                audio.volume = 0.7;
                
                audio.addEventListener('ended', () => {
                    console.log('Track ended, replaying same track');
                    // Replay the same track
                    this.currentTime = 0;
                    this.updateProgress();
                    audio.play();
                });
                
                audio.addEventListener('error', (e) => {
                    console.error('Audio error:', e);
                    this.isPlaying = false;
                    if (this.playBtn) {
                        this.playBtn.innerHTML = `
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        `;
                    }
                });
                
                audio.play().then(() => {
                    console.log('Track playing successfully');
                    this.currentAudio = audio;
                    this.isPlaying = true;
                    if (this.playBtn) {
                        this.playBtn.innerHTML = `
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                            </svg>
                        `;
                    }
                    this.startProgressSimulation();
                    resolve();
                }).catch(e => {
                    console.log('Audio play failed:', e);
                    this.isPlaying = false;
                    if (this.playBtn) {
                        this.playBtn.innerHTML = `
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        `;
                    }
                    reject(e);
                });
                
            } catch (e) {
                console.log('Error creating audio element:', e);
                this.isPlaying = false;
                if (this.playBtn) {
                    this.playBtn.innerHTML = `
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    `;
                }
                reject(e);
            }
        });
    }
    
    playPrevious() {
        // Disabled - only one track available
        console.log('Previous track disabled - only one track available');
    }
    
    playNext() {
        // Disabled - only one track available
        console.log('Next track disabled - only one track available');
    }
    
    selectTrack(index) {
        // Disabled - only one track available
        console.log('Track selection disabled - only one track available');
    }
    
    toggleShuffle() {
        this.isShuffle = !this.isShuffle;
        this.shuffleBtn.classList.toggle('active', this.isShuffle);
        console.log('Shuffle:', this.isShuffle ? 'ON' : 'OFF');
    }
    
    toggleRepeat() {
        this.isRepeat = !this.isRepeat;
        this.repeatBtn.classList.toggle('active', this.isRepeat);
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
            this.playRegularAudio().catch(e => {
                console.error('Error loading track:', e);
                this.isPlaying = false;
                if (this.playBtn) {
                    this.playBtn.innerHTML = `
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    `;
                }
            });
        }
    }
    
    updatePlaylistActive() {
        if (this.playlistItemElements) {
            this.playlistItemElements.forEach((item, index) => {
                item.classList.toggle('active', index === this.currentTrackIndex);
            });
        }
    }
    
    seekTo(event) {
        const rect = this.progressBar.getBoundingClientRect();
        const percent = (event.clientX - rect.left) / rect.width;
        this.currentTime = percent * this.duration;
        this.updateProgress();
        
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
        if (this.progressFill) {
            this.progressFill.style.width = percent + '%';
        }
        if (this.currentTimeEl) {
            this.currentTimeEl.textContent = this.formatTime(this.currentTime);
        }
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
            
            if (!this.currentAudio) {
                this.currentTime += 0.1;
                this.updateProgress();
            }
        }, 100);
    }
    
    stopAudioFile() {
        if (this.currentAudio) {
            try {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
                this.currentAudio.src = '';
            } catch (e) {
                console.log('Error stopping audio:', e);
            }
            this.currentAudio = null;
        }
    }
    
    playAudioFile(url) {
        if (!url || url === "") return;
        
        try {
            this.stopAudioFile();
            
            const audio = new Audio(url);
            this.currentAudio = audio;
            
            if (this.audioContext) {
                const source = this.audioContext.createMediaElementSource(audio);
                source.connect(this.audioContext.destination);
            }
            
            audio.addEventListener('loadedmetadata', () => {
                this.duration = audio.duration;
                this.totalTimeEl.textContent = this.formatTime(audio.duration);
            });
            
            audio.addEventListener('timeupdate', () => {
                this.currentTime = audio.currentTime;
                this.updateProgress();
            });
            
            audio.addEventListener('ended', () => {
                if (this.isRepeat) {
                    audio.currentTime = 0;
                    audio.play();
                } else {
                    this.playNext();
                }
            });
            
            audio.addEventListener('error', (e) => {
                console.log('Audio error:', e);
                this.currentAudio = null;
            });
            
            audio.play().catch(error => {
                console.log('Audio play failed:', error);
                this.currentAudio = null;
            });
            
        } catch (error) {
            console.log('Error loading audio file:', error);
            this.currentAudio = null;
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
                
                setTimeout(() => {
                    this.videoAudio.muted = false;
                    this.videoAudio.play().then(() => {
                        console.log('Video audio autoplay successful!');
                        this.isPlaying = true;
                        if (this.liveDot) {
                            this.liveDot.style.animationPlayState = 'running';
                        }
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
        }
    }
    
    setupWebAudio() {
        if (window.globalAudioContext) {
            this.audioContext = window.globalAudioContext;
            console.log('Using global Web Audio API context');
            
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
        }
    }
    
    tryAutoplay() {
        console.log('Attempting autoplay with Web Audio API');
        setTimeout(() => {
            this.play();
            console.log('Autoplay attempt initiated');
        }, 100);
    }
    
    setupInteractionDetection() {
        const enableAutoplay = () => {
            if (!this.hasInteracted) {
                this.hasInteracted = true;
                console.log('User interaction detected, autoplay enabled');
                
                if (this.audioContext && this.audioContext.state === 'suspended') {
                    this.audioContext.resume().then(() => {
                        console.log('Audio context resumed on interaction');
                        this.play();
                    }).catch(e => {
                        console.log('Failed to resume context:', e);
                        this.play();
                    });
                } else {
                    setTimeout(() => {
                        this.play();
                        console.log('Auto-playing after user interaction');
                    }, 200);
                }
            }
        };
        
        document.addEventListener('click', enableAutoplay, { once: true });
        document.addEventListener('keydown', enableAutoplay, { once: true });
        document.addEventListener('touchstart', enableAutoplay, { once: true });
        document.addEventListener('mousedown', enableAutoplay, { once: true });
        
        console.log('Interaction detection setup complete');
    }
}

// Initialize neon music player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const neonPlayer = new NeonMusicPlayer();
    
    // Try immediate play with Web Audio API
    setTimeout(() => {
        console.log('Attempting immediate play with Web Audio API');
        if (window.globalAudioContext && window.globalAudioContext.state === 'suspended') {
            window.globalAudioContext.resume().then(() => {
                console.log('Global context resumed successfully');
                neonPlayer.play().catch(e => {
                    console.log('Play failed after context resume:', e);
                });
            }).catch(e => {
                console.log('Failed to resume global context:', e);
                neonPlayer.play().catch(e => {
                    console.log('Direct play failed:', e);
                });
            });
        } else {
            neonPlayer.play().catch(e => {
                console.log('Direct play failed:', e);
            });
        }
    }, 1000);
});