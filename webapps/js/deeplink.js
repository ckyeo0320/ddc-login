// JavaScript Document
LANDING_REDIRECT = window.location.protocol + "//" + window.location.hostname + '/?link=landed';
DESKTOP_REDIRECT = "https://apps.facebook.com/doubledowncasino/?";
INSTALL_APPLE    = "https://doubledown.onelink.me/LFGl/gw8klgza";   // Replaced to appsflyer onelink URL -- https://itunes.apple.com/app/doubledown/id485126024?mt=8
INSTALL_GOOGLE   = "https://doubledown.onelink.me/LFGl/cdqsqm5r";   // Replaced to appsflyer onelink URL -- https://play.google.com/store/apps/details?id=com.ddi
INSTALL_AMZN     = "http://www.amazon.com/gp/mas/dl/android?p=com.ddi";
MOBILE_LAUNCH    = 'ddc://applink/?scene=';
IOS_TAP_TO_PLAY  = '/landing/now?scene=';

SUPPORTED_LANGUAGES = ['en','de','fr','es','it','pt'];

// Images based on language and class names
DYNAMIC_IMAGES   = [
    {name: 'login-facebook', image: 'https://static.doubledowncasino2.com/play/img/{lang}/step-download.png'},
    {name: 'login-guest', image: 'https://static.doubledowncasino2.com/play/img/{lang}/step-play.png'},
    {name: 'and-image', image: 'https://static.doubledowncasino2.com/play/img/{lang}/and.png'}
];

DYNAMIC_TEXT = [
    {name: 'text-tagline', text: {
        en: 'Where the World Plays',
        de: 'Wo die ganze Welt spielt',
        fr: 'OÃƒÂ¹ le monde joue',
        es: 'Donde el Mundo Juega',
        it: 'Dove Gioca il Mondo',
        pt: 'O mundo inteiro joga aqui'
    }},
    {name: 'text-mobile', text: {
        en: 'Available on Mobile',
        de: 'VerfÃƒÂ¼gbar auf dem MobilgerÃƒÂ¤t',
        fr: 'Disponible sur mobile',
        es: 'Disponible para dispositivos mÃƒÂ³viles',
        it: 'Disponibile su dispositivi mobili',
        pt: 'DisponÃƒÂ­vel em versÃƒÂ£o mÃƒÂ³vel'
    }},
];

function isFacebookApp() {
  var ua = navigator.userAgent || navigator.vendor || window.opera;
  return (ua.indexOf("FBAN") > -1) || (ua.indexOf("FBAV") > -1);
}

Device = function() {
    this.md = new MobileDetect(window.navigator.userAgent);
};

Page = function() {
    this.cid = this.getParam('cid');
    this.pid = this.getParam('pid');
    this.feature = this.getParam('feature');
    this.game = this.getParam('game');
    this.variant = this.getParam('variant');
    this.lineCost = this.getParam('lineCost');
    this.deepLink = this.getParam('link');
    this.isLanding = this.deepLink === null || this.deepLink === 'landed';
    this.lobby = this.getParam('lobby');
    this.tournamentGameIdentifier = this.getParam('tournamentGameIdentifier');
    this.entryCost = this.getParam('entryCost');
    this.tournamentType = this.getParam('tournamentType');
    this.showLoyaltyInvite = this.getParam('showLoyaltyInvite');
    this.showLoyaltyEmail = this.getParam('showLoyaltyInvite');
    this.language = navigator.languages? navigator.languages[0] : (navigator.language || navigator.userLanguage);
    this.emailVerifyToken = this.getParam('emailVerifyToken');
    this.e_msg_key = this.getParam('e_msg_key');

    if (!this.isLanding){
        localStorage.setItem('sceneDeepLink', this.deepLink);
    } else {
        if ( isFacebookApp() ) {
            this.deepLink = this.getParam('extra');
        } else {
            this.deepLink = localStorage.getItem('sceneDeepLink');
        }
    }

    // Determine language for localized assets
    if (this.language && this.language.match(/\w\w-\w\w/)) {
        this.language = this.language.split('-')[0];
    } else {
         this.language = 'en';
    }

    // Force language if in URL
    if (this.getParam('language')) {
        this.language = this.getParam('language');
    }

    // Default if language is not supported
    if (SUPPORTED_LANGUAGES.indexOf(this.language) < 0) {
        this.language = 'en';
    }
};

Page.prototype = {
    /**
     * Recompose desktop redirect with cid and pid if they exist
     */
    composeUrlParams: function() {
        var params = '';
        if (this.pid) {
            params = '&pid='+this.pid;
        }
        if (this.cid){
            params+= '&cid='+this.cid;
        }
        if (this.feature){
            params+= '&feature='+this.feature;
        }
        if (this.showLoyaltyInvite){
            params+= '&showLoyaltyInvite='+this.showLoyaltyInvite;
        }
        if (this.showLoyaltyEmail){
            params+= '&showLoyaltyEmail='+this.showLoyaltyEmail;
        }
        if (applaunching_skey != '') {
        	params+= '&a_l_skey='+applaunching_skey;
        }
        if (this.emailVerifyToken) {
        	params+= '&e_v_token='+this.emailVerifyToken;
        }
        if (this.e_msg_key) {
            params+= '&e_msg_key='+this.e_msg_key;
        }
        return params;
    },

    composeDeepLinkParams: function() {
    	var result = page.deepLink;

    	if (applaunching_skey != '') {
    		result += ".a_l_skey-" + applaunching_skey;
    	}
    	if (this.emailVerifyToken) {
    		result += '.e_v_token-' + this.emailVerifyToken;
        }
        if (this.e_msg_key) {
            result += '.e_msg_key-' + this.e_msg_key;
        }

    	return result;
    },

    /**
     * Opens the deep link or redirects
     */
    openLink: function() {
        if (device.isMobile()) {
            window.location.href = MOBILE_LAUNCH + this.composeDeepLinkParams();
            //window.location.href = MOBILE_LAUNCH + page.deepLink;
            // setTimeout("page.openLanding()", 500);
        } else {
        	// support ipad os desktop mode
        	var isIpad = false;
        	try {
        		ua = window.navigator.userAgent.toLowerCase();
        		isIpad = ua.indexOf('ipad') > -1 || (!ua.match("iphone") && navigator.maxTouchPoints > 1 && ua.indexOf('macintosh') > -1 && 'ontouchend' in document);
        		if(isIpad) {
        			window.location.href = MOBILE_LAUNCH + this.composeDeepLinkParams();
        			setTimeout(page.goDesktopPage, 500)
        		}
        	}
        	catch(e) {}
        	if(isIpad == false) {
        		page.goDesktopPage();
        	}
        }
    },

    goDesktopPage() {
    	if (page.variant && page.lineCost && page.game) {
			window.location.href = DESKTOP_REDIRECT + 'game='+page.game+'&variant='+page.variant+'&lineCost='+page.lineCost + page.composeUrlParams();
		} else if (page.tournamentGameIdentifier && page.lobby  && page.entryCost && page.tournamentType) {
			window.location.href = DESKTOP_REDIRECT + 'lobby='+page.lobby+'&tournamentGameIdentifier='+page.tournamentGameIdentifier+'&tournamentType='+page.tournamentType +'&entry='+page.entryCost + page.composeUrlParams();
		} else if (page.lobby) {
			window.location.href = DESKTOP_REDIRECT + 'lobby=' + page.lobby + page.composeUrlParams();
		} else {
			window.location.href = DESKTOP_REDIRECT + page.composeUrlParams();
		}
    },

    /**
     * Display (unhide) the marketing landing page
     */
    showLanding: function() {
    	if (device.isMobile()) {
	        document.getElementById('landing').className = "show";
	        this.fillLinks();
	        this.insertLocalizedText();
	        this.insertLocalizedImages();
    	}
    },

    /**
     * Sets the install and app opening links
     */
    fillLinks: function() {
        var installLinkElement = document.getElementById('install-link');
        var playLinkElement = document.getElementById('play-link');
        //var playLink = IOS_TAP_TO_PLAY + page.deepLink;
        //var playLink = isFacebookApp()? 'http://play.doubledowncasino2.com/?scene=' + page.deepLink : IOS_TAP_TO_PLAY + page.deepLink;
        var playLink = isFacebookApp()? 'http://play.doubledowncasino2.com/?scene=' + this.composeDeepLinkParams() : IOS_TAP_TO_PLAY + this.composeDeepLinkParams();

        if (device.getOS() != 'iOS') {
            playLink = MOBILE_LAUNCH + this.composeDeepLinkParams();
            //playLink = MOBILE_LAUNCH + page.deepLink;
        }
        var installLink = INSTALL_APPLE;

        if (device.getDevice() == 'Kindle') {
            installLink = INSTALL_AMZN;
        } else if (device.getOS() != 'iOS') {
            installLink = INSTALL_GOOGLE;
        }

        installLinkElement.href = installLink;
        playLinkElement.href = playLink;
    },

    /**
     * Fill images dynamically using language
     */
    insertLocalizedImages: function() {
        for (var i = 0; i < DYNAMIC_IMAGES.length; i++) {
            var elements = document.getElementsByClassName(DYNAMIC_IMAGES[i].name);
            for (var e = 0; e < elements.length; e++) {
                elements[e].style.background = "url(" + DYNAMIC_IMAGES[i].image.replace('{lang}',this.language) + ")";
            }
        }
    },

    /**
     * Fill text dynamically using language
     */
    insertLocalizedText: function() {
        for (var i = 0; i < DYNAMIC_TEXT.length; i++) {
            var elements = document.getElementsByClassName(DYNAMIC_TEXT[i].name);
            for (var e = 0; e < elements.length; e++) {
                elements[e].innerHTML = DYNAMIC_TEXT[i].text[this.language];
            }
        }
    },

    /**
     * Opens the landing page after the app link as been given a chance to open
     */
    openLanding: function() {
        if ( isFacebookApp() ) {
            window.location.href = LANDING_REDIRECT + "&language=" + this.language + "&extra=" + encodeURIComponent(this.deepLink);
        } else {
            window.location.href = LANDING_REDIRECT + "&language=" + this.language;
        }
    },

    /**
     * @returns {string} Parameter from URL
     */
    getParam: function(param) {
        var result = null,
            tmp = [],
            params = location.search.substr(1).split("&");

        for (var i = 0; i < params.length; i++) {
            tmp = params[i].split("=");
            if (tmp[0] === param) result = decodeURIComponent(tmp[1]);
        }

        return result;
    }
};

Device.prototype = {
    /**
     * @returns {string} Device type
     */
    getDevice: function() {
        return this.md.mobile();
    },

    /**
     * @returns {string} Operating system
     */
    getOS: function() {
        return this.md.os();
    },

    /**
     * @returns {string} Phone type
     */
    getPhone: function() {
        return this.md.phone();
    },

    /**
     * @returns {string} Build version
     */
    getBuild: function() {
        return this.md.versionStr('Build');
    },

    /**
     * @returns {boolean} Is a mobile device
     */
    isMobile: function() {
        return this.md.mobile() !== null;
    }
};