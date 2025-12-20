// ============================================
// VILOSTUDIOS - Standalone JavaScript
// All functionality bundled
// ============================================

// Translations
const translations = {
  en: {
    nav: { home: 'Home', about: 'About', portfolio: 'Portfolio', contact: 'Contact' },
    anime: { text: 'Anime' },
    about: {
      number: '01',
      title: 'About',
      subtitle: 'Animation & Sound, Together',
      description: 'Animation and sound that work together. Cinematics, PVs, trailers, music videos, episodes. Three titles max. Teams built from our network. Remote. Motion, Quality, Accuracy, Acting, Selling.',
      stat1: 'Active Titles',
      stat2: 'Core Team',
      cta: 'View more about our production house',
      short: 'Three titles max. Teams built for your IP. Animation and sound that actually work together.'
    },
    portfolio: {
      title: 'Portfolio',
      description: 'Explore our collection of innovative animations and visual storytelling projects that showcase our creative vision and technical expertise.',
      itemCategory: 'Animation',
      itemTitle: 'Wuthering Waves - Where are you Rover',
      itemSubtitle: '(Solaris Stage Project)',
      itemClient: 'Kuro Games',
      clientLabel: 'Client'
    },
    edge: {
      title: 'Ready to Get Started?',
      subtitle: 'Book your pre-production call',
      description: 'Schedule a consultation to discuss your project goals, timeline, and how we can bring your vision to life.',
      cta: 'Book a Strategy Session'
    },
    contact: {
      number: '07',
      title: 'Contact',
      subtitle: "Let's Create Together",
      description: 'Schedule a pre production call or hire us to do your animation, outsourcing inquiries.',
      email: 'Email',
      formName: 'Name',
      formEmail: 'Email',
      formInquiryType: 'Select Inquiry Type',
      inquiryPreProduction: 'Pre-Production Call',
      inquiryAnimation: 'Animation Service',
      inquiryOutsourcing: 'Outsourcing',
      inquiryOther: 'Other',
      formPreferredDay: 'Preferred Day',
      formSelectDay: 'Select Day',
      dayFriday: 'Friday',
      daySaturday: 'Saturday',
      daySunday: 'Sunday',
      formTimezone: 'Your Timezone',
      formSelectTimezone: 'Select Timezone',
      formAvailableTime: 'Available Time',
      selectTimezoneFirst: 'Select your timezone to see available times',
      timeDisplayCET: '8:00 PM CET',
      scheduleAppointment: 'Schedule Appointment',
      yourTimezone: 'Your Timezone',
      selectTime: 'Select Time',
      selectDateFirst: 'Select a date to see available times',
      selectedAppointment: 'Selected Appointment',
      formMessage: 'Message',
      formSubmit: 'Send Message',
      formSubmitting: 'Sending...',
      formSuccess: 'Message sent successfully! We\'ll get back to you soon.',
      formError: 'Failed to send message. Please try again or email us directly.',
      footerRights: '© VILOSTUDIOS. All rights reserved.',
      footerTerms: 'Terms of Service',
      footerPrivacy: 'Privacy Policy',
      footerCookies: 'Cookie Policy',
      inquiryIntro: 'Please feel free to contact us regarding work requests and consultations.',
      inquiryNote: 'Depending on the content of your inquiry, we may be unable to reply. Thank you for understanding in advance.',
      proposalWarning: 'Except where a formal written agreement exists, VILOSTUDIOS does not accept or solicit unsolicited proposals or ideas. If you submit one, you agree to the terms below:',
      proposalNoConfidentiality: 'We have no obligation to keep your proposal confidential.',
      proposalNoReview: 'We have no obligation to review, evaluate, or adopt your proposal.',
      proposalNoResponse: 'We are under no obligation to respond to your proposal.',
      proposalNoLiability: 'We bear no liability if our work is identical or similar to your proposal.',
      proposalNoReturn: 'Materials will not be returned. Physical submissions may be discarded without being opened.'
    }
  },
  ja: {
    nav: { home: 'ホーム', about: '会社概要', portfolio: '作品集', contact: 'お問い合わせ' },
    calendar: {
      sun: '日', mon: '月', tue: '火', wed: '水', thu: '木', fri: '金', sat: '土'
    },
    anime: { text: 'アニメ' },
    about: {
      number: '01',
      title: '会社概要',
      subtitle: 'アニメーションとサウンド、共に',
      description: 'アニメーションとサウンドが連携して機能する。シネマティック、PV、トレーラー、ミュージックビデオ、エピソード。最大3タイトル。ネットワークから構築されたチーム。リモート。モーション、品質、正確性、演技、セリング。',
      stat1: 'アクティブタイトル',
      stat2: 'コアチーム',
      cta: '詳しく見る',
      short: '最大3タイトル。あなたのIPのために構築されたチーム。実際に連携するアニメーションとサウンド。'
    },
    portfolio: {
      title: '作品集',
      description: '私たちの創造的ビジョンと技術的専門知識を示す革新的なアニメーションとビジュアルストーリーテリングプロジェクトのコレクションをご覧ください。',
      itemCategory: 'アニメーション',
      itemTitle: 'Wuthering Waves - Where are you Rover',
      itemSubtitle: '(ソラリスステージプロジェクト)',
      itemClient: 'Kuro Games',
      clientLabel: 'クライアント'
    },
    edge: {
      title: '始める準備はできていますか？',
      subtitle: '事前制作相談を予約',
      description: 'プロジェクトの目標、タイムライン、そしてビジョンを実現する方法について相談する予約を入れてください。',
      cta: '戦略セッションを予約'
    },
    contact: {
      number: '07',
      title: 'お問い合わせ',
      subtitle: '一緒に創造しましょう',
      description: '制作前の電話相談を予約するか、アニメーション制作やアウトソーシングのご依頼をお受けします。',
      email: 'メール',
      formName: 'お名前',
      formEmail: 'メールアドレス',
      formInquiryType: 'お問い合わせ種類を選択',
      inquiryPreProduction: '制作前の相談',
      inquiryAnimation: 'アニメーション制作サービス',
      inquiryOutsourcing: 'アウトソーシング',
      inquiryOther: 'その他',
      formPreferredDay: '希望日',
      formSelectDay: '日を選択',
      dayFriday: '金曜日',
      daySaturday: '土曜日',
      daySunday: '日曜日',
      formTimezone: 'タイムゾーン',
      formSelectTimezone: 'タイムゾーンを選択',
      formAvailableTime: '利用可能な時間',
      selectTimezoneFirst: 'タイムゾーンを選択して利用可能な時間を表示',
      timeDisplayCET: '午後8時 CET',
      scheduleAppointment: '予約をスケジュール',
      yourTimezone: 'あなたのタイムゾーン',
      selectTime: '時間を選択',
      selectDateFirst: '日付を選択して利用可能な時間を表示',
      selectedAppointment: '選択された予約',
      formMessage: 'メッセージ',
      formSubmit: '送信',
      formSubmitting: '送信中...',
      formSuccess: 'メッセージが正常に送信されました。後ほどご連絡いたします。',
      formError: 'メッセージの送信に失敗しました。再度お試しいただくか、直接メールでご連絡ください。',
      footerRights: '© VILOSTUDIOS. All rights reserved.',
      footerTerms: '利用規約',
      footerPrivacy: 'プライバシーポリシー',
      footerCookies: 'クッキーポリシー',
      inquiryIntro: 'お仕事のご依頼やご相談はお気軽にご連絡ください。',
      inquiryNote: 'お問い合わせ内容によってはご返信できない場合があります。あらかじめご了承ください。',
      proposalWarning: '書面での正式な契約がない限り、VILOSTUDIOSは企画やアイデア等の提案を受け付けておりません。ご送付いただいた場合は以下に同意いただいたものとみなします。',
      proposalNoConfidentiality: 'ご提案内容を秘密に保持する義務は負いません。',
      proposalNoReview: 'ご提案を検討・評価・採用する義務は負いません。',
      proposalNoResponse: 'ご提案に対して回答する義務は負いません。',
      proposalNoLiability: '弊社の現在または将来の企画が同一・類似であっても一切責任を負いません。',
      proposalNoReturn: '資料はご返却いたしません。郵送物等は未開封のまま破棄される場合があります。'
    }
  },
  zh: {
    nav: { home: '首页', about: '关于我们', portfolio: '作品集', contact: '联系我们' },
    calendar: {
      sun: '日', mon: '一', tue: '二', wed: '三', thu: '四', fri: '五', sat: '六'
    },
    anime: { text: '动画' },
    about: {
      number: '01',
      title: '关于我们',
      subtitle: '动画与声音，一起',
      description: '动画与声音协同工作。宣传片、PV、预告片、音乐视频、剧集。最多三个项目。从我们的网络组建团队。远程。动作、质量、准确性、表演、销售。',
      stat1: '活跃项目',
      stat2: '核心团队',
      cta: '了解更多',
      short: '最多三个项目。为您的IP组建的团队。真正协同工作的动画与声音。'
    },
    portfolio: {
      title: '作品集',
      description: '探索我们的创新动画和视觉叙事项目集合，展示我们的创意视野和技术专长。',
      itemCategory: '动画',
      itemTitle: 'Wuthering Waves - Where are you Rover',
      itemSubtitle: '(太阳舞台项目)',
      itemClient: 'Kuro Games',
      clientLabel: '客户'
    },
    edge: {
      title: '准备好开始了吗？',
      subtitle: '预约前期制作会议',
      description: '预约咨询，讨论您的项目目标、时间表以及我们如何将您的愿景变为现实。',
      cta: '预约策略会议'
    },
    contact: {
      number: '07',
      title: '联系我们',
      subtitle: '一起创作',
      description: '预约制作前电话咨询，或委托我们进行动画制作、外包服务咨询。',
      email: '邮箱',
      formName: '姓名',
      formEmail: '邮箱',
      formInquiryType: '选择咨询类型',
      inquiryPreProduction: '制作前咨询',
      inquiryAnimation: '动画制作服务',
      inquiryOutsourcing: '外包服务',
      inquiryOther: '其他',
      formPreferredDay: '首选日期',
      formSelectDay: '选择日期',
      dayFriday: '星期五',
      daySaturday: '星期六',
      daySunday: '星期日',
      formTimezone: '您的时区',
      formSelectTimezone: '选择时区',
      formAvailableTime: '可用时间',
      selectTimezoneFirst: '选择您的时区以查看可用时间',
      timeDisplayCET: '晚上8点 CET',
      scheduleAppointment: '安排预约',
      yourTimezone: '您的时区',
      selectTime: '选择时间',
      selectDateFirst: '选择日期以查看可用时间',
      selectedAppointment: '已选预约',
      formMessage: '留言',
      formSubmit: '发送消息',
      formSubmitting: '发送中...',
      formSuccess: '消息发送成功！我们会尽快回复您。',
      formError: '消息发送失败。请重试或直接通过邮件联系我们。',
      footerRights: '© VILOSTUDIOS. All rights reserved.',
      footerTerms: '服务条款',
      footerPrivacy: '隐私政策',
      footerCookies: 'Cookie 政策',
      inquiryIntro: '欢迎就合作需求或咨询事宜与我们联系。',
      inquiryNote: '根据咨询内容，我们可能无法逐一回复，敬请谅解。',
      proposalWarning: '除非事先签订正式书面协议，VILOSTUDIOS 不接受任何未经请求的企划或创意。若仍然提交，即视为同意以下条款：',
      proposalNoConfidentiality: '我们没有义务对您的提案保密。',
      proposalNoReview: '我们没有义务审阅、评估或采纳您的提案。',
      proposalNoResponse: '我们没有义务回复您的提案。',
      proposalNoLiability: '即使我们的作品与您的提案相同或相似，我们也不承担任何责任。',
      proposalNoReturn: '提交的资料概不退还；邮寄或快递材料可能在未开封的情况下被处理。'
    }
  }
};

// Language Management
let currentLanguage = 'en';

function detectLanguage() {
  const hash = window.location.hash.toLowerCase();
  if (hash === '#jp' || hash === '#ja') return 'ja';
  if (hash === '#eng' || hash === '#en') return 'en';
  if (hash === '#ch' || hash === '#zh') return 'zh';
  
  const match = hash.match(/-?(jp|eng|ch|en|ja|zh)$/);
  if (match) {
    const lang = match[1];
    if (lang === 'jp' || lang === 'ja') return 'ja';
    if (lang === 'eng' || lang === 'en') return 'en';
    if (lang === 'ch' || lang === 'zh') return 'zh';
  }
  
  const saved = localStorage.getItem('vilostudios-language');
  if (saved && (saved === 'en' || saved === 'ja' || saved === 'zh')) return saved;
  
  const browserLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase().split('-')[0];
  if (browserLang === 'ja') return 'ja';
  if (browserLang === 'zh') return 'zh';
  return 'en';
}

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('vilostudios-language', lang);
  document.documentElement.lang = lang;
  
  // Update X link for Japanese
  const xLink = document.getElementById('x-link');
  if (xLink) {
    xLink.href = lang === 'ja' ? 'https://x.com/Vilostudios_jp' : 'https://x.com/vilostudios';
  }
  
  // Update language buttons
  document.querySelectorAll('.lang-button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
  
  // Update all i18n elements
  updateTranslations();
}

function updateTranslations() {
  const t = translations[currentLanguage];
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const keys = key.split('.');
    let value = t;
    for (const k of keys) {
      value = value?.[k];
    }
    
    if (value) {
      // Special handling for animated title
      if (el.classList.contains('ae-text-word')) {
        // Clear existing letters
        el.innerHTML = '';
        // Create new letter spans for each character
        const letters = value.split('');
        letters.forEach((letter, index) => {
          const span = document.createElement('span');
          span.className = 'ae-text-letter';
          span.style.color = 'var(--orange)';
          span.style.setProperty('--index', index);
          span.textContent = letter;
          el.appendChild(span);
        });
      } else {
        el.textContent = value;
      }
    }
  });
  
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    const keys = key.split('.');
    let value = t;
    for (const k of keys) {
      value = value?.[k];
    }
    if (value) el.placeholder = value;
  });
  
  // Update calendar month/year display
  const monthYearEl = document.getElementById('calendar-month-year');
  if (monthYearEl && typeof renderCalendar === 'function') {
    renderCalendar();
  }
  
  // Update calendar and scheduler if initialized
  if (typeof renderCalendar === 'function') {
    renderCalendar();
  }
  if (typeof renderTimeSlots === 'function') {
    renderTimeSlots();
  }
  if (typeof updateAppointmentSummary === 'function') {
    updateAppointmentSummary();
  }
}

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

function initBackgroundVideo() {
  const video1 = document.getElementById('video1');
  const video2 = document.getElementById('video2');
  
  if (!video1 || !video2 || videoSources.length === 0) return;
  
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
  
  video1.style.opacity = '1';
  video1.style.zIndex = '0';
  video2.style.opacity = '0';
  video2.style.zIndex = '1';
  
  // Remove any existing event listeners
  video1.removeEventListener('ended', handleVideoEnded);
  video2.removeEventListener('ended', handleVideoEnded);
  
  loadAndPlayVideo(video1, videoSources[0]).then(() => {
    video1.addEventListener('ended', handleVideoEnded, { once: false });
    
    // Ensure video keeps playing
    if (video1.paused) {
      video1.play().catch(() => {
        // If autoplay fails, try on user interaction
        const tryPlay = () => {
          video1.play().catch(() => {});
          document.removeEventListener('click', tryPlay);
          document.removeEventListener('touchstart', tryPlay);
        };
        document.addEventListener('click', tryPlay, { once: true });
        document.addEventListener('touchstart', tryPlay, { once: true });
      });
    }
    
    // Monitor if video stops unexpectedly
    video1.addEventListener('pause', () => {
      if (video1 === activeVideo && !isSwitching) {
        // Video paused unexpectedly, try to resume
        setTimeout(() => {
          if (video1.paused && video1 === activeVideo && !isSwitching) {
            video1.play().catch(() => {});
          }
        }, 100);
      }
    });
    
    // Monitor video errors
    video1.addEventListener('error', () => {
      console.warn('Video error, trying next video');
      if (videoSources.length > 1) {
        currentVideoIndex = (currentVideoIndex + 1) % videoSources.length;
        loadAndPlayVideo(video1, videoSources[currentVideoIndex]).catch(() => {});
      }
    });
  }).catch((err) => {
    console.error('Failed to load initial video:', err);
    // Try to load next video if first fails
    if (videoSources.length > 1) {
      currentVideoIndex = 1;
      loadAndPlayVideo(video1, videoSources[1]).then(() => {
        video1.addEventListener('ended', handleVideoEnded, { once: false });
      });
    }
  });
  
  // Also set up video2 with pause monitoring
  video2.addEventListener('pause', () => {
    if (video2 === activeVideo && !isSwitching) {
      setTimeout(() => {
        if (video2.paused && video2 === activeVideo && !isSwitching) {
          video2.play().catch(() => {});
        }
      }, 100);
    }
  });
  
  // Periodic check to ensure video is playing
  setInterval(() => {
    if (activeVideo && activeVideo.paused && !isSwitching) {
      activeVideo.play().catch(() => {
        // If play fails, try reloading
        if (videoSources.length > 0) {
          loadAndPlayVideo(activeVideo, videoSources[currentVideoIndex]).catch(() => {});
        }
      });
    }
  }, 2000); // Check every 2 seconds
}

function ensureNoLoop(video) {
  video.loop = false;
  video.removeAttribute('loop');
  // Ensure autoplay is set
  video.setAttribute('autoplay', '');
  video.autoplay = true;
}

function loadAndPlayVideo(video, src) {
  return new Promise((resolve, reject) => {
    // Pause and reset video first
    video.pause();
    video.currentTime = 0;
    ensureNoLoop(video);
    
    // Ensure video attributes are set for autoplay
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('autoplay', '');
    video.autoplay = true;
    
    // Remove any existing event listeners to prevent duplicates
    const tempHandler = () => {};
    video.removeEventListener('canplaythrough', tempHandler);
    video.removeEventListener('loadeddata', tempHandler);
    video.removeEventListener('error', tempHandler);
    
    video.src = src;
    video.preload = 'auto';
    video.load();
    
    let resolved = false;
    
    const onCanPlay = () => {
      if (resolved) return;
      ensureNoLoop(video);
      
      // Ensure video is at the start
      if (video.currentTime !== 0) {
        video.currentTime = 0;
      }
      
      const playVideo = () => {
        if (resolved) return;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            if (!resolved) {
              resolved = true;
              if (video === activeVideo) {
                video.style.opacity = '1';
                video.style.zIndex = '0';
              }
              // Ensure video keeps playing
              video.play().catch(() => {});
              resolve();
            }
          }).catch((err) => {
            // If autoplay fails, try again after user interaction
            console.warn('Video autoplay failed, will retry:', err);
            if (!resolved) {
              // Don't reject, just log - video might play later
              resolved = true;
              // Try to play again after a short delay
              setTimeout(() => {
                video.play().catch(() => {});
              }, 1000);
              resolve();
            }
          });
        } else {
          // Fallback for older browsers
          resolved = true;
          resolve();
        }
      };
      
      // Wait for video to be ready
      if (video.readyState >= 3) {
        if (video.currentTime === 0) {
          playVideo();
        } else {
          video.currentTime = 0;
          video.addEventListener('seeked', playVideo, { once: true });
        }
      } else {
        video.addEventListener('canplay', playVideo, { once: true });
      }
    };
    
    video.addEventListener('canplaythrough', onCanPlay, { once: true });
    video.addEventListener('loadeddata', onCanPlay, { once: true });
    video.addEventListener('error', (e) => {
      if (!resolved) {
        resolved = true;
        reject(new Error(`Failed to load: ${src}`));
      }
    }, { once: true });
    
    // Fallback timeout
    setTimeout(() => {
      if (!resolved && video.readyState >= 3) {
        onCanPlay();
      }
    }, 3000);
  });
}

function handleVideoEnded() {
  // Prevent multiple calls
  if (isSwitching) return;
  
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
  
  // Prepare inactive video - load it first
  inactive.style.opacity = '0';
  inactive.style.zIndex = '1';
  inactive.style.transition = 'opacity 0s';
  ensureNoLoop(inactive);
  
  // Load the next video in the background
  loadAndPlayVideo(inactive, nextSrc).then(() => {
    // Ensure new video is ready and playing before starting transition
    if (inactive.readyState >= 3) {
      // Start playing the new video silently (opacity 0)
      const playPromise = inactive.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If play fails, try again
          setTimeout(() => inactive.play().catch(() => {}), 500);
        });
      }
      
      // Small delay to ensure video is playing
      setTimeout(() => {
        // Start crossfade transition - both videos playing simultaneously
        requestAnimationFrame(() => {
          // Set up smooth crossfade transitions
          active.style.transition = 'opacity 2s cubic-bezier(0.4, 0, 0.2, 1)';
          inactive.style.transition = 'opacity 2s cubic-bezier(0.4, 0, 0.2, 1)';
          
          // Crossfade: fade out old, fade in new simultaneously
          inactive.style.zIndex = '0';
          inactive.style.opacity = '0';
          
          // Start the crossfade
          requestAnimationFrame(() => {
            active.style.opacity = '0';
            inactive.style.opacity = '1';
          });
          
          // After transition completes, swap and clean up
          setTimeout(() => {
            // Swap the videos
            const temp = activeVideo;
            activeVideo = inactiveVideo;
            inactiveVideo = temp;
            
            const newActive = activeVideo;
            const newInactive = inactiveVideo;
            
            // Pause and reset the old video
            newInactive.pause();
            newInactive.currentTime = 0;
            newInactive.style.opacity = '0';
            newInactive.style.zIndex = '1';
            newInactive.style.transition = 'opacity 0s';
            
            // Ensure new active is visible and playing
            newActive.style.opacity = '1';
            newActive.style.zIndex = '0';
            
            // Ensure video is playing
            if (newActive.paused) {
              newActive.play().catch(() => {});
            }
            
            // Add ended listener to the new active video
            ensureNoLoop(newActive);
            newActive.addEventListener('ended', handleVideoEnded, { once: false });
            
            isSwitching = false;
          }, 2000);
        });
      }, 100);
    } else {
      // If video not ready, wait for it
      inactive.addEventListener('canplay', () => {
        inactive.play().catch(() => {});
        setTimeout(() => {
          requestAnimationFrame(() => {
            active.style.transition = 'opacity 2s cubic-bezier(0.4, 0, 0.2, 1)';
            inactive.style.transition = 'opacity 2s cubic-bezier(0.4, 0, 0.2, 1)';
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
            }, 2000);
          });
        }, 100);
      }, { once: true });
    }
  }).catch((error) => {
    console.error('Error loading video:', error);
    // If loading fails, try to continue with current video
    active.addEventListener('ended', handleVideoEnded, { once: false });
    isSwitching = false;
  });
}

// Navigation
let activeSection = 'home';
let isScrolling = false;
let isUserScrolling = false;
let scrollTimeout = null;

function updateActiveSection(updateHash = false) {
  const sections = ['home', 'about', 'portfolio', 'contact'];
  const scrollPosition = window.scrollY + 200;
  
  for (const section of sections) {
    const element = document.getElementById(section);
    if (element) {
      const { offsetTop, offsetHeight } = element;
      if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
        if (activeSection !== section) {
          activeSection = section;
          document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.section === section);
          });
          
          // Only update hash if explicitly requested (from navigation click)
          // Don't update hash during user scrolling to prevent feedback loop
          if (updateHash && !isUserScrolling) {
            const langCode = currentLanguage === 'ja' ? 'jp' : currentLanguage === 'zh' ? 'ch' : 'en';
            const newHash = section === 'home' ? `#${langCode}` : `#${section}/${langCode}`;
            // Use replaceState to avoid triggering hashchange
            if (window.location.hash !== newHash) {
              window.history.replaceState(null, '', newHash);
            }
          }
          
          // Update page title
          const sectionNames = {
            home: 'Home',
            about: 'About',
            portfolio: 'Portfolio',
            contact: 'Contact'
          };
          document.title = `${sectionNames[section] || 'Home'} - VILOSTUDIOS`;
        }
        break;
      }
    }
  }
}

function scrollToSection(id, updateHash = true) {
  if (isScrolling) return;
  
  const element = document.getElementById(id);
  if (!element) return;
  
  // Check if we're already at this section (within 100px)
  const scrollY = window.scrollY || window.pageYOffset;
  const elementTop = element.offsetTop;
  const elementBottom = elementTop + element.offsetHeight;
  
  if (scrollY >= elementTop - 100 && scrollY < elementBottom) {
    // Already at this section, just update UI
    activeSection = id;
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.section === id);
    });
    return;
  }
  
  isScrolling = true;
  isUserScrolling = false; // This is a programmatic scroll
  
  // Use scrollTo for better control
  const targetY = Math.max(0, elementTop - 80); // Account for nav bar, ensure non-negative
  
  // Update UI immediately
  activeSection = id;
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.section === id);
  });
  
  // Perform smooth scroll
  window.scrollTo({
    top: targetY,
    behavior: 'smooth'
  });
  
  // Update hash and title after a short delay
  setTimeout(() => {
    if (updateHash) {
      const langCode = currentLanguage === 'ja' ? 'jp' : currentLanguage === 'zh' ? 'ch' : 'en';
      const newHash = id === 'home' ? `#${langCode}` : `#${id}/${langCode}`;
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, '', newHash);
      }
    }
    
    // Update page title
    const sectionNames = {
      home: 'Home',
      about: 'About',
      portfolio: 'Portfolio',
      contact: 'Contact'
    };
    document.title = `${sectionNames[id] || 'Home'} - VILOSTUDIOS`;
  }, 50);
  
  // Reset scrolling flag after animation completes (smooth scroll typically takes ~500ms)
  setTimeout(() => {
    isScrolling = false;
  }, 1000);
}

// Contact Form
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1431297607623246016/QFnruCHzMVOdbMsyYtdp7iy3rlFMU7qBkmEo787GwZoBzggrgaZEmYFbXytmDaqY1_NI';

// Available times: Friday, Saturday, Sunday from 8pm to 10pm CET (hourly)
const AVAILABLE_TIMES = {
  5: [{ hour: 20, minute: 0 }, { hour: 21, minute: 0 }, { hour: 22, minute: 0 }], // Friday: 8pm, 9pm, 10pm
  6: [{ hour: 20, minute: 0 }, { hour: 21, minute: 0 }, { hour: 22, minute: 0 }], // Saturday: 8pm, 9pm, 10pm
  0: [{ hour: 20, minute: 0 }, { hour: 21, minute: 0 }, { hour: 22, minute: 0 }]  // Sunday: 8pm, 9pm, 10pm
};

// Calendar state
let currentCalendarMonth = new Date().getMonth();
let currentCalendarYear = new Date().getFullYear();
let selectedDate = null;
let selectedTime = null;
let selectedTimezone = null;

// Common timezones
const TIMEZONES = [
  { value: 'Europe/London', label: 'Europe/London (GMT)' },
  { value: 'Europe/Paris', label: 'Europe/Paris (CET)' },
  { value: 'Europe/Berlin', label: 'Europe/Berlin (CET)' },
  { value: 'Europe/Rome', label: 'Europe/Rome (CET)' },
  { value: 'Europe/Madrid', label: 'Europe/Madrid (CET)' },
  { value: 'Europe/Amsterdam', label: 'Europe/Amsterdam (CET)' },
  { value: 'Europe/Brussels', label: 'Europe/Brussels (CET)' },
  { value: 'Europe/Vienna', label: 'Europe/Vienna (CET)' },
  { value: 'Europe/Prague', label: 'Europe/Prague (CET)' },
  { value: 'Europe/Warsaw', label: 'Europe/Warsaw (CET)' },
  { value: 'Europe/Stockholm', label: 'Europe/Stockholm (CET)' },
  { value: 'Europe/Copenhagen', label: 'Europe/Copenhagen (CET)' },
  { value: 'Europe/Helsinki', label: 'Europe/Helsinki (EET)' },
  { value: 'Europe/Athens', label: 'Europe/Athens (EET)' },
  { value: 'Europe/Istanbul', label: 'Europe/Istanbul (TRT)' },
  { value: 'Europe/Moscow', label: 'Europe/Moscow (MSK)' },
  { value: 'America/New_York', label: 'America/New_York (EST/EDT)' },
  { value: 'America/Chicago', label: 'America/Chicago (CST/CDT)' },
  { value: 'America/Denver', label: 'America/Denver (MST/MDT)' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles (PST/PDT)' },
  { value: 'America/Toronto', label: 'America/Toronto (EST/EDT)' },
  { value: 'America/Vancouver', label: 'America/Vancouver (PST/PDT)' },
  { value: 'America/Mexico_City', label: 'America/Mexico_City (CST)' },
  { value: 'America/Sao_Paulo', label: 'America/Sao_Paulo (BRT)' },
  { value: 'America/Buenos_Aires', label: 'America/Buenos_Aires (ART)' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Asia/Shanghai (CST)' },
  { value: 'Asia/Hong_Kong', label: 'Asia/Hong_Kong (HKT)' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore (SGT)' },
  { value: 'Asia/Seoul', label: 'Asia/Seoul (KST)' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai (GST)' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata (IST)' },
  { value: 'Asia/Bangkok', label: 'Asia/Bangkok (ICT)' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney (AEDT/AEST)' },
  { value: 'Australia/Melbourne', label: 'Australia/Melbourne (AEDT/AEST)' },
  { value: 'Pacific/Auckland', label: 'Pacific/Auckland (NZDT/NZST)' }
];

function convertCETToTimezone(date, cetHour, cetMinute, targetTimezone) {
  try {
    // Create date string for the selected date at CET time
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateTimeStr = `${year}-${month}-${day}T${String(cetHour).padStart(2, '0')}:${String(cetMinute).padStart(2, '0')}:00`;
    
    // Create a date representing this time in CET
    // We need to create a date that when formatted in CET shows our desired time
    // Then format that same moment in the target timezone
    
    // Create date assuming it's in CET (Europe/Paris)
    const cetDate = new Date(dateTimeStr);
    
    // Get what this date represents in UTC when interpreted as CET
    // We'll use a formatter to convert
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Paris',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    
    // Find the UTC equivalent by creating a date and adjusting
    let utcDate = new Date(`${year}-${month}-${day}T${String(cetHour).padStart(2, '0')}:${String(cetMinute).padStart(2, '0')}:00`);
    
    // Calculate offset between UTC and CET for this date
    const testDate = new Date(`${year}-${month}-${day}T12:00:00Z`);
    const cetTime = new Date(testDate.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
    const utcTime = new Date(testDate.toLocaleString('en-US', { timeZone: 'UTC' }));
    const offsetMs = cetTime.getTime() - utcTime.getTime();
    
    // Adjust UTC date to represent CET time
    utcDate.setTime(utcDate.getTime() - offsetMs);
    
    // Now format this UTC moment in the target timezone
    const targetFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: targetTimezone,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    });
    
    const parts = targetFormatter.formatToParts(utcDate);
    const hourPart = parts.find(p => p.type === 'hour')?.value || '8';
    const minutePart = parts.find(p => p.type === 'minute')?.value || '00';
    const dayPeriod = parts.find(p => p.type === 'dayPeriod')?.value || 'PM';
    const timeZoneName = parts.find(p => p.type === 'timeZoneName')?.value || '';
    
    return {
      hour: parseInt(hourPart),
      minute: parseInt(minutePart),
      dayPeriod: dayPeriod,
      timeZoneName: timeZoneName,
      formatted: `${hourPart}:${minutePart} ${dayPeriod} ${timeZoneName}`.trim(),
      utcDate: utcDate
    };
  } catch (error) {
    console.error('Timezone conversion error:', error);
    return { formatted: '8:00 PM CET', utcDate: new Date() };
  }
}

// Calendar Functions
function renderCalendar() {
  const calendarDays = document.getElementById('calendar-days');
  const monthYear = document.getElementById('calendar-month-year');
  if (!calendarDays || !monthYear) return;
  
  const firstDay = new Date(currentCalendarYear, currentCalendarMonth, 1);
  const lastDay = new Date(currentCalendarYear, currentCalendarMonth + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday
  
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  monthYear.textContent = `${monthNames[currentCalendarMonth]} ${currentCalendarYear}`;
  
  calendarDays.innerHTML = '';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Render 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    
    const dayElement = document.createElement('div');
    dayElement.className = 'calendar-day';
    dayElement.textContent = date.getDate();
    dayElement.dataset.date = date.toISOString().split('T')[0];
    
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    
    // Check if it's in current month
    if (date.getMonth() !== currentCalendarMonth) {
      dayElement.classList.add('other-month');
    }
    
    // Check if it's today
    if (dateOnly.getTime() === today.getTime()) {
      dayElement.classList.add('today');
    }
    
    // Check if it's selected
    if (selectedDate && dateOnly.getTime() === selectedDate.getTime()) {
      dayElement.classList.add('selected');
    }
    
    // Check if it's an available day (Friday=5, Saturday=6, Sunday=0)
    const dayOfWeek = date.getDay();
    const isAvailableDay = (dayOfWeek === 5 || dayOfWeek === 6 || dayOfWeek === 0); // Friday, Saturday, Sunday
    const isPastDate = dateOnly < today;
    
    if (isAvailableDay && !isPastDate) {
      // Only Friday, Saturday, Sunday in the future are available
      dayElement.classList.add('available');
      dayElement.addEventListener('click', () => selectDate(date));
    } else {
      // Disable all other days
      dayElement.style.opacity = '0.3';
      dayElement.style.cursor = 'not-allowed';
      dayElement.style.pointerEvents = 'none';
    }
    
    calendarDays.appendChild(dayElement);
  }
}

function selectDate(date) {
  const dateOnly = new Date(date);
  dateOnly.setHours(0, 0, 0, 0);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Only allow selection of Friday (5), Saturday (6), or Sunday (0)
  const dayOfWeek = dateOnly.getDay();
  if (dateOnly < today || (dayOfWeek !== 5 && dayOfWeek !== 6 && dayOfWeek !== 0)) {
    return;
  }
  
  selectedDate = dateOnly;
  selectedTime = null;
  renderCalendar();
  renderTimeSlots();
  updateAppointmentSummary();
}

function renderTimeSlots() {
  const timeSlotsGrid = document.getElementById('time-slots-grid');
  if (!timeSlotsGrid) return;
  
  if (!selectedDate) {
    timeSlotsGrid.innerHTML = `
      <div class="time-slot-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" opacity="0.3"/>
          <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
        </svg>
        <span data-i18n="contact.selectDateFirst">Select a date to see available times</span>
      </div>
    `;
    return;
  }
  
  const dayOfWeek = selectedDate.getDay();
  const availableTimes = AVAILABLE_TIMES[dayOfWeek];
  
  if (!availableTimes || !selectedTimezone) {
    timeSlotsGrid.innerHTML = `
      <div class="time-slot-placeholder">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" opacity="0.3"/>
          <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.3"/>
        </svg>
        <span data-i18n="contact.selectTimezoneFirst">Select your timezone to see available times</span>
      </div>
    `;
    return;
  }
  
  timeSlotsGrid.innerHTML = '';
  
  availableTimes.forEach(timeSlot => {
    const converted = convertCETToTimezone(selectedDate, timeSlot.hour, timeSlot.minute, selectedTimezone);
    const timeElement = document.createElement('div');
    timeElement.className = 'time-slot';
    if (selectedTime && selectedTime.hour === timeSlot.hour && selectedTime.minute === timeSlot.minute) {
      timeElement.classList.add('selected');
    }
    timeElement.textContent = converted.formatted;
    timeElement.dataset.hour = timeSlot.hour;
    timeElement.dataset.minute = timeSlot.minute;
    timeElement.addEventListener('click', () => selectTime(timeSlot, converted));
    timeSlotsGrid.appendChild(timeElement);
  });
}

function selectTime(timeSlot, converted) {
  selectedTime = timeSlot;
  renderTimeSlots();
  updateAppointmentSummary();
}

function updateAppointmentSummary() {
  const summary = document.getElementById('appointment-summary');
  const summaryDate = document.getElementById('summary-date');
  const summaryTime = document.getElementById('summary-time');
  const summaryTimezone = document.getElementById('summary-timezone');
  
  if (!summary) return;
  
  if (selectedDate && selectedTime && selectedTimezone) {
    summary.style.display = 'block';
    
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (summaryDate) summaryDate.textContent = dateFormatter.format(selectedDate);
    
    const converted = convertCETToTimezone(selectedDate, selectedTime.hour, selectedTime.minute, selectedTimezone);
    if (summaryTime) summaryTime.textContent = converted.formatted;
    if (summaryTimezone) {
      const tzName = TIMEZONES.find(tz => tz.value === selectedTimezone)?.label || selectedTimezone;
      summaryTimezone.textContent = `Timezone: ${tzName}`;
    }
  } else {
    summary.style.display = 'none';
  }
}

function populateTimezones() {
  const timezoneSelect = document.getElementById('form-timezone');
  if (!timezoneSelect) return;
  
  timezoneSelect.innerHTML = '<option value="" data-i18n="contact.formSelectTimezone">Select Timezone</option>';
  
  TIMEZONES.forEach(tz => {
    const option = document.createElement('option');
    option.value = tz.value;
    option.textContent = tz.label;
    timezoneSelect.appendChild(option);
  });
  
  // Try to detect user's timezone
  try {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const matchingOption = Array.from(timezoneSelect.options).find(opt => opt.value === userTimezone);
    if (matchingOption) {
      timezoneSelect.value = userTimezone;
      selectedTimezone = userTimezone;
      renderTimeSlots();
    }
  } catch (e) {
    // Ignore if detection fails
  }
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  // Bot detection: Track form open time
  const formOpenTime = Date.now();
  
  // Initialize calendar
  renderCalendar();
  
  // Calendar navigation
  const prevBtn = document.getElementById('calendar-prev');
  const nextBtn = document.getElementById('calendar-next');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentCalendarMonth--;
      if (currentCalendarMonth < 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
      }
      renderCalendar();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentCalendarMonth++;
      if (currentCalendarMonth > 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
      }
      renderCalendar();
    });
  }
  
  // Populate timezones
  populateTimezones();
  
  // Timezone change handler
  const timezoneSelect = document.getElementById('form-timezone');
  if (timezoneSelect) {
    timezoneSelect.addEventListener('change', (e) => {
      selectedTimezone = e.target.value;
      renderTimeSlots();
      updateAppointmentSummary();
    });
  }
  
  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('form-submit');
    const statusDiv = document.getElementById('form-status');
    const t = translations[currentLanguage].contact;
    
    // Bot Detection Checks
    const honeypotField = document.getElementById('form-website');
    if (honeypotField && honeypotField.value) {
      // Bot filled honeypot field
      console.warn('Bot detected: Honeypot field filled');
      statusDiv.className = 'form-status error';
      statusDiv.textContent = 'Submission blocked for security reasons.';
      statusDiv.style.display = 'block';
      return;
    }
    
    // Check time elapsed (too fast = bot, minimum 3 seconds)
    const formStartTime = parseInt(form.dataset.formStartTime || Date.now());
    const timeElapsed = Date.now() - formStartTime;
    if (timeElapsed < 3000) {
      console.warn('Bot detected: Form submitted too quickly');
      statusDiv.className = 'form-status error';
      statusDiv.textContent = 'Please take your time filling out the form.';
      statusDiv.style.display = 'block';
      return;
    }
    
    // Rate limiting: Check submissions in last hour
    const email = document.getElementById('form-email').value.trim();
    const lastSubmissionKey = 'vilostudios_contact_last_submission_' + btoa(email).replace(/[^a-zA-Z0-9]/g, '');
    const submissionCountKey = 'vilostudios_contact_submission_count_' + btoa(email).replace(/[^a-zA-Z0-9]/g, '');
    const lastSubmission = localStorage.getItem(lastSubmissionKey);
    const submissionCount = parseInt(localStorage.getItem(submissionCountKey) || '0');
    
    if (lastSubmission) {
      const timeSinceLastSubmission = Date.now() - parseInt(lastSubmission);
      const oneHour = 60 * 60 * 1000;
      
      if (timeSinceLastSubmission < oneHour) {
        if (submissionCount >= 3) {
          statusDiv.className = 'form-status error';
          statusDiv.textContent = 'Too many submissions. Please try again later.';
          statusDiv.style.display = 'block';
          return;
        }
      } else {
        // Reset counter after 1 hour
        localStorage.setItem(submissionCountKey, '0');
      }
    }
    
    // Validate scheduler
    if (!selectedDate || !selectedTime || !selectedTimezone) {
      statusDiv.className = 'form-status error';
      statusDiv.textContent = 'Please select a date, time, and timezone';
      statusDiv.style.display = 'block';
      return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = t.formSubmitting;
    statusDiv.style.display = 'none';
    
    const converted = convertCETToTimezone(selectedDate, selectedTime.hour, selectedTime.minute, selectedTimezone);
    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const formStartTime = parseInt(form.dataset.formStartTime || Date.now().toString());
    
    const formData = {
      name: document.getElementById('form-name').value,
      email: document.getElementById('form-email').value,
      inquiryType: document.getElementById('form-inquiry-type').value,
      appointmentDate: dateFormatter.format(selectedDate),
      appointmentTime: converted.formatted,
      appointmentTimeCET: `8:00 PM CET`,
      timezone: selectedTimezone,
      message: document.getElementById('form-message').value,
      form_start_time: Math.floor(formStartTime / 1000) // Send to backend for validation
    };
    
    try {
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `**New Schedule Request**\n\n**Name:** ${formData.name}\n**Email:** ${formData.email}\n**Inquiry Type:** ${formData.inquiryType || 'Not specified'}\n**Appointment Date:** ${formData.appointmentDate}\n**Appointment Time:** ${formData.appointmentTime}\n**Time (CET):** ${formData.appointmentTimeCET}\n**Timezone:** ${formData.timezone}\n**Message:**\n${formData.message}`,
          username: 'VILOSTUDIOS Contact Form'
        })
      });
      
      if (response.ok) {
        // Update rate limiting
        localStorage.setItem(lastSubmissionKey, Date.now().toString());
        localStorage.setItem(submissionCountKey, (submissionCount + 1).toString());
        
        statusDiv.className = 'form-status success';
        statusDiv.textContent = t.formSuccess;
        statusDiv.style.display = 'block';
        form.reset();
        // Reset form start time for next submission
        form.dataset.formStartTime = Date.now().toString();
        selectedDate = null;
        selectedTime = null;
        selectedTimezone = null;
        renderCalendar();
        renderTimeSlots();
        updateAppointmentSummary();
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      statusDiv.className = 'form-status error';
      statusDiv.textContent = t.formError;
      statusDiv.style.display = 'block';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = t.formSubmit;
    }
  });
}

// Stats Fetching
async function fetchStats() {
  try {
    // Try to fetch from API if available
    const response = await fetch('/api/stats.php');
    if (response.ok) {
      const data = await response.json();
      return { projects: data.projects || 2, staff: data.staff || 0 };
    }
  } catch (e) {
    // Fallback to default values
  }
  return { projects: 2, staff: 0 };
}

function updateStats() {
  fetchStats().then(stats => {
    const projectsEl = document.getElementById('stat-projects');
    const staffEl = document.getElementById('stat-staff');
    if (projectsEl) projectsEl.textContent = stats.projects;
    if (staffEl) staffEl.textContent = stats.staff;
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Initialize language
  currentLanguage = detectLanguage();
  setLanguage(currentLanguage);
  
  // Handle URL routing (hash-based for static sites)
  function handleRouting() {
    // Don't handle routing if we're already scrolling
    if (isScrolling) return;
    
    const hash = window.location.hash;
    
    // Handle login route
    if (hash === '#login') {
      window.location.href = 'login.html';
      return;
    }
    
    // Parse hash: #section/lang or #lang
    let section = 'home';
    let lang = null;
    
    if (hash) {
      // Remove # and split
      const hashParts = hash.substring(1).split('/');
      if (hashParts.length === 2) {
        section = hashParts[0];
        lang = hashParts[1];
      } else if (hashParts.length === 1) {
        // Check if it's a language code or section
        const part = hashParts[0];
        if (['en', 'jp', 'ja', 'zh', 'ch', 'eng'].includes(part.toLowerCase())) {
          lang = part.toLowerCase();
          section = 'home';
        } else if (['home', 'about', 'portfolio', 'contact'].includes(part)) {
          section = part;
        }
      }
      
      // Legacy format: #section-lang
      const legacyMatch = hash.match(/^#([a-z]+)-?(jp|eng|ch|en|ja|zh)?$/i);
      if (legacyMatch) {
        section = legacyMatch[1];
        if (legacyMatch[2]) {
          lang = legacyMatch[2];
        }
      }
    }
    
    // Set language if specified
    if (lang) {
      const langCode = lang === 'jp' || lang === 'ja' ? 'ja' : lang === 'ch' || lang === 'zh' ? 'zh' : 'en';
      if (langCode !== currentLanguage) {
        setLanguage(langCode);
      }
    }
    
    // Scroll to section only if it's different from current active section
    if (section && ['home', 'about', 'portfolio', 'contact'].includes(section) && section !== activeSection) {
      isUserScrolling = false; // This is a hash change, not user scrolling
      setTimeout(() => scrollToSection(section, false), 100);
    }
  }
  
  // Handle hash changes
  window.addEventListener('hashchange', () => {
    // Don't handle hash changes if we're programmatically scrolling
    if (isScrolling) return;
    
    const hash = window.location.hash;
    if (hash === '#login') {
      window.location.href = 'login.html';
      return;
    }
    handleRouting();
  });
  
  // Initial routing
  handleRouting();
  
  // Language switcher
  document.querySelectorAll('.lang-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      setLanguage(lang);
      const langCode = lang === 'ja' ? 'jp' : lang === 'zh' ? 'ch' : 'en';
      
      // Update URL hash using replaceState to avoid triggering hashchange
      const newHash = activeSection === 'home' ? `#${langCode}` : `#${activeSection}/${langCode}`;
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, '', newHash);
      }
    });
  });
  
  // Navigation links
  document.querySelectorAll('.nav-link[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      isUserScrolling = false; // This is a navigation click, not user scrolling
      scrollToSection(section, true);
    });
  });
  
  // Header auto-hide on inactivity
  let inactivityTimer = null;
  const navigation = document.querySelector('.navigation');
  
  function resetInactivityTimer() {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
    }
    
    // Show header
    if (navigation) {
      navigation.classList.remove('hidden');
    }
    
    // Hide after 5 seconds of inactivity
    inactivityTimer = setTimeout(() => {
      if (navigation) {
        navigation.classList.add('hidden');
      }
    }, 5000);
  }
  
  // Track user activity
  ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetInactivityTimer, { passive: true });
  });
  
  // Show header on hover
  if (navigation) {
    navigation.addEventListener('mouseenter', () => {
      navigation.classList.remove('hidden');
    });
  }
  
  // Initialize timer
  resetInactivityTimer();
  
  // Throttled scroll handler using requestAnimationFrame
  let scrollRafId = null;
  let lastScrollY = window.scrollY;
  
  function handleScroll() {
    // Don't handle scroll if we're programmatically scrolling
    if (isScrolling) {
      return;
    }
    
    // Mark as user scrolling
    isUserScrolling = true;
    
    // Clear any existing timeout
    if (scrollTimeout) {
      clearTimeout(scrollTimeout);
    }
    
    // Reset user scrolling flag after scroll stops (longer delay to prevent conflicts)
    scrollTimeout = setTimeout(() => {
      isUserScrolling = false;
    }, 300);
    
    if (scrollRafId) {
      return;
    }
    
    scrollRafId = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY || window.pageYOffset;
      
      // Only update if scroll position actually changed significantly
      if (Math.abs(currentScrollY - lastScrollY) > 5) {
        // Don't update hash during user scrolling - only update nav active state
        updateActiveSection(false);
        updateAnimatedTitleOpacity();
        resetInactivityTimer(); // Reset timer on scroll
        lastScrollY = currentScrollY;
      }
      
      scrollRafId = null;
    });
  }
  
  // Animated title fade on scroll
  function updateAnimatedTitleOpacity() {
    const animatedTitle = document.querySelector('.animated-title-container');
    if (!animatedTitle) return;
    
    const scrollY = window.scrollY || window.pageYOffset;
    
    // Start fading after 100px of scroll, fully fade out by 500px
    const fadeStart = 100;
    const fadeEnd = 500;
    
    let opacity = 1;
    if (scrollY > fadeStart) {
      const fadeRange = fadeEnd - fadeStart;
      const scrollProgress = Math.min((scrollY - fadeStart) / fadeRange, 1);
      opacity = 1 - scrollProgress;
    }
    
    animatedTitle.style.opacity = Math.max(0, opacity);
  }
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  updateActiveSection();
  updateAnimatedTitleOpacity(); // Set initial opacity
  
  // Initialize background video
  initBackgroundVideo();
  
  // Initialize contact form
  initContactForm();
  
  // Update stats
  updateStats();
  
  // Handle initial hash
  const hash = window.location.hash;
  if (hash && hash !== '#login') {
    const match = hash.match(/^#([a-z]+)-?(jp|eng|ch|en|ja|zh)?$/i);
    if (match) {
      const section = match[1];
      if (['home', 'about', 'portfolio', 'contact'].includes(section)) {
        isUserScrolling = false; // This is initial load, not user scrolling
        setTimeout(() => scrollToSection(section, false), 300);
      }
    }
  }

  // Check login state and show user profile
  function checkLoginState() {
    const userData = JSON.parse(localStorage.getItem('vilostudios_user') || 'null');
    const userProfileNav = document.getElementById('user-profile-nav');
    const navLoginButton = document.getElementById('nav-login-button');
    
    if (userData) {
      // Check for session expiration (24 hours)
      if (userData.loginTime) {
        const loginTime = new Date(userData.loginTime);
        const now = new Date();
        const hoursSinceLogin = (now - loginTime) / (1000 * 60 * 60);
        
        if (hoursSinceLogin > 24) {
          // Session expired
          localStorage.removeItem('vilostudios_user');
          if (userProfileNav) userProfileNav.style.display = 'none';
          if (navLoginButton) navLoginButton.style.display = 'flex';
          return;
        }
      }
      
      // Show user profile
      if (userProfileNav) {
        userProfileNav.style.display = 'flex';
        const userName = userData.name || userData.email?.split('@')[0] || 'User';
        const userInitial = userName.charAt(0).toUpperCase();
        const userRole = userData.role || 'user';
        const roleName = userRole.charAt(0).toUpperCase() + userRole.slice(1).replace('_', ' ');
        
        const avatar = document.getElementById('nav-user-avatar');
        const name = document.getElementById('nav-user-name');
        
        if (avatar) avatar.textContent = userInitial;
        if (name) name.textContent = `${userName.split(' ')[0]} ${roleName}`;
      }
      
      if (navLoginButton) navLoginButton.style.display = 'none';
    } else {
      if (userProfileNav) userProfileNav.style.display = 'none';
      if (navLoginButton) navLoginButton.style.display = 'flex';
    }
  }
  
  // Check login state on page load
  checkLoginState();
  
  // Listen for storage changes (when user logs in/out in another tab)
  window.addEventListener('storage', checkLoginState);
});

