// Browser compatibility and device detection
(function() {
    'use strict';
    
    // Feature detection
    const features = {
        touch: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
        webAudio: !!(window.AudioContext || window.webkitAudioContext),
        webGL: !!window.WebGLRenderingContext,
        localStorage: !!window.localStorage,
        serviceWorker: 'serviceWorker' in navigator,
        push: 'PushManager' in window,
        notifications: 'Notification' in window
    };
    
    // Browser detection
    const browsers = {
        ie: /MSIE|Trident/.test(navigator.userAgent),
        firefox: /Firefox/.test(navigator.userAgent),
        chrome: /Chrome/.test(navigator.userAgent) && !/Edg/.test(navigator.userAgent),
        edge: /Edg/.test(navigator.userAgent),
        safari: /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent),
        mobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/.test(navigator.userAgent)
    };
    
    // Add classes to HTML for CSS targeting
    const html = document.documentElement;
    Object.keys(features).forEach(feature => {
        if (features[feature]) {
            html.classList.add(`has-${feature}`);
        } else {
            html.classList.add(`no-${feature}`);
        }
    });
    
    Object.keys(browsers).forEach(browser => {
        if (browsers[browser]) {
            html.classList.add(browser);
        }
    });
    
    // Device-specific optimizations
    if (browsers.mobile) {
        html.classList.add('mobile-device');
        
        // Optimize for mobile
        if (features.touch) {
            html.classList.add('touch-enabled');
            
            // Add touch-specific event handling
            document.addEventListener('touchstart', function() {}, { passive: true });
            document.addEventListener('touchmove', function() {}, { passive: true });
        }
    }
    
    // Performance optimizations
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback = requestIdleCallback;
    } else {
        // Fallback for browsers without requestIdleCallback
        window.requestIdleCallback = function(callback) {
            const start = Date.now();
            return setTimeout(function() {
                callback({
                    didTimeout: false,
                    timeRemaining: function() {
                        return Math.max(0, 50 - (Date.now() - start));
                    }
                });
            }, 1);
        };
    }
    
    // Console logging for debugging
    console.log('Browser Info:', {
        userAgent: navigator.userAgent,
        features: features,
        browsers: browsers,
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        }
    });
})();

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
            this.themeIcon.textContent = '🪭';
        } else {
            this.body.classList.remove('dark-theme');
            this.themeIcon.textContent = '🪭';
        }
    }
    
    saveTheme() {
        localStorage.setItem('theme', this.currentTheme);
    }
    
    animateToggle() {
        // Add press effect to the button
        this.themeToggle.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            this.themeToggle.style.transform = 'scale(1)';
        }, 150);
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
        this.autoPlayEnabled = true; // تفعيل التشغيل التلقائي
        this.isInitialized = false; // منع التهيئة المتعددة
        
        this.initializeElements();
        this.loadMusicFiles();
        this.attachEventListeners();
        this.setupWebAudio();
        this.setupVideoAudio();
        this.setupInteractionDetection();
        
        // تشغيل فوري بدون انتظار تفاعل المستخدم
        if (!this.isInitialized) {
            this.isInitialized = true;
            // محاولة التشغيل الفوري
            this.attemptImmediatePlay();
        }
    }
    
    attemptImmediatePlay() {
        console.log('بدء التشغيل الفوري...');
        
        // الانتظار قليلاً ثم التشغيل
        setTimeout(() => {
            const video = document.getElementById('videoAudio');
            if (video) {
                console.log('وجد عنصر الفيديو، جاري التشغيل...');
                video.volume = 0.7;
                
                // محاولة التشغيل
                video.play().then(() => {
                    console.log('✅ الأغنية تعمل بنجاح!');
                    this.isPlaying = true;
                    this.hasInteracted = true;
                    this.videoAudio = video;
                    this.startProgressTracking();
                    this.animateVisualizer(true);
                    
                    // تحديث الزر
                    if (this.playBtn) {
                        this.playBtn.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
                    }
                }).catch(e => {
                    console.log('❌ فشل التشغيل الأولي:', e);
                    
                    // محاولة مع muted
                    video.muted = true;
                    video.play().then(() => {
                        console.log('✅ الأغنية تعمل مع muted، جاري unmute...');
                        setTimeout(() => {
                            video.muted = false;
                            console.log('✅ تم unmute بنجاح');
                        }, 100);
                        
                        this.isPlaying = true;
                        this.hasInteracted = true;
                        this.videoAudio = video;
                        this.startProgressTracking();
                        this.animateVisualizer(true);
                        
                        if (this.playBtn) {
                            this.playBtn.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
                        }
                    }).catch(e2 => {
                        console.log('❌ فشل التشغيل مع muted:', e2);
                        // استخدام الصوت العادي
                        this.playRegularAudio();
                    });
                });
            } else {
                console.log('❌ لم يتم العثور على عنصر الفيديو');
                this.playRegularAudio();
            }
        }, 100);
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
                { name: "Bury The Light", artist: "Bury The Light", duration: "4:12", url: musicDirectory + "bury the light.mp3" }
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
                    <span class="item-name">Bury The Light</span>
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
        
        // إيقاف جميع الأصوات الحالية قبل التشغيل الجديد
        this.stopAllAudio();
        
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
        
        // Resume from current position if audio exists
        if (this.currentAudio && this.currentTime > 0) {
            // Resume existing audio from current position
            this.currentAudio.currentTime = this.currentTime;
            return this.currentAudio.play().then(() => {
                console.log('Resumed audio from position:', this.currentTime);
                this.isPlaying = true;
                this.startProgressTracking();
            }).catch(e => {
                console.log('Resume failed:', e);
                return this.playRegularAudio();
            });
        } else if (this.videoAudio && !this.videoAudio.paused && this.currentTime > 0) {
            // Resume video audio from current position
            this.videoAudio.currentTime = this.currentTime;
            return this.videoAudio.play().then(() => {
                console.log('Resumed video audio from position:', this.currentTime);
                this.isPlaying = true;
                this.startProgressTracking();
            }).catch(e => {
                console.log('Video audio resume failed:', e);
                return this.playRegularAudio();
            });
        } else {
            // Start new playback
            return this.playRegularAudio();
        }
        
        this.hasInteracted = true;
    }
    
    stopAllAudio() {
        console.log('إيقاف جميع الأصوات الحالية...');
        
        // إيقاف الصوت العادي
        if (this.currentAudio) {
            try {
                this.currentAudio.pause();
                this.currentAudio.currentTime = 0;
                this.currentAudio.src = '';
                this.currentAudio = null;
                console.log('تم إيقاف الصوت العادي');
            } catch (e) {
                console.log('خطأ في إيقاف الصوت العادي:', e);
            }
        }
        
        // إيقاف صوت الفيديو
        if (this.videoAudio) {
            try {
                this.videoAudio.pause();
                this.videoAudio.currentTime = 0;
                console.log('تم إيقاف صوت الفيديو');
            } catch (e) {
                console.log('خطأ في إيقاف صوت الفيديو:', e);
            }
        }
        
        // إيقاف تتبع التقدم
        this.stopProgressTracking();
        
        // إيقاف المؤثرات البصرية
        this.animateVisualizer(false);
        
        // تحديث حالة التشغيل
        this.isPlaying = false;
        this.currentTime = 0;
        
        // تحديث زر التشغيل
        if (this.playBtn) {
            this.playBtn.innerHTML = `
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            `;
        }
        
        // تحديث مؤشر التشغيل المباشر
        if (this.liveDot) {
            this.liveDot.style.animationPlayState = 'paused';
        }
        
        console.log('تم إيقاف جميع الأصوات بنجاح');
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
        
        this.stopProgressTracking();
        this.animateVisualizer(false);
        
        // إيقاف جميع الأصوات مع الحفاظ على الموضع
        if (this.currentAudio && !this.currentAudio.paused) {
            this.currentAudio.pause();
            console.log('Paused audio at position:', this.currentTime);
        }
        
        if (this.videoAudio && !this.videoAudio.paused) {
            this.videoAudio.pause();
            console.log('Paused video audio at position:', this.currentTime);
        }
    }
    
    playRegularAudio() {
        return new Promise((resolve, reject) => {
            try {
                // إيقاف جميع الأصوات الحالية أولاً
                this.stopAllAudio();
                
                // If we have existing audio and just want to resume
                if (this.currentAudio && this.currentTime > 0 && this.currentTime < this.duration) {
                    console.log('Resuming existing audio from position:', this.currentTime);
                    this.currentAudio.currentTime = this.currentTime;
                    this.currentAudio.play().then(() => {
                        this.isPlaying = true;
                        if (this.playBtn) {
                            this.playBtn.innerHTML = `
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                                </svg>
                            `;
                        }
                        this.startProgressTracking();
                        resolve();
                    }).catch(e => {
                        console.log('Resume failed:', e);
                        reject(e);
                    });
                    return;
                }
                
                // Create new audio only if needed
                const audio = new Audio('media/music/bury the light.mp3');
                audio.volume = 0.7;
                
                audio.addEventListener('loadedmetadata', () => {
                    this.duration = audio.duration;
                    this.totalTimeEl.textContent = this.formatTime(audio.duration);
                });
                
                audio.addEventListener('timeupdate', () => {
                    if (this.isPlaying && this.currentAudio === audio) {
                        this.currentTime = audio.currentTime;
                        this.updateProgress();
                    }
                });
                
                audio.addEventListener('ended', () => {
                    console.log('Track ended, replaying same track');
                    // Reset to beginning and replay
                    this.currentTime = 0;
                    this.updateProgress();
                    audio.currentTime = 0;
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
                
                // Set initial position if we have one
                if (this.currentTime > 0) {
                    audio.currentTime = this.currentTime;
                }
                
                audio.play().then(() => {
                    console.log('Track playing successfully from position:', this.currentTime);
                    this.currentAudio = audio;
                    this.isPlaying = true;
                    if (this.playBtn) {
                        this.playBtn.innerHTML = `
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                            </svg>
                        `;
                    }
                    this.startProgressTracking();
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
            this.stopProgressTracking();
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
        const newTime = percent * this.duration;
        
        this.currentTime = newTime;
        this.updateProgress();
        
        if (this.currentAudio) {
            this.currentAudio.currentTime = newTime;
        } else if (this.videoAudio) {
            this.videoAudio.currentTime = newTime;
        }
    }
    
    stopProgressSimulation() {
        this.stopProgressTracking();
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
    
    startProgressTracking() {
        this.stopProgressTracking();
        
        // التحقق من وجود عنصر صوت نشط
        const audioElement = this.currentAudio || this.videoAudio;
        if (!audioElement) {
            console.log('❌ لا يوجد عنصر صوت نشط');
            return;
        }
        
        console.log('✅ بدء تتبع التقدم للعنصر:', audioElement);
        
        // تحديث المدة إذا كانت غير معروفة
        if (audioElement.duration && !this.duration) {
            this.duration = audioElement.duration;
            this.totalTimeEl.textContent = this.formatTime(audioElement.duration);
        }
        
        this.progressInterval = setInterval(() => {
            if (this.isPlaying && audioElement) {
                // التحقق من أن الصوت لا يزال يعمل
                if (audioElement.paused) {
                    console.log('⚠️ الصوت متوقف، جاري إعادة التشغيل...');
                    audioElement.play().catch(e => {
                        console.log('فشل إعادة التشغيل:', e);
                    });
                }
                
                this.currentTime = audioElement.currentTime;
                this.updateProgress();
                
                // تحديث المدة إذا تغيرت
                if (audioElement.duration && this.duration !== audioElement.duration) {
                    this.duration = audioElement.duration;
                    this.totalTimeEl.textContent = this.formatTime(audioElement.duration);
                }
            }
        }, 100);
    }
    
    stopProgressTracking() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
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
                    // Reset to beginning and replay
                    this.currentTime = 0;
                    this.updateProgress();
                    audio.currentTime = 0;
                    audio.play();
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
            
            // تحقق دوري للتأكد من أن الأغنية تعمل
            const checkAudioStatus = () => {
                if (this.isPlaying && this.videoAudio && this.videoAudio.paused) {
                    console.log('⚠️ الأغنية متوقفة، جاري إعادة التشغيل...');
                    this.videoAudio.play().catch(e => {
                        console.log('فشل إعادة التشغيل:', e);
                    });
                }
            };
            
            // تشغيل فوري عند تحميل الصفحة
            const attemptPlay = () => {
                this.videoAudio.play().then(() => {
                    console.log('✅ الأغنية تعمل الآن!');
                    this.isPlaying = true;
                    this.hasInteracted = true;
                    this.startProgressTracking();
                    this.animateVisualizer(true);
                    if (this.playBtn) {
                        this.playBtn.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
                    }
                }).catch(e => {
                    console.log('❌ محاولة مع muted:', e);
                    this.videoAudio.muted = true;
                    this.videoAudio.play().then(() => {
                        setTimeout(() => { this.videoAudio.muted = false; }, 100);
                        this.isPlaying = true;
                        this.hasInteracted = true;
                        this.startProgressTracking();
                        this.animateVisualizer(true);
                    }).catch(() => {
                        this.playRegularAudio();
                    });
                });
            };
            
            // محاولات متعددة
            attemptPlay();
            setTimeout(() => !this.isPlaying && attemptPlay(), 500);
            setTimeout(() => !this.isPlaying && attemptPlay(), 1000);
            
            // تحقق كل 5 ثواني
            setInterval(checkAudioStatus, 5000);
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
                console.log('تم اكتشاف تفاعل المستخدم - تفعيل التشغيل التلقائي');
                
                if (this.audioContext && this.audioContext.state === 'suspended') {
                    this.audioContext.resume().then(() => {
                        console.log('تم استئناف سياق الصوت عند التفاعل');
                        if (!this.isPlaying) {
                            this.play();
                        }
                    }).catch(e => {
                        console.log('فشل استئناف السياق:', e);
                        if (!this.isPlaying) {
                            this.play();
                        }
                    });
                } else if (!this.isPlaying) {
                    setTimeout(() => {
                        this.play();
                        console.log('تشغيل تلقائي بعد تفاعل المستخدم');
                    }, 500);
                }
            }
        };
        
        document.addEventListener('click', enableAutoplay, { once: true });
        document.addEventListener('keydown', enableAutoplay, { once: true });
        document.addEventListener('touchstart', enableAutoplay, { once: true });
        document.addEventListener('mousedown', enableAutoplay, { once: true });
        
        console.log('تم إعداد اكتشاف التفاعل - التشغيل التلقائي مفعّل');
    }
}

// Initialize neon music player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const neonPlayer = new NeonMusicPlayer();
    
    console.log('Music player ready - user must click play to start');
});