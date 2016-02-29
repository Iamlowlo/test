var Checkout, co;

Checkout = (function() {
  function Checkout(pricingRules) {
    this.pricingRules = pricingRules;
  }

  Checkout.prototype.cart = {};

  Checkout.prototype.scan = function(product) {
    if (this.cart[product] != null) {
      return this.cart[product].qty++;
    } else {
      return this.cart[product] = {
        'qty': 1
      };
    }
  };

  Checkout.prototype.unscan = function(product) {
    if (this.cart[product] != null) {
      return this.cart[product].qty--;
    }
  };

  Checkout.prototype.total = function() {
    return this.cart;
  };

  return Checkout;

})();

co = new Checkout('pricingRules');

$(function() {
  var $cart_totals;
  $cart_totals = $('#cart_totals');
  $('#available_product_list').on("click", ".add_product", function(e) {
    var productList, productName;
    e.preventDefault();
    $('#cart_totals').find('.product_list li:first-child').addClass('hidden');
    co.scan($(this).data('product-name'));
    productName = $(this).data('product-name');
    productList = $('#cart_totals').find('#' + productName);
    if (productList.length) {
      return productList.removeClass('unvisible').find('.qty').text(co.cart[productName].qty);
    }
  });
  $('#cart_totals').on("click", ".remove_product", function(e) {
    var productList, productName;
    e.preventDefault();
    productName = $(this).data('product-name');
    productList = $('#cart_totals').find('#' + productName);
    if (productList.length) {
      co.unscan(productName);
    }
    if (co.cart[productName].qty < 1) {
      return productList.addClass('unvisible');
    } else {
      return productList.find('.qty').text(co.cart[productName].qty);
    }
  });
  return $cart_totals.on("click", ".check_totals", function(e) {
    return console.log(co.total());
  });
});
