// Template version 1.0.0 - Inlined for performance and reliability
export const EMBED_TEMPLATE: string = `<body>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>XR Immersive Store Embed</title>
    <style>
        /* Reset and base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        .xr-store-container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 80px 20px;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #ffffff;
        }

        .xr-store-header {
            text-align: center;
            margin-bottom: 48px;
        }

        .xr-store-title {
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 24px;
            line-height: 1.1;
        }

        .xr-store-accent {
            color: #3b82f6;
        }

        .xr-store-description {
            font-size: 1.25rem;
            color: #6b7280;
            max-width: 768px;
            margin: 0 auto;
            line-height: 1.6;
        }

        .xr-iframe-wrapper {
            position: relative;
            background: linear-gradient(145deg, #f3f4f6, #e5e7eb);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            margin-bottom: 48px;
        }

        .xr-iframe-container {
            position: relative;
            width: 100%;
            /* Default to portrait mode (9:16) for mobile-first approach */
            aspect-ratio: 9/16;
        }

        /* Desktop and tablet: switch to landscape mode */
        @media (min-width: 768px) {
            .xr-iframe-container {
                aspect-ratio: 16/9;
            }
        }

        .xr-iframe {
            width: 100%;
            height: 100%;
            border: none;
            display: block;
        }

        .xr-live-indicator {
            position: absolute;
            top: 16px;
            right: 16px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(8px);
            padding: 8px 16px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
            z-index: 10;
        }

        .xr-pulse-dot {
            width: 8px;
            height: 8px;
            background-color: #10b981;
            border-radius: 50%;
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }

        .xr-store-footer {
            text-align: center;
        }

        .xr-footer-text {
            color: #6b7280;
            margin-bottom: 4px;
            font-size: 1rem;
        }

        .xr-button-group {
            display: flex;
            flex-direction: column;
            gap: 16px;
            justify-content: center;
            align-items: center;
        }

        @media (min-width: 640px) {
            .xr-button-group {
                flex-direction: row;
            }
        }

        .xr-button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 32px;
            font-size: 1rem;
            font-weight: 500;
            border-radius: 8px;
            text-decoration: none;
            transition: all 0.2s ease-in-out;
            cursor: pointer;
            border: none;
            font-family: inherit;
        }

        .xr-button-primary {
            background-color: #3b82f6;
            color: white;
        }

        .xr-button-primary:hover {
            background-color: #2563eb;
            transform: translateY(-1px);
        }

        .xr-button-secondary {
            background-color: transparent;
            color: #3b82f6;
            border: 2px solid #3b82f6;
        }

        .xr-button-secondary:hover {
            background-color: #3b82f6;
            color: white;
            transform: translateY(-1px);
        }

        .xr-icon {
            width: 16px;
            height: 16px;
        }

        /* Loading state */
        .xr-loading {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #6b7280;
            font-size: 1rem;
            text-align: center;
        }

        .xr-spinner {
            width: 32px;
            height: 32px;
            border: 3px solid #e5e7eb;
            border-top: 3px solid #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 16px;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Error state */
        .xr-error {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            color: #ef4444;
            font-size: 1rem;
        }

        /* Mobile-specific optimizations */
        @media (max-width: 767px) {
            .xr-store-container {
                padding: 40px 16px;
            }

            .xr-store-header {
                margin-bottom: 32px;
            }

            .xr-store-title {
                font-size: clamp(1.8rem, 6vw, 2.5rem);
            }

            .xr-store-description {
                font-size: 1.1rem;
            }

            .xr-iframe-wrapper {
                border-radius: 12px;
                margin-bottom: 32px;
            }

            .xr-live-indicator {
                top: 12px;
                right: 12px;
                padding: 6px 12px;
                font-size: 0.8rem;
            }

            .xr-button {
                width: 100%;
                justify-content: center;
                padding: 16px 24px;
                font-size: 1.1rem;
            }

            .xr-footer-text {
                font-size: 0.9rem;
            }
        }

        /* Extra small mobile devices */
        @media (max-width: 480px) {
            .xr-store-container {
                padding: 24px 12px;
            }

            .xr-store-title {
                font-size: clamp(1.5rem, 7vw, 2rem);
                margin-bottom: 16px;
            }

            .xr-store-description {
                font-size: 1rem;
            }

            .xr-iframe-wrapper {
                border-radius: 8px;
                margin-bottom: 24px;
            }

            .xr-live-indicator {
                top: 8px;
                right: 8px;
                padding: 4px 8px;
                font-size: 0.75rem;
            }

            .xr-pulse-dot {
                width: 6px;
                height: 6px;
            }

            .xr-button {
                padding: 14px 20px;
                font-size: 1rem;
            }

            .xr-icon {
                width: 14px;
                height: 14px;
            }
        }

        /* Landscape mobile orientation - keep portrait aspect ratio */
        @media (max-width: 767px) and (orientation: landscape) and (max-height: 500px) {
            .xr-store-container {
                padding: 20px 16px;
            }

            .xr-store-header {
                margin-bottom: 24px;
            }

            .xr-store-title {
                font-size: clamp(1.5rem, 4vw, 2rem);
                margin-bottom: 16px;
            }

            .xr-store-description {
                font-size: 1rem;
            }

            .xr-iframe-wrapper {
                margin-bottom: 24px;
            }

            .xr-button-group {
                flex-direction: row;
                gap: 12px;
            }

            .xr-button {
                width: auto;
                padding: 12px 20px;
                font-size: 0.9rem;
            }
        }

        /* Full-screen mobile styles */
        .xr-mobile-fullscreen {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 9999 !important;
            background: #000 !important;
            border-radius: 0 !important;
            margin: 0 !important;
        }

        .xr-mobile-fullscreen .xr-iframe-container {
            aspect-ratio: unset !important;
            height: 100vh !important;
        }

        .xr-mobile-fullscreen .xr-live-indicator {
            top: 20px !important;
            right: 20px !important;
        }

        /* Exit fullscreen button for mobile */
        .xr-exit-fullscreen {
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 8px;
            padding: 12px;
            cursor: pointer;
            z-index: 10001;
            display: none;
        }

        .xr-mobile-fullscreen .xr-exit-fullscreen {
            display: block;
        }

        /* High DPI displays */
        @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            .xr-iframe-wrapper {
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
            }
        }

        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .xr-store-container {
                background-color: #1a1a1a;
            }

            .xr-store-title {
                color: #ffffff;
            }

            .xr-store-description, .xr-footer-text {
                color: #d1d5db;
            }

            .xr-iframe-wrapper {
                background: linear-gradient(145deg, #2d2d2d, #1a1a1a);
            }
        }
    </style>

    <div class="xr-store-container">
        <div class="xr-store-header">
            <h2 class="xr-store-title">
                Enter Our
                <span class="xr-store-accent">Immersive Store</span>
            </h2>
            <p class="xr-store-description">
                Step into the future of luxury shopping with our revolutionary 3D immersive experience. 
            </p>
        </div>
        
        <div class="xr-iframe-wrapper" id="xr-iframe-wrapper">
            <button class="xr-exit-fullscreen" id="xr-exit-fullscreen" onclick="exitMobileFullscreen()">
                <svg width="20" height="20" fill="none" stroke="currentColor" viewbox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
            <div class="xr-iframe-container">
                <div class="xr-loading" id="xr-loading">
                    <div class="xr-spinner"></div>
                    Loading immersive store...
                </div>
                <div class="xr-error" id="xr-error" style="display: none;">
                    Failed to load store. Please check your connection and try again.
                </div>
                <iframe id="xr-iframe" src="BRAND_URL_PLACEHOLDER" class="xr-iframe" title="XR Immersive Shopping Store" allowfullscreen loading="lazy" style="opacity: 0;">
                </iframe>
            </div>
        </div>
        
        <div class="xr-store-footer">
            <p class="xr-footer-text">
                Can't see the store? Make sure your browser supports WebGL and has JavaScript enabled.
            </p>
        </div>
    </div>

    <script>
        // Enhanced iframe management with mobile optimization
        class XrIframeManager {
            constructor() {
                this.iframe = document.getElementById('xr-iframe');
                this.loading = document.getElementById('xr-loading');
                this.error = document.getElementById('xr-error');
                this.wrapper = document.getElementById('xr-iframe-wrapper');
                this.loadTimeout = null;
                this.retryCount = 0;
                this.maxRetries = 3;
                this.isMobile = this.detectMobile();
                this.isFullscreen = false;
                
                this.init();
            }
            
            init() {
                this.setupEventListeners();
                this.startLoadTimeout();
                this.optimizeForMobile();
                this.setupOrientationHandler();
            }
            
            detectMobile() {
                const userAgent = navigator.userAgent.toLowerCase();
                const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
                return isMobileUA || window.innerWidth < 768;
            }
            
            optimizeForMobile() {
                if (this.isMobile) {
                    this.iframe.setAttribute('scrolling', 'no');
                    this.iframe.setAttribute('seamless', 'seamless');
                    
                    // Update button text for mobile
                    const fullscreenText = document.querySelector('.xr-fullscreen-text');
                    if (fullscreenText) {
                        fullscreenText.textContent = 'Immersive View';
                    }
                }
            }
            
            setupOrientationHandler() {
                window.addEventListener('orientationchange', () => {
                    setTimeout(() => {
                        this.handleOrientationChange();
                    }, 100);
                });
                
                window.addEventListener('resize', () => {
                    this.handleResize();
                });
            }
            
            handleOrientationChange() {
                // Mobile portrait aspect ratio is maintained by CSS
                // This function can be extended for additional orientation handling
                this.isMobile = this.detectMobile();
            }
            
            handleResize() {
                const wasMobile = this.isMobile;
                this.isMobile = this.detectMobile();
                
                if (wasMobile !== this.isMobile) {
                    this.optimizeForMobile();
                }
            }
            
            setupEventListeners() {
                this.iframe.addEventListener('load', () => {
                    this.handleLoadSuccess();
                });
                
                this.iframe.addEventListener('error', () => {
                    this.handleLoadError();
                });
                
                // Handle touch events for mobile
                if (this.isMobile) {
                    this.wrapper.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
                }
            }
            
            handleTouchStart(e) {
                // Prevent accidental scrolling when interacting with iframe
                if (e.target === this.iframe) {
                    e.preventDefault();
                }
            }
            
            startLoadTimeout() {
                this.loadTimeout = setTimeout(() => {
                    if (this.iframe.style.opacity === '0') {
                        this.handleLoadError();
                    }
                }, 15000);
            }
            
            handleLoadSuccess() {
                if (this.loadTimeout) {
                    clearTimeout(this.loadTimeout);
                }
                
                this.loading.style.display = 'none';
                this.error.style.display = 'none';
                this.iframe.style.opacity = '1';
                this.iframe.style.transition = 'opacity 0.5s ease-in-out';
                
                // Send mobile optimization message to iframe if possible
                try {
                    if (this.isMobile) {
                        this.iframe.contentWindow.postMessage({
                            type: 'MOBILE_OPTIMIZED',
                            orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
                        }, '*');
                    }
                } catch (e) {
                    // Cross-origin restriction - expected
                }
            }
            
            handleLoadError() {
                if (this.loadTimeout) {
                    clearTimeout(this.loadTimeout);
                }
                
                if (this.retryCount < this.maxRetries) {
                    this.retryLoad();
                } else {
                    this.loading.style.display = 'none';
                    this.error.style.display = 'block';
                }
            }
            
            retryLoad() {
                this.retryCount++;
                
                this.iframe.style.opacity = '0';
                this.loading.style.display = 'block';
                this.error.style.display = 'none';
                
                const originalSrc = this.iframe.src.split('?')[0];
                this.iframe.src = originalSrc + '?t=' + Date.now() + '&mobile=' + (this.isMobile ? '1' : '0');
                
                this.startLoadTimeout();
            }
        }
        
        // Mobile-optimized fullscreen functionality
        function openFullscreen() {
            const iframe = document.getElementById('xr-iframe');
            const isMobile = window.innerWidth < 768;
            
            if (isMobile) {
                // Use custom mobile fullscreen
                enterMobileFullscreen();
            } else {
                // Use native fullscreen API for desktop
                if (iframe.requestFullscreen) {
                    iframe.requestFullscreen();
                } else if (iframe.webkitRequestFullscreen) {
                    iframe.webkitRequestFullscreen();
                } else if (iframe.msRequestFullscreen) {
                    iframe.msRequestFullscreen();
                } else {
                    window.open('BRAND_URL_PLACEHOLDER', '_blank', 'width=1200,height=800');
                }
            }
        }
        
        function enterMobileFullscreen() {
            const wrapper = document.getElementById('xr-iframe-wrapper');
            const body = document.body;
            
            wrapper.classList.add('xr-mobile-fullscreen');
            body.style.overflow = 'hidden';
            
            // Lock orientation if possible
            if (screen.orientation && screen.orientation.lock) {
                try {
                    screen.orientation.lock('portrait-primary').catch(() => {
                        // Orientation lock failed, continue anyway
                    });
                } catch (e) {
                    // Orientation API not supported
                }
            }
            
            window.xrIframeManager.isFullscreen = true;
        }
        
        function exitMobileFullscreen() {
            const wrapper = document.getElementById('xr-iframe-wrapper');
            const body = document.body;
            
            wrapper.classList.remove('xr-mobile-fullscreen');
            body.style.overflow = '';
            
            // Unlock orientation
            if (screen.orientation && screen.orientation.unlock) {
                try {
                    screen.orientation.unlock();
                } catch (e) {
                    // Orientation API not supported
                }
            }
            
            window.xrIframeManager.isFullscreen = false;
        }
        
        // Handle escape key and back button
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && window.xrIframeManager && window.xrIframeManager.isFullscreen) {
                exitMobileFullscreen();
            }
            
            if (e.key === 'f' || e.key === 'F') {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    openFullscreen();
                }
            }
        });
        
        // Handle mobile back button
        window.addEventListener('popstate', function(e) {
            if (window.xrIframeManager && window.xrIframeManager.isFullscreen) {
                exitMobileFullscreen();
                history.pushState(null, '', location.href);
            }
        });
        
        // Initialize when DOM is ready
        document.addEventListener('DOMContentLoaded', function() {
            window.xrIframeManager = new XrIframeManager();
            
            // Add history state for mobile back button handling
            history.pushState(null, '', location.href);
        });
        
        // Optimize iframe performance with mobile considerations
        const optimizeIframe = () => {
            const iframe = document.getElementById('xr-iframe');
            const isMobile = window.innerWidth < 768;
            
            // Mobile-specific optimizations
            if (isMobile) {
                iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock allow-orientation-lock');
            } else {
                iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock');
            }
            
            iframe.setAttribute('importance', 'high');
            
            // Preload connection
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = 'BRAND_URL_PLACEHOLDER';
            document.head.appendChild(link);
            
            // Add DNS prefetch for mobile performance
            const dnsPrefetch = document.createElement('link');
            dnsPrefetch.rel = 'dns-prefetch';
            dnsPrefetch.href = 'BRAND_URL_PLACEHOLDER';
            document.head.appendChild(dnsPrefetch);
        };
        
        window.addEventListener('load', optimizeIframe);
    </script>
</body>`;
