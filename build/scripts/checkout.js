var Checkout;

Checkout = (function() {
  function Checkout(pricingRules) {
    this.pricingRules = pricingRules;
  }

  Checkout.prototype.cart = [];

  Checkout.prototype.totalPrice = 0;

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
    var i, j, len, product, ref;
    this.totalPrice = 0;
    ref = this.cart;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      product = ref[i];
      if (product != null) {
        this.totalPrice += product.qty * this.pricingRules.products[i].price;
      }
    }
    return this.totalPrice;
  };

  return Checkout;

})();

$(function() {
  var $cart_totals, $totalPrice, co;
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
  $totalPrice = $cart_totals.find('.total .price');
  $('#available_product_list').on("click", ".add_product", function(e) {
    var productId, productList;
    e.preventDefault();
    $totalPrice.addClass('invisible');
    $('#cart_totals').find('.product_list li:first-child').addClass('hidden');
    productId = $(this).data('product');
    productList = $('#cart_totals').find('#product_' + productId);
    co.scan(productId);
    if (productList.length) {
      return productList.removeClass('invisible').find('.qty').text(co.cart[productId].qty);
    }
  });
  $('#cart_totals').on("click", ".remove_product", function(e) {
    var productId, productList;
    e.preventDefault();
    $totalPrice.addClass('invisible');
    productId = $(this).data('product');
    productList = $('#cart_totals').find('#product_' + productId);
    if (productList.length) {
      co.unscan(productId);
    }
    if (co.cart[productId].qty < 1) {
      return productList.addClass('invisible');
    } else {
      return productList.find('.qty').text(co.cart[productId].qty);
    }
  });
  return $cart_totals.on("click", ".check_totals", function(e) {
    $totalPrice.text(co.total()).removeClass('invisible');
    return console.log(co.total(), co.pricingRules);
  });
});
