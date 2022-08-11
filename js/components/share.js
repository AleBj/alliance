import FBSDK from '../libs/facebook';
export default class Share {
  constructor() {
    Array.from(document.querySelectorAll('.share-item[data-type], .social-item[data-social]')).forEach(item => {
      item.addEventListener('click', () => {
        const type = item.getAttribute('data-type') || item.getAttribute('data-social')
        if(this.inited) {
          this.shareByType(type)
        }else {
          FBSDK.init(() => {
            this.inited = true;
            this.shareByType(type)
          });
        }
      });
    });
  }
  shareByType(type){
    let url = location.href;
    let copy = '';
    let hash = copy.match(/#[^ ]+/);
    switch (type) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${copy} ${url}`)}`,
          'sharer',
          'toolbar=0,status=0,width=580,height=480',
        );
        break;
      case 'facebook':
        FB.ui({
          method: 'share',
          hashtag: hash,
          href: url,
          quote: copy,
        });
        break;
      default:
        break;
    }
  }
}