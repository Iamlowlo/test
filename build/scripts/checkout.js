var Checkout;

Checkout = (function() {
  function Checkout(pricingRules) {
    this.pricingRules = pricingRules;
  }

  Checkout.prototype.cart = [];

  Checkout.prototype.totalPrice = 0;

  Checkout.prototype.discountMethods = {
    t2p1: function(productPrice, qty) {
      return (productPrice * (qty - (qty % 2)) / 2) + productPrice * (qty % 2);
    },
    bulk: function(productPrice, qty) {
      if (qty < 3) {
        return productPrice * qty;
      } else {
        return productPrice * 0.95 * qty;
      }
    }
  };

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
      this.cart[product].qty--;
    }
    if (this.cart[product].qty < 1) {
      return this.cart.splice(product, 1, void 0);
    }
  };

  Checkout.prototype.total = function() {
    var i, j, len, pricingRulesProduct, product, ref;
    this.totalPrice = 0;
    ref = this.cart;
    for (i = j = 0, len = ref.length; j < len; i = ++j) {
      product = ref[i];
      if (product != null) {
        pricingRulesProduct = this.pricingRules.products[i];
        if ((pricingRulesProduct.discount != null) && (this.discountMethods[pricingRulesProduct.discount] != null)) {
          this.totalPrice += this.discountMethods[pricingRulesProduct.discount](pricingRulesProduct.price, product.qty);
        } else {
          if (product != null) {
            this.totalPrice += product.qty * this.pricingRules.products[i].price;
          }
        }
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
    $cart_totals.find('.product_list li:first-child').addClass('hidden');
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
    co.unscan(productId);
    if (co.cart[productId] == null) {
      return productList.addClass('invisible');
    } else {
      return productList.find('.qty').text(co.cart[productId].qty);
    }
  });
  return $cart_totals.on("click", ".check_totals", function(e) {
    return $totalPrice.text(co.total()).removeClass('invisible');
  });
});
