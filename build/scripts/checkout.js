var Checkout;

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

$(function() {
  var $cart_totals, co;
  co = {};
  $.ajax({
    url: 'http://localhost:8001',
    dataType: 'json',
    error: function(jqXHR) {
      return console.log(jqXHR);
    },
    success: function(data) {
      return co = new Checkout(data);
    }
  });
  $cart_totals = $('#cart_totals');
  $('#available_product_list').on("click", ".add_product", function(e) {
    var productId, productList;
    e.preventDefault();
    $('#cart_totals').find('.product_list li:first-child').addClass('hidden');
    productId = 'product_' + $(this).data('product');
    productList = $('#cart_totals').find('#' + productId);
    co.scan(productId);
    if (productList.length) {
      return productList.removeClass('unvisible').find('.qty').text(co.cart[productId].qty);
    }
  });
  $('#cart_totals').on("click", ".remove_product", function(e) {
    var productId, productList;
    e.preventDefault();
    productId = 'product_' + $(this).data('product');
    productList = $('#cart_totals').find('#' + productId);
    if (productList.length) {
      co.unscan(productId);
    }
    if (co.cart[productId].qty < 1) {
      return productList.addClass('unvisible');
    } else {
      return productList.find('.qty').text(co.cart[productId].qty);
    }
  });
  return $cart_totals.on("click", ".check_totals", function(e) {
    return console.log(co.total(), co.pricingRules);
  });
});
