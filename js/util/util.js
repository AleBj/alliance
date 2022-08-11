import URLPoly from '../libs/url-polyfill.min.js';

function smoothstep (min, max, x) {
  if ( x <= min ) return min;
  if ( x >= max ) return max;

  x = ( x - min ) / ( max - min );

  return x * x * ( 3 - 2 * x );
}
function parabola (x) {
  return 1 -(Math.pow(-0.5 + x, 2)) / 0.25;
}
function map(value, min1, max1, min2, max2) {
  return min2 + (max2 - min2) * ((value - min1) / (max1 - min1));
}
function isArabic() {
  const el = document.querySelector('html');
  return el.getAttribute('lang') === 'ar' || el.getAttribute('dir') === 'rtl';
}
function getLang() {
  const el = document.querySelector('html');
  return el.getAttribute('lang');
}
function waitForLoader(cb) {
  if(document.documentElement.getAttribute('data-custom-loaded')) {
    cb();
  }else {
    window.addEventListener('customload', () => {
      cb();
    });
  }
}
function waitForSound(cb) {
  if(document.documentElement.getAttribute('data-sound-ready')) {
    cb();
  }else {
    window.addEventListener('soundready', () => {
      cb();
    });
  }
}
function canAutoplay(cb) {
  new Audio('./assets/audio/test.mp3').play().then(() => {
    cb(true);
  }).catch(() => {
    cb(false);
  });
}
function isInViewportDom($el, offset) {
  var rect = $el.getBoundingClientRect();
  var x, y, w, h;
  x = rect.left;
  y = rect.top + (offset !== undefined ? offset : 0);

  w = rect.width;
  h = rect.height;

  var ww = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var hw = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  return ((y < hw && y + h > 0) && (x < ww && x + w > 0));
}
function getPosition(element) {
  var xPosition = 0;
  var yPosition = 0;

  while (element) {
    xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
    yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
    element = element.offsetParent;
  }

  return { x: xPosition, y: yPosition };
}
function round(number, r) {
  var r = r ? Math.pow(10, r) : 1e3;
  return Math.round(number * r) / r;
}
function lerp(from, to, t) {
  return (1 - t) * from + t * to;
}
function random(min, max) {
  return Math.random() * (max - min) + min;
}
var ease = {
  bounce: function (t) {
    var p = 0.3;
    return Math.pow(2, -10 * t) * Math.sin((t - p / 4) * (2 * Math.PI) / p) + 1;
  },
  out: function (t) {
    return 1 - (--t) * t * t * t
  },
  inQuint: function (t) {
    return t*t*t*t*t*t*t*t*t*t*t*t*t
  },
  easeInCirc: function (t) {
    return 1 - Math.sqrt(1 - Math.pow(t, 2));
  },
  easeInOutCirc(x) {
    return -(Math.cos(PI * x) - 1) / 2;
  },
  out2: function (t) {
    return t*(2-t)
  }
};
function getEmbedURL(url, getId) {
  var id;
  if (url.search && url.search(/\/\/www.youtube.com|\/\/youtube.com|\/\/www.youtu.be|\/\/youtu.be/) !== -1) {
    if (url.search(/\/\//) !== -1) {
      if (url.search('youtu.be') !== -1) {
        id = url.replace(/.*youtu.be\//, '');
      } else {
        const u = new URL(url);
        id = u.searchParams.get('v');
      }
    }
    var finalUrl = `https://www.youtube.com/embed/${id}?modestbranding=1&showinfo=0&rel=0`;
    return getId ? { url: finalUrl, id } : finalUrl;
  }
  if (url.search && url.search(/\/\/www.vimeo.com|\/\/vimeo.com/) !== -1) {
    id = url.replace(/.*vimeo.com\//, '');
    var finalUrl = `https://player.vimeo.com/video/${id}`;
    return getId ? { url: finalUrl, id } : finalUrl;
  }
  return getId ? { url, id } : url;
}
function lineBreak(text, max, $container, noAlone, breakLetters) {
  $container.innerHTML = text.split(/\s/).map(w => { return '<span class="word">' + w + ' </span>' }).join('');
  var len = 0;
  Array.from($container.querySelectorAll('.word')).forEach(function (w) { len += getWidth(w) });
  if (len > max) {
    $container.innerHTML = '';
    var $l = document.createElement('span');
    $l.classList.add('line');
    $container.appendChild($l);
    var $currentLine = $l;
    text.split(/\s/).forEach((w, i) => {
      var $w = document.createElement('span');
      $w.classList.add('word');
      $w.innerHTML = i == 0 ? w : (' ' + w);

      $currentLine.appendChild($w);
      if (getWidth($currentLine) > max) {
        $w.remove();
        var $nwl = document.createElement('span');
        $nwl.classList.add('line');

        var $w = document.createElement('span');
        $w.classList.add('word');
        $w.innerHTML = i == 0 ? w : (' ' + w);

        $nwl.appendChild($w);
        $currentLine = $nwl;
        $container.appendChild($nwl);
      }
    });
    var $alone = Array.from($container.querySelectorAll('.line')).find($l => { return $l.children.length == 1 });
    if (noAlone && $alone) {
      var $last = $alone.previousElementSibling.querySelector('.word:last-child');
      var t = $last.innerHTML.replace(/^\s/, '');
      $last.remove();

      var $w = document.createElement('span');
      $w.classList.add('word');
      $w.innerHTML = t;
      $alone.prepend($w);
    }
  }else{
    $container.innerHTML = '';
    var $l = document.createElement('span');
    $l.classList.add('line');
    $container.append($l);
    $l.innerHTML = text.split(/\s/).map(w => { return `<span class="word">${w} </span>` }).join('');
  }
  Array.from($container.querySelectorAll('.line')).forEach(function (l) { 
    if(l.innerText === '' || l.innerText === ' ')
      l.remove();
    else
      l.innerHTML = '<span class="text">' + l.innerHTML + '</span>';
  });
  if(breakLetters) {
    Array.from($container.querySelectorAll('.text')).forEach(function (text) { 
      const letters = text.innerText.split('').map(letter => `<span class="letter${letter === ' ' ? ' space' : ''}">${letter}</span>`).join('')
      text.innerHTML = letters;
    });
  }
  function getWidth($el){
    if($el.classList.contains('word')){
      let wordW = $el.getBoundingClientRect().width;
      const content = $el.innerHTML;
      if(content.indexOf(' ') !== -1){
        wordW += wordW / content.length * 0.1
      }
      return wordW;
    }else{
      let w = 0;
      Array.from($el.querySelectorAll('.word')).forEach(word => {
        w += getWidth(word);
      });
      return w;
    }
  }
}

function isVideoNative(url){
  return url.search && (url.search(/\/\/www.youtube.com|\/\/youtube.com|\/\/www.youtu.be|\/\/youtu.be/) === -1 || (url.search(/\/\/www.vimeo.com|\/\/vimeo.com/) !== -1)) && /\.mp4\?*/.test(url);
}
function testBrowser(browser) {
  var result;

  switch (browser) {
    case 'safari':
      result = (typeof window.safari !== 'undefined' && window.safari.pushNotification);
      break;
    case 'safari mobile':
      result = /iPhone/i.test(navigator.userAgent) && /Safari/i.test(navigator.userAgent);
      break;
    case 'samsung':
      result = /SamsungBrowser/.test(navigator.userAgent);
      break;
    case 'chrome':
      result = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) && !/SamsungBrowser/.test(navigator.userAgent);
      break;
    case 'chrome mobile':
      result = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor) && !/SamsungBrowser/.test(navigator.userAgent) && window.chrome && !window.chrome.webstore;
      break;
    case 'firefox mobile':
      result = !/Chrome/.test(navigator.userAgent) && /Mozilla/.test(navigator.userAgent) && /Firefox/.test(navigator.userAgent) && /Mobile/.test(navigator.userAgent);
      break;
    case 'firefox':
      result = !/Chrome/.test(navigator.userAgent) && /Mozilla/.test(navigator.userAgent) && /Firefox/.test(navigator.userAgent);
      break;
    case 'ie':
      result = /MSIE/.test(window.navigator.userAgent) || /NET/.test(window.navigator.userAgent);
      break;
    case 'edge':
      result = /Edge/.test(window.navigator.userAgent);
      break;
    case 'ms':
      result = /Edge/.test(window.navigator.userAgent) || /MSIE/.test(window.navigator.userAgent) || /NET/.test(window.navigator.userAgent);
      break;
    default:
      result = false;
      break
  }
  return result;
}
function getBrowser() {
  if(testBrowser('chrome'))
      return 'chrome';
  if(testBrowser('safari'))
      return 'safari';
  if(testBrowser('safari mobile'))
      return 'safari-mobile';
  if(testBrowser('firefox'))
      return 'firefox';
  if(testBrowser('ie'))
      return 'ie';
  if(testBrowser('edge'))
      return 'edge';
}
function loadImage(url, callback) {
  var image = new Image();
  image.src = url;
  image.onload = callback;
  return image;
}
function loadImages(urls, callback) {
  var images = [];
  var imagesToLoad = urls.length;
  var onImageLoad = function () {
    --imagesToLoad;
    if (imagesToLoad === 0) {
      callback(images);
    }
  };
  for (var ii = 0; ii < imagesToLoad; ++ii) {
    var image = loadImage(urls[ii], onImageLoad);
    images.push(image);
  }
}
function waitForFont(fontName, cb) {
  const isReady = document.fonts.check(`1em ${fontName}`);
  if(isReady && testBrowser('chrome')) {
    cb();
  }else {
    if(document.fonts.size > 0) {
      document.fonts.ready.then(() => {
        cb();
      });
    }else {
      const interval = setInterval(() => {
        if(document.fonts.size > 0) {
          if(interval) clearInterval(interval);

          document.fonts.ready.then(() => {
            cb();
          });
        }
      }, 100);
    }
  }
}
function getStyleNumber(el, property){
  return Number(getComputedStyle(el)[property].replace('px', ''));
}
function isElement(obj) {
  try {
    //Using W3 DOM2 (works for FF, Opera and Chrome)
    return obj instanceof HTMLElement;
  }
  catch (e) {
    //Browsers not supporting W3 DOM2 don't have HTMLElement and
    //an exception is thrown and we end up here. Testing some
    //properties that all elements have (works on IE7)
    return (typeof obj === "object") &&
      (obj.nodeType === 1) && (typeof obj.style === "object") &&
      (typeof obj.ownerDocument === "object");
  }
}
function isTouch() {
  try {
    document.createEvent('TouchEvent');
    return true;
  } catch (e) {
    return false;
  }
}
function pxVisible(element) {
  const rect = element.getBoundingClientRect();
  const winTop = window.innerHeight;
  const elemTop = Math.round(rect.top);
  const elemBottom = elemTop + rect.height;
  const visibleTop = Math.max(0, elemTop);
  const visibleBottom = Math.min(winTop, elemBottom);
  return Math.max(0, visibleBottom - visibleTop);
}
function isLite() {
  return navigator.hardwareConcurrency < 8;
}
export default {
  isLite: isLite,
  parabola: parabola,
  pxVisible: pxVisible,
  canAutoplay: canAutoplay,
  waitForSound: waitForSound,
  isTouch: isTouch,
  isElement: isElement,
  getStyleNumber: getStyleNumber,
  random: random,
  map: map,
  waitForLoader: waitForLoader,
  waitForFont: waitForFont,
  smoothstep: smoothstep,
  getLang: getLang,
  isArabic: isArabic,
  isInViewportDom: isInViewportDom,
  lineBreak: lineBreak,
  getEmbedURL: getEmbedURL,
  isVideoNative: isVideoNative,
  getPosition: getPosition,
  testBrowser: testBrowser,
  getBrowser: getBrowser,
  ease: ease,
  round: round,
  lerp: lerp,
  loadImages: loadImages,
  loadImage: loadImage,
}