function init(cb){
  if(!document.documentElement.getAttribute('data-facebook-ready')) {
    window.fbAsyncInit = function() {
      FB.init({
        appId: '903576040391946',
        xfbml: true,
        version: 'v8.0'
      });
      FB.AppEvents.logPageView();
      if(cb) cb();
    };
    (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }else {
    if(cb) cb();
  }
}
export default {
  init: init
}