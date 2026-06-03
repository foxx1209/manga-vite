/* --------- 　ここから編集禁止  ------------- */
console.info(
  "\n %c Orelop Static - https://github.com/hilosiva/orelop-static \n",
  "color: #66ffa5; background: #001010; padding:8px 0;",
);
import.meta.glob(["../assets/images/**"]);
/* --------- 　ここまで編集禁止  ------------- */


  !(function () {
    const viewport = document.querySelector('meta[name="viewport"]');
    function switchViewport() {
      const value =
        window.outerWidth > 360
          ? 'width=device-width,initial-scale=1'
          : 'width=360';
      if (viewport.getAttribute('content') !== value) {
        viewport.setAttribute('content', value);
      }
    }
    addEventListener('resize', switchViewport, false);
    switchViewport();
  })();
