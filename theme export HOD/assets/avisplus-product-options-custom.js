// Start: Plus add charge into price of product
let formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

let originPriceText = null;
let originPrice = null;
let interval3 = setInterval(function () {
  let ap_elements = document.querySelector('#avpoptions-container__v2');
  if (ap_elements) {
    if (!originPriceText) {
      originPriceText = $('.product__price')[0].innerHTML;
      originPrice = parseFloat($('.product__price')[0].innerHTML.replace('$', '').replace('.00', '').replace(/[^\d.]/g, ''));
    }	
    if (originPriceText && originPrice && $('#avp-productoption-total-add').is(':visible')){
    /*  let addChargePrice = parseFloat($('#avp-productoption-totalpriceadd')[0].innerHTML.replace('$', '').replace('.00', '').replace(/[^\d.]/g, ''));
      let newPrice = originPrice + addChargePrice;
      $('.product__price')[0].innerHTML = formatter.format(newPrice);
*/
    } else {
      $('.product__price')[0].innerHTML = originPriceText;
    }
  } 
}, 100);
// End: Plus add charge into price of product



