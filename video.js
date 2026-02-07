// ============================================
// VILOSTUDIOS - Background Video Management
// Separate module for video functionality
// ============================================

// Background Video Management
const videoSources = [
  'src/videos/Second Video.mp4',
  'src/videos/Main Video.mp4',
  'src/videos/Kuro Games/28_6.mp4',
  'src/videos/Kuro Games/8.mp4',
  'src/videos/Kuro Games/Changli_wuwa_230001-0120.mp4',
  'src/videos/Kuro Games/jiyan1 (1).mp4',
  'src/videos/Kuro Games/p.mp4',
  'src/videos/Kuro Games/retake_6.mp4',
  'src/videos/Kuro Games/Sc01_Sh010_V04 (3).mp4',
  'src/videos/Kuro Games/SC01_SH12_v03 (1).mp4',
  'src/videos/Kuro Games/SC01_SH37_v06 (1).mp4',
  'src/videos/Kuro Games/ww23.016_1.mp4'
];

let currentVideoIndex = 0;
let isSwitching = false;
let activeVideo = null;
let inactiveVideo = null;
let isPreloading = false;

function ensureNoLoop(video) {
  video.loop = false;
  video.removeAttribute('loop');
  // Ensure autoplay is set
  video.setAttribute('autoplay', '');
  video.autoplay = true;
  // Ensure video is muted for autoplay
  video.muted = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
}

function loadAndPlayVideo(video, src, shouldPlay = true) {
  return new Promise((resolve, reject) => {
    // Encode the src path to handle spaces and special characters
    const encodedSrc = src.split('/').map(part => encodeURIComponent(part)).join('/');
    console.log('Loading video:', src, '->', encodedSrc, 'shouldPlay:', shouldPlay);
    
    // Store handlers for cleanup
    const handlers = {
      canplay: null,
      canplaythrough: null,
      loadeddata: null,
      error: null,
      loadedmetadata: null,
      loadedstart: null
    };
    
    let resolved = false;
    let hasAttemptedPlay = false; // Prevent multiple play attempts
    
    const cleanup = () => {
      Object.keys(handlers).forEach(event => {
        if (handlers[event]) {
          video.removeEventListener(event, handlers[event]);
          handlers[event] = null;
        }
      });
    };
    
    const attemptPlay = () => {
      if (!shouldPlay) {
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve();
        }
        return;
      }
      
      // Don't prevent multiple attempts if video is actually paused and needs to resume
      if (resolved && !video.paused) {
        return; // Already playing and resolved
      }
      
      if (resolved && !hasAttemptedPlay) {
        // This is a retry after initial load, allow it
        hasAttemptedPlay = false;
      }
      
      if (!hasAttemptedPlay) {
        hasAttemptedPlay = true;
      }
      
      console.log('Attempting to play video, readyState:', video.readyState, 'paused:', video.paused, 'resolved:', resolved);
      
      // Ensure video is visible
      video.style.opacity = '1';
      video.style.zIndex = '0';
      video.style.display = 'block';
      video.style.visibility = 'visible';
      
      // Only pause if it's actually playing (to restart)
      // Otherwise just try to play
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (!resolved) {
            resolved = true;
            cleanup();
            console.log('Video playing successfully!');
            // Ensure video stays visible
            video.style.opacity = '1';
            video.style.zIndex = '0';
            resolve();
          } else {
            console.log('Video resumed successfully');
          }
        }).catch((err) => {
          console.warn('Video play promise rejected:', err);
          if (!resolved) {
            resolved = true;
            cleanup();
            // Ensure video is still visible even if play failed
            video.style.opacity = '1';
            video.style.zIndex = '0';
            resolve();
          }
        });
      } else {
        // Older browsers
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve();
        }
      }
    };
    
    const onReady = () => {
      if (resolved) return;
      ensureNoLoop(video);
      console.log('Video ready, readyState:', video.readyState);
      
      if (shouldPlay) {
        if (video.readyState >= 3) { // HAVE_FUTURE_DATA - more stable
          attemptPlay();
        } else if (video.readyState >= 2) { // HAVE_CURRENT_DATA
          attemptPlay();
        } else {
          // Wait a bit more
          setTimeout(() => {
            if (!resolved && video.readyState >= 2) {
              attemptPlay();
            }
          }, 200);
        }
      } else {
        // Just resolve if we don't need to play
        if (!resolved) {
          resolved = true;
          cleanup();
          resolve();
        }
      }
    };
    
    handlers.error = (e) => {
      if (!resolved) {
        resolved = true;
        cleanup();
        console.error('Video error:', e, 'Error code:', video.error?.code, 'Error message:', video.error?.message, 'Src:', encodedSrc);
        // Don't reject immediately, try next video
        setTimeout(() => reject(new Error(`Failed to load video: ${src}`)), 100);
      }
    };
    
    handlers.loadedstart = () => {
      console.log('Video loadstart event');
    };
    
    handlers.loadedmetadata = () => {
      console.log('Video loadedmetadata, duration:', video.duration);
      onReady();
    };
    
    handlers.loadeddata = () => {
      console.log('Video loadeddata event');
      onReady();
    };
    
    handlers.canplay = () => {
      console.log('Video canplay event');
      onReady();
    };
    
    handlers.canplaythrough = () => {
      console.log('Video canplaythrough event');
      onReady();
    };
    
    // Set up video element - clear any existing src first
    // Prevent jitter by pausing first and ensuring clean state
    video.pause();
    
    // Store if this is a new video source
    const currentSrc = video.currentSrc || (video.src || '');
    const isNewSource = !currentSrc || !currentSrc.includes(src.split('/').pop());
    
    if (isNewSource) {
      // Only reset for new sources to prevent jitter
      video.currentTime = 0;
    }
    
    ensureNoLoop(video);
    
    // Set attributes - DO NOT set autoplay to prevent double-play
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    // Remove autoplay to prevent browser from auto-playing
    video.removeAttribute('autoplay');
    video.autoplay = false;
    video.preload = 'auto';
    
    // Only clear and reload if it's a new source
    if (isNewSource) {
      // Clear old source first
      video.removeAttribute('src');
      while (video.firstChild) {
        video.removeChild(video.firstChild);
      }
      video.load();
      
      // Set new source using source element for better compatibility
      const source = document.createElement('source');
      source.src = encodedSrc;
      source.type = 'video/mp4';
      video.appendChild(source);
      
      // Also set src directly as fallback
      video.src = encodedSrc;
      
      // Force load
      video.load();
    }
    
    // Add event listeners - only if it's a new source
    if (isNewSource) {
      // Use canplaythrough as the primary trigger to avoid multiple play attempts
      let readyFired = false;
      const onReadyOnce = () => {
        if (!readyFired && shouldPlay) {
          readyFired = true;
          onReady();
        } else if (!readyFired && !shouldPlay) {
          readyFired = true;
          if (!resolved) {
            resolved = true;
            resolve();
          }
        }
      };
      
      handlers.canplaythrough = onReadyOnce;
      handlers.canplay = () => {
        // Only use canplay as fallback if canplaythrough hasn't fired
        if (!readyFired && video.readyState >= 2 && shouldPlay) {
          onReadyOnce();
        }
      };
      handlers.loadedmetadata = () => {
        console.log('Video loadedmetadata, duration:', video.duration);
      };
      handlers.loadeddata = () => {
        console.log('Video loadeddata event');
      };
      handlers.loadedstart = () => {
        console.log('Video loadstart event');
      };
      
      video.addEventListener('canplaythrough', handlers.canplaythrough, { once: true });
      video.addEventListener('canplay', handlers.canplay, { once: true });
      video.addEventListener('loadedmetadata', handlers.loadedmetadata, { once: true });
      video.addEventListener('loadeddata', handlers.loadeddata, { once: true });
      video.addEventListener('loadstart', handlers.loadedstart, { once: true });
      video.addEventListener('error', handlers.error, { once: true });
    } else {
      // If same source, just try to play immediately
      if (shouldPlay) {
        attemptPlay();
      } else {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      }
    }
    
    // Fallback timeout - try to play anyway
    setTimeout(() => {
      if (!resolved) {
        console.warn('Video timeout after 3s, readyState:', video.readyState);
        if (video.readyState >= 2) {
          onReady();
        } else if (video.error) {
          handlers.error(video.error);
        } else {
          // Try anyway - sometimes browsers don't fire events properly
          console.warn('Attempting to play video anyway');
          attemptPlay();
        }
      }
    }, 3000);
  });
}

function handleVideoEnded() {
  // Prevent multiple calls
  if (isSwitching) return;
  
  console.log('Video ended, switching to next immediately');
  
  // If only one video, just restart it
  if (videoSources.length <= 1) {
    const active = activeVideo;
    if (active) {
      active.removeEventListener('ended', handleVideoEnded);
      loadAndPlayVideo(active, videoSources[0]).then(() => {
        active.addEventListener('ended', handleVideoEnded, { once: false });
      });
    }
    return;
  }
  
  // Switch to next video immediately - no delay
  switchToNext();
}

function switchToNext() {
  if (isSwitching) return;
  
  isSwitching = true;
  currentVideoIndex = (currentVideoIndex + 1) % videoSources.length;
  const nextSrc = videoSources[currentVideoIndex];
  
  const active = activeVideo;
  const inactive = inactiveVideo;
  
  if (!active || !inactive) {
    isSwitching = false;
    return;
  }
  
  // Remove ended listener from current active video
  active.removeEventListener('ended', handleVideoEnded);
  
  console.log('Switching to next video:', nextSrc, '(preloaded:', isPreloading, ')');
  
  // Check if video is already preloaded
  const isVideoPreloaded = isPreloading && inactive.readyState >= 3;
  
  // Reset preload flag
  const wasPreloaded = isPreloading;
  isPreloading = false;
  
  if (isVideoPreloaded) {
    // Video already preloaded, transition immediately!
    console.log('Using preloaded video, transitioning instantly');
    const startTransition = () => {
      const playPromise = inactive.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Preloaded video playing, starting instant transition');
          requestAnimationFrame(() => {
            active.style.transition = 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
            inactive.style.transition = 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
            inactive.style.zIndex = '0';
            inactive.style.opacity = '0';
            requestAnimationFrame(() => {
              active.style.opacity = '0';
              inactive.style.opacity = '1';
            });
            
            setTimeout(() => {
              const temp = activeVideo;
              activeVideo = inactiveVideo;
              inactiveVideo = temp;
              const newActive = activeVideo;
              const newInactive = inactiveVideo;
              newInactive.pause();
              newInactive.currentTime = 0;
              newInactive.style.opacity = '0';
              newInactive.style.zIndex = '1';
              newInactive.style.transition = 'opacity 0s';
              newActive.style.opacity = '1';
              newActive.style.zIndex = '0';
              ensureNoLoop(newActive);
              newActive.addEventListener('ended', handleVideoEnded, { once: false });
              
              console.log('Instant transition complete');
              isSwitching = false;
            }, 1200);
          });
        }).catch((err) => {
          console.warn('Preloaded video play failed, will reload:', err);
          isPreloading = false;
          // Fallback to loading
          proceedWithLoading();
        });
      }
    };
    startTransition();
    return;
  }
  
  // If not preloaded, proceed with normal loading
  proceedWithLoading();
  
  function proceedWithLoading() {
  // Load and play the next video
  loadAndPlayVideo(inactive, nextSrc, false).then(() => {
    // Start playing the new video immediately in the background
    const startTransition = () => {
      const playPromise = inactive.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log('Next video playing, starting transition immediately');
          // Start transition as soon as video starts playing - no delay
          requestAnimationFrame(() => {
            active.style.transition = 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            inactive.style.transition = 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            inactive.style.zIndex = '0';
            inactive.style.opacity = '0';
            requestAnimationFrame(() => {
              active.style.opacity = '0';
              inactive.style.opacity = '1';
            });
            
            // Swap videos after transition completes
            setTimeout(() => {
              const temp = activeVideo;
              activeVideo = inactiveVideo;
              inactiveVideo = temp;
              const newActive = activeVideo;
              const newInactive = inactiveVideo;
              newInactive.pause();
              newInactive.currentTime = 0;
              newInactive.style.opacity = '0';
              newInactive.style.zIndex = '1';
              newInactive.style.transition = 'opacity 0s';
              newActive.style.opacity = '1';
              newActive.style.zIndex = '0';
              ensureNoLoop(newActive);
              newActive.addEventListener('ended', handleVideoEnded, { once: false });
              
              console.log('Transition complete, switched to video:', currentVideoIndex);
              isSwitching = false;
            }, 1500);
          });
        }).catch((err) => {
          console.warn('Play promise rejected, retrying:', err);
          // Retry once after a short delay
          setTimeout(() => {
            inactive.play().then(() => {
              console.log('Retry successful, starting transition');
              requestAnimationFrame(() => {
                active.style.transition = 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                inactive.style.transition = 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                inactive.style.zIndex = '0';
                inactive.style.opacity = '0';
                requestAnimationFrame(() => {
                  active.style.opacity = '0';
                  inactive.style.opacity = '1';
                });
                setTimeout(() => {
                  const temp = activeVideo;
                  activeVideo = inactiveVideo;
                  inactiveVideo = temp;
                  const newActive = activeVideo;
                  const newInactive = inactiveVideo;
                  newInactive.pause();
                  newInactive.currentTime = 0;
                  newInactive.style.opacity = '0';
                  newInactive.style.zIndex = '1';
                  newInactive.style.transition = 'opacity 0s';
                  newActive.style.opacity = '1';
                  newActive.style.zIndex = '0';
                  ensureNoLoop(newActive);
                  newActive.addEventListener('ended', handleVideoEnded, { once: false });
                  isSwitching = false;
                }, 1500);
              });
            }).catch(() => {
              console.error('Retry failed, aborting transition');
              isSwitching = false;
            });
          }, 300);
        });
      }
    };
    
    // Start transition immediately if video is ready, otherwise wait for it
    if (inactive.readyState >= 3) {
      startTransition();
    } else {
      // Wait for video to be ready
      const onReady = () => {
        console.log('Video ready, starting transition');
        startTransition();
      };
      inactive.addEventListener('canplaythrough', onReady, { once: true });
      // Also fallback timeout in case canplaythrough doesn't fire
      setTimeout(() => {
        if (inactive.readyState >= 2 && isSwitching) {
          console.log('Fallback: starting transition after timeout');
          startTransition();
        }
      }, 500);
    }
  }).catch((error) => {
    console.error('Error loading video:', error);
    // If loading fails, try to continue with current video
    active.addEventListener('ended', handleVideoEnded, { once: false });
    isSwitching = false;
  });
  }
}

function initBackgroundVideo() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackgroundVideo);
    return;
  }
  
  const video1 = document.getElementById('video1');
  const video2 = document.getElementById('video2');
  
  if (!video1 || !video2 || videoSources.length === 0) {
    console.error('Video elements or sources not found', { video1: !!video1, video2: !!video2, sources: videoSources.length });
    return;
  }
  
  activeVideo = video1;
  inactiveVideo = video2;
  
  // Ensure both videos are set up correctly
  ensureNoLoop(video1);
  ensureNoLoop(video2);
  
  // Ensure videos are muted and have autoplay attributes
  video1.muted = true;
  video2.muted = true;
  video1.setAttribute('muted', '');
  video2.setAttribute('muted', '');
  video1.setAttribute('playsinline', '');
  video2.setAttribute('playsinline', '');
  // Do NOT set autoplay to prevent double-play issues
  video1.removeAttribute('autoplay');
  video2.removeAttribute('autoplay');
  video1.autoplay = false;
  video2.autoplay = false;
  
  // Make sure videos are visible and positioned correctly
  video1.style.opacity = '1';
  video1.style.zIndex = '0';
  video1.style.display = 'block';
  video1.style.visibility = 'visible';
  video1.style.position = 'absolute';
  video1.style.top = '50%';
  video1.style.left = '50%';
  video1.style.transform = 'translate(-50%, -50%)';
  video1.style.minWidth = '100%';
  video1.style.minHeight = '100%';
  video1.style.width = 'auto';
  video1.style.height = 'auto';
  video1.style.objectFit = 'cover';
  
  video2.style.opacity = '0';
  video2.style.zIndex = '1';
  video2.style.display = 'block';
  video2.style.visibility = 'visible';
  video2.style.position = 'absolute';
  video2.style.top = '50%';
  video2.style.left = '50%';
  video2.style.transform = 'translate(-50%, -50%)';
  video2.style.minWidth = '100%';
  video2.style.minHeight = '100%';
  video2.style.width = 'auto';
  video2.style.height = 'auto';
  video2.style.objectFit = 'cover';
  
  console.log('Initializing background video with source:', videoSources[0]);
  
  loadAndPlayVideo(video1, videoSources[0], true).then(() => {
    console.log('Video loaded successfully:', videoSources[0]);
    video1.addEventListener('ended', handleVideoEnded, { once: false });
    
    // Preload next video when current video is near end (last 3 seconds)
    const preloadNextVideo = () => {
      if (!isPreloading && 
          video1 === activeVideo && 
          !isSwitching && 
          video1.duration > 0 && 
          video1.currentTime > 0 &&
          (video1.duration - video1.currentTime) <= 3 &&
          (video1.duration - video1.currentTime) > 0.1) {
        isPreloading = true;
        const nextIndex = (currentVideoIndex + 1) % videoSources.length;
        const nextSrc = videoSources[nextIndex];
        console.log('Preloading next video:', nextSrc);
        // Preload next video in inactive video element
        loadAndPlayVideo(inactiveVideo, nextSrc, false).then(() => {
          console.log('Next video preloaded and ready');
        }).catch(() => {
          console.warn('Failed to preload next video');
          isPreloading = false;
        });
      } else if (!isPreloading && 
                 video2 === activeVideo && 
                 !isSwitching && 
                 video2.duration > 0 && 
                 video2.currentTime > 0 &&
                 (video2.duration - video2.currentTime) <= 3 &&
                 (video2.duration - video2.currentTime) > 0.1) {
        isPreloading = true;
        const nextIndex = (currentVideoIndex + 1) % videoSources.length;
        const nextSrc = videoSources[nextIndex];
        console.log('Preloading next video (video2 active):', nextSrc);
        // Preload next video in inactive video element
        loadAndPlayVideo(inactiveVideo, nextSrc, false).then(() => {
          console.log('Next video preloaded and ready');
        }).catch(() => {
          console.warn('Failed to preload next video');
          isPreloading = false;
        });
      }
    };
    
    // Check for preload opportunity every 500ms
    const preloadCheckInterval = setInterval(() => {
      preloadNextVideo();
    }, 500);
    
    // Ensure video is visible and playing
    video1.style.opacity = '1';
    video1.style.zIndex = '0';
    video1.style.display = 'block';
    video1.style.visibility = 'visible';
    
    // Force play attempt - make sure it's playing
    const ensurePlaying = () => {
      if (video1.paused && video1.readyState >= 2) {
        video1.play().then(() => {
          console.log('Video started playing');
        }).catch((err) => {
          console.warn('Video play failed:', err);
          // Retry after a delay
          setTimeout(() => {
            if (video1.paused && video1.readyState >= 2) {
              video1.play().catch(() => {});
            }
          }, 1000);
          // Also try again after user interaction
          const userInteractionPlay = () => {
            if (video1.paused && video1.readyState >= 2) {
              video1.play().catch(() => {});
            }
            document.removeEventListener('click', userInteractionPlay);
            document.removeEventListener('touchstart', userInteractionPlay);
          };
          document.addEventListener('click', userInteractionPlay, { once: true });
          document.addEventListener('touchstart', userInteractionPlay, { once: true });
        });
      }
    };
    
    // Try to play immediately
    ensurePlaying();
    
    // Also ensure it plays when ready
    if (video1.readyState < 3) {
      video1.addEventListener('canplaythrough', ensurePlaying, { once: true });
      video1.addEventListener('canplay', ensurePlaying, { once: true });
    }
    
    // Keep checking to ensure it's playing - but be smarter about it
    let consecutivePauseCount = 0;
    const playCheckInterval = setInterval(() => {
      if (video1 === activeVideo && !isSwitching && !video1.ended && video1.readyState >= 2) {
        // Only try to play if video is actually paused (not buffering)
        if (video1.paused && !video1.seeking) {
          consecutivePauseCount++;
          // Only try to play if it's been paused for a while (to avoid interfering with natural pauses)
          if (consecutivePauseCount >= 2) {
            console.log('Video1 paused unexpectedly, resuming...');
            video1.play().then(() => {
              consecutivePauseCount = 0;
            }).catch((err) => {
              console.warn('Video play check failed:', err);
              // Reset counter on error to avoid spam
              consecutivePauseCount = 0;
            });
          }
        } else {
          // Video is playing or buffering, reset counter
          consecutivePauseCount = 0;
        }
      } else if (video1.ended && video1 === activeVideo && !isSwitching) {
        // Video ended but hasn't triggered ended event, manually handle it
        console.log('Video1 ended detected in interval check');
        consecutivePauseCount = 0;
        handleVideoEnded();
      } else if (video1.ended) {
        consecutivePauseCount = 0;
      }
    }, 2000); // Check every 2 seconds
    
    // Don't clear interval when video ends - keep it running for all videos
    video1.addEventListener('ended', () => {
      consecutivePauseCount = 0;
    });
  }).catch((err) => {
    console.error('Failed to load initial video:', err);
    // Try to load next video if first fails
    if (videoSources.length > 1) {
      currentVideoIndex = 1;
      loadAndPlayVideo(video1, videoSources[1], true).then(() => {
        video1.addEventListener('ended', handleVideoEnded, { once: false });
        // Ensure it's playing
        if (video1.paused && video1.readyState >= 2) {
          video1.play().catch(() => {});
        }
      });
    }
  });
  
  // Monitor if video stops unexpectedly - but be more careful
  let video1LastPauseTime = 0;
  let video1PauseTimeout = null;
  video1.addEventListener('pause', () => {
    if (video1 === activeVideo && !isSwitching && !video1.ended) {
      const now = Date.now();
      // Clear any existing timeout
      if (video1PauseTimeout) {
        clearTimeout(video1PauseTimeout);
        video1PauseTimeout = null;
      }
      
      // Only resume if paused unexpectedly (not right after a play attempt or during natural pauses)
      if ((now - video1LastPauseTime) > 1000) {
        video1PauseTimeout = setTimeout(() => {
          // Double-check conditions before resuming
          if (video1.paused && 
              video1 === activeVideo && 
              !isSwitching && 
              !video1.ended && 
              !video1.seeking && 
              video1.readyState >= 2) {
            video1LastPauseTime = Date.now();
            video1.play().then(() => {
              console.log('Video resumed after unexpected pause');
            }).catch((err) => {
              console.warn('Video resume failed:', err);
            });
          }
          video1PauseTimeout = null;
        }, 500); // Wait 500ms to see if it's a temporary pause
      }
    }
  });
  
  // Also listen for play events to update last pause time
  video1.addEventListener('play', () => {
    if (video1PauseTimeout) {
      clearTimeout(video1PauseTimeout);
      video1PauseTimeout = null;
    }
    video1LastPauseTime = Date.now();
  });
  
  // Monitor video errors
  video1.addEventListener('error', (e) => {
    console.warn('Video error, trying next video', e, video1.error);
    if (videoSources.length > 1) {
      currentVideoIndex = (currentVideoIndex + 1) % videoSources.length;
      loadAndPlayVideo(video1, videoSources[currentVideoIndex]).catch(() => {});
    }
  });
  
  // Also set up video2 with pause monitoring - but be more careful
  let video2LastPauseTime = 0;
  let video2PauseTimeout = null;
  video2.addEventListener('pause', () => {
    if (video2 === activeVideo && !isSwitching && !video2.ended) {
      const now = Date.now();
      // Clear any existing timeout
      if (video2PauseTimeout) {
        clearTimeout(video2PauseTimeout);
        video2PauseTimeout = null;
      }
      
      // Only resume if paused unexpectedly
      if ((now - video2LastPauseTime) > 1000) {
        video2PauseTimeout = setTimeout(() => {
          // Double-check conditions before resuming
          if (video2.paused && 
              video2 === activeVideo && 
              !isSwitching && 
              !video2.ended && 
              !video2.seeking && 
              video2.readyState >= 2) {
            video2LastPauseTime = Date.now();
            video2.play().then(() => {
              console.log('Video2 resumed after unexpected pause');
            }).catch((err) => {
              console.warn('Video2 resume failed:', err);
            });
          }
          video2PauseTimeout = null;
        }, 500);
      }
    }
  });
  
  // Also listen for play events to update last pause time
  video2.addEventListener('play', () => {
    if (video2PauseTimeout) {
      clearTimeout(video2PauseTimeout);
      video2PauseTimeout = null;
    }
    video2LastPauseTime = Date.now();
  });
  
  // Periodic check to ensure video is playing - but be smarter to avoid jitter
  let lastPlayTime = 0;
  let consecutiveChecks = 0;
  const mainPlayCheckInterval = setInterval(() => {
    if (activeVideo && !isSwitching) {
      const now = Date.now();
      
      // Check if video ended but didn't trigger event
      if (activeVideo.ended && (now - lastPlayTime) > 1000) {
        console.log('Main check: Video ended, triggering handleVideoEnded');
        handleVideoEnded();
        return;
      }
      
      // Only check if video is paused AND enough time has passed since last play attempt
      if (!activeVideo.ended && activeVideo.paused && !activeVideo.seeking && (now - lastPlayTime) > 3000) {
        // Only try to resume if video is truly paused (not buffering) and has data
        if (activeVideo.readyState >= 2) {
          consecutiveChecks++;
          // Only attempt play after multiple consecutive paused checks (to avoid interfering with natural pauses)
          if (consecutiveChecks >= 2) {
            lastPlayTime = now;
            console.log('Main check: Video paused, resuming...');
            activeVideo.play().then(() => {
              console.log('Video resumed by periodic check');
              consecutiveChecks = 0;
            }).catch((err) => {
              console.warn('Periodic play check failed:', err);
              consecutiveChecks = 0; // Reset on error
            });
          }
        }
      } else if (!activeVideo.paused || activeVideo.ended) {
        // Video is playing or ended, reset counter
        consecutiveChecks = 0;
      }
    }
  }, 2000); // Check every 2 seconds
}

// Export for use in other files if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initBackgroundVideo };
}

