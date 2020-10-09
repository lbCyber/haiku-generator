const haikuData = {
  hyperlink: window.location.href.split('?')[0],
  searchParams: atob(escape(decodeURIComponent(window.location.search.replace(/['?']/, '')))).split('&'),
  paramString: '',
  catcher: [],
  haikuData: {},
  urlGen: [], // Global to record result as search parameters
  paramGen: () => {
      return (window.btoa(unescape(encodeURIComponent(haikuData.urlGen.join('&')))));
  },
  grabber: (line, syllables) => {
    const getTarget = (s) => {
      if (s === 5) {
        return (haikuData.haikuData.fiveSyb)
      } else if (s === 7) {
        return (haikuData.haikuData.sevenSyb)
      } else {
        return null
      }
    }
    let randomLine = Math.floor(Math.random() * getTarget(syllables).length);
    let randomVid;
    let pickText = line - 1;
    let pickVid = line + 2;

    const pickRandomVid = () => {
      randomVid = Math.floor(Math.random() * haikuData.haikuData.background.length);
      if (randomVid >= 13 || randomVid < 0) {
        randomVid = 0
      }
      const catchDupes = () => {
        return haikuData.catcher.includes(randomVid);
      }
      if (catchDupes()) {
        pickRandomVid();
      } else {
        haikuData.catcher[line] = randomVid;
      }
    };
    if (haikuData.searchParams.length >= 6) {
      const checkVal = (v, t) => {
        if (v !== "") {
          return v
        } else {
          if (t === 0) {
            return randomLine;
          } else {
            return randomVid;
          }
        }
      }
      randomLine = checkVal(haikuData.searchParams[pickText],0);
      randomVid = checkVal(haikuData.searchParams[pickVid],1);
    } else {
      pickRandomVid();
    }
    let haikuLine = getTarget(syllables)[randomLine];
    if (haikuLine === undefined) {
      haikuLine = getTarget(syllables)[1]
    } else if (haikuLine.includes('godzilla')) {
      randomVid = 'g';
    }
    $(`<video poster="./assets/webm/${randomVid}.webm" class="haikuBackground" playsinline autoplay muted loop><source src="./assets/webm/${randomVid}.webm" type="video/webm"></video>`).prependTo(`.haiku${line}`);
    $(`<p>${haikuLine}</p>`).appendTo(`.haiku${line}`);
    haikuData.urlGen[pickText] = randomLine;
    haikuData.urlGen[pickVid] = randomVid;
  }
}
//
$(function () {
  $.ajax({
    url: './js/haikuData.json',
    method: `GET`,
    dataType: `json`,
    cache: `false`
  }).then(response => {
    haikuData.haikuData = response;
    haikuData.grabber(1, 5);
    haikuData.grabber(2, 7);
    haikuData.grabber(3, 5);
  })

  $('.downOne').on('click', () => {
    let searchParamText = `https://haiku.lintbox.com?${haikuData.paramGen().replace(/['*=*']/g, '')}`;
    let searchParamSocial = `https://haiku.lintbox.com?${haikuData.paramGen().replace(/['*=*']/g, '')}`;
    let searchParamSocialHex = `https%3A%2F%2Fhaiku.lintbox.com%2Fhaiku${haikuData.paramGen().replace(/['*=*']/g, '')}`
    $('input.poemLink').val(searchParamText);
    $('.decoyTweetIt').replaceWith(`<a href="https://twitter.com/share?ref_src=twsrc%5Etfw" class="twitter-share-button" data-text="I generated a haiku and it&#39;s beautiful. " data-url="${searchParamSocial}" class="twitter-share-button" data-show-count="false" target="_blank">Tweet</a>`);
    $('.decoyFB').replaceWith(`<iframe src="https://www.facebook.com/plugins/share_button.php?href=${searchParamSocialHex}&layout=button_count&size=small&mobile_iframe=true&width=75&height=20&appId" width="75" height="20" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allow="encrypted-media"></iframe>`);
    $('.haiku').addClass('bottomScrollUp bottomScrollTransition');
    $('header').addClass('headerExpand');
    setTimeout(() => {
      $.getScript("https://platform.twitter.com/widgets.js");
    }, 1000);
    setTimeout(() => {
      $('.haiku1').addClass('makeVisible');
    }, 1500);
    setTimeout(() => {
      $('.haiku2').addClass('makeVisible');
    }, 2500);
    setTimeout(() => {
      $('.haiku3').addClass('makeVisible');
    }, 3500);
    setTimeout(() => {
      $('.topSection').addClass('remove');
      $('.haikuPos').addClass('squeezeSection');
      $('.afterWord').addClass('growSection');
    }, 6000);
    setTimeout(() => {
      $('.haiku').removeClass('bottomScrollTransition');
      $('.bottomSection').removeClass('overflowToggle');
      $('.haikuContainer').toggleClass('clickMax');
    }, 8000);
  });
  $('.copyButton').on('click', () => {
    $('input.poemLink').select();
    document.execCommand("copy");
    $('.box2').addClass('clipboard');
  });
  $('.haikuContainer')
    .on('click', () => {
      if (window.innerWidth > 799) {
        $(this).toggleClass('clickMax');
        $('.afterWord').toggleClass('fadeAfterWord');
        $('.haikuPos').toggleClass('squeezeSection');
        $('.haiku').toggleClass('bottomScrollTransition');
        setTimeout(() => {
          $('.afterWord').toggleClass('growSection');
        }, 500);
      }
    });
});
