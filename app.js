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
      formPreferredDate: 'Preferred Date',
      formPreferredTime: 'Preferred Time',
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
      formPreferredDate: '希望日',
      formPreferredTime: '希望時間',
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
      formPreferredDate: '首选日期',
      formPreferredTime: '首选时间',
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
  
  video1.style.opacity = '1';
  video1.style.zIndex = '0';
  video2.style.opacity = '0';
  video2.style.zIndex = '1';
  
  // Remove any existing event listeners
  video1.removeEventListener('ended', handleVideoEnded);
  video2.removeEventListener('ended', handleVideoEnded);
  
  loadAndPlayVideo(video1, videoSources[0]).then(() => {
    video1.addEventListener('ended', handleVideoEnded, { once: false });
  });
}

function ensureNoLoop(video) {
  video.loop = false;
  video.removeAttribute('loop');
}

function loadAndPlayVideo(video, src) {
  return new Promise((resolve, reject) => {
    // Pause and reset video first
    video.pause();
    video.currentTime = 0;
    ensureNoLoop(video);
    
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
        video.play().then(() => {
          if (!resolved) {
            resolved = true;
            if (video === activeVideo) {
              video.style.opacity = '1';
              video.style.zIndex = '0';
            }
            resolve();
          }
        }).catch((err) => {
          if (!resolved) {
            resolved = true;
            reject(err);
          }
        });
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
      inactive.play().catch(() => {});
      
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

function updateActiveSection() {
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
          
          // Update URL hash to reflect current section
          const langCode = currentLanguage === 'ja' ? 'jp' : currentLanguage === 'zh' ? 'ch' : 'en';
          window.location.hash = section === 'home' ? `#${langCode}` : `#${section}/${langCode}`;
          
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

function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // Update URL hash (works without server-side routing)
    const langCode = currentLanguage === 'ja' ? 'jp' : currentLanguage === 'zh' ? 'ch' : 'en';
    window.location.hash = id === 'home' ? `#${langCode}` : `#${id}/${langCode}`;
    
    // Update page title
    const sectionNames = {
      home: 'Home',
      about: 'About',
      portfolio: 'Portfolio',
      contact: 'Contact'
    };
    document.title = `${sectionNames[id] || 'Home'} - VILOSTUDIOS`;
  }
}

// Contact Form
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1431297607623246016/QFnruCHzMVOdbMsyYtdp7iy3rlFMU7qBkmEo787GwZoBzggrgaZEmYFbXytmDaqY1_NI';

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  // Set min date to today
  const dateInput = document.getElementById('form-date');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
  }
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('form-submit');
    const statusDiv = document.getElementById('form-status');
    const t = translations[currentLanguage].contact;
    
    submitBtn.disabled = true;
    submitBtn.textContent = t.formSubmitting;
    statusDiv.style.display = 'none';
    
    const formData = {
      name: document.getElementById('form-name').value,
      email: document.getElementById('form-email').value,
      inquiryType: document.getElementById('form-inquiry-type').value,
      preferredDate: document.getElementById('form-date').value,
      preferredTime: document.getElementById('form-time').value,
      message: document.getElementById('form-message').value
    };
    
    try {
      const response = await fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `**New Schedule Request**\n\n**Name:** ${formData.name}\n**Email:** ${formData.email}\n**Inquiry Type:** ${formData.inquiryType || 'Not specified'}\n**Preferred Date:** ${formData.preferredDate || 'Not specified'}\n**Preferred Time:** ${formData.preferredTime || 'Not specified'}\n**Message:**\n${formData.message}`,
          username: 'VILOSTUDIOS Contact Form'
        })
      });
      
      if (response.ok) {
        statusDiv.className = 'form-status success';
        statusDiv.textContent = t.formSuccess;
        statusDiv.style.display = 'block';
        form.reset();
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
    
    // Scroll to section
    if (section && ['home', 'about', 'portfolio', 'contact'].includes(section)) {
      setTimeout(() => scrollToSection(section), 100);
    }
  }
  
  // Handle hash changes
  window.addEventListener('hashchange', () => {
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
      
      // Update URL hash
      window.location.hash = activeSection === 'home' ? `#${langCode}` : `#${activeSection}/${langCode}`;
    });
  });
  
  // Navigation links
  document.querySelectorAll('.nav-link[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      scrollToSection(section);
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
    if (scrollRafId) return;
    
    scrollRafId = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY || window.pageYOffset;
      
      // Only update if scroll position actually changed
      if (Math.abs(currentScrollY - lastScrollY) > 0.5) {
        updateActiveSection();
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
  if (hash) {
    const match = hash.match(/^#([a-z]+)-?(jp|eng|ch|en|ja|zh)?$/i);
    if (match) {
      const section = match[1];
      setTimeout(() => scrollToSection(section), 300);
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

