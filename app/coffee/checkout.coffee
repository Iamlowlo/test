class Checkout
	constructor: (@pricingRules) ->
	cart:[]
	totalPrice:0
	discountMethods:
		t2p1: (productPrice, qty)->
			(productPrice*(qty-(qty%2))/2)+productPrice*(qty%2)
		bulk: (productPrice, qty)->
			if qty<3 then productPrice*qty else productPrice*0.95*qty
	scan: (product) ->
		if @cart[product]?
			@cart[product].qty++ 
		else
			@cart[product] = {'qty':1}
	unscan: (product) ->
		@cart[product].qty-- if @cart[product]?
		@cart.splice product,1,undefined if @cart[product].qty<1
	total: () ->
		@totalPrice=0
		for product,i in @cart
			if product?
				pricingRulesProduct = @pricingRules.products[i]
				if pricingRulesProduct.discount? and @discountMethods[pricingRulesProduct.discount]?
					@totalPrice+=@discountMethods[pricingRulesProduct.discount](pricingRulesProduct.price,product.qty)
				else
					@totalPrice+=product.qty*@pricingRules.products[i].price if product?
		@totalPrice

$ ->
	co={}
	$.ajax
		url: 'http://localhost:8001'
		dataType: 'json'
		error: (jqXHR) ->
			console.log jqXHR
		success: (data) ->
			co = new Checkout data
	

	$cart_totals = $('#cart_totals')
	$totalPrice = $cart_totals.find '.total .price'
	$('#available_product_list').on "click",".add_product", (e) ->
		e.preventDefault()
		$totalPrice.addClass 'invisible'
		$cart_totals.find '.product_list li:first-child'
			.addClass 'hidden'
		productId = $(this).data 'product'
		productList = $('#cart_totals').find('#product_'+ productId)
		co.scan productId
		if productList.length
			productList.removeClass 'invisible'
				.find '.qty'
				.text co.cart[productId].qty

	$('#cart_totals').on "click",".remove_product", (e) ->
		e.preventDefault()
		$totalPrice.addClass 'invisible'
		productId = $(this).data 'product'
		productList = $('#cart_totals').find('#product_'+ productId)
		co.unscan productId
		if !co.cart[productId]?
			productList.addClass 'invisible'
		else
			productList.find '.qty'
				.text co.cart[productId].qty
			
	$cart_totals.on "click",".check_totals", (e) ->
		$totalPrice.text co.total()
			.removeClass 'invisible'