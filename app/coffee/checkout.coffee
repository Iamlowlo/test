class Checkout
	constructor: (@pricingRules) ->
	cart:{}
	scan: (product) ->
		if @cart[product]?
			@cart[product].qty++ 
		else
			@cart[product] = {'qty':1}
	unscan: (product) ->
		@cart[product].qty-- if @cart[product]?
	total: () ->
		@cart

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
	$('#available_product_list').on "click",".add_product", (e) ->
		e.preventDefault()
		$('#cart_totals').find '.product_list li:first-child'
			.addClass 'hidden'
		productId = 'product_' + $(this).data 'product'
		productList = $('#cart_totals').find('#'+ productId)
		co.scan productId
		if productList.length
			productList.removeClass 'unvisible'
				.find '.qty'
				.text co.cart[productId].qty

	$('#cart_totals').on "click",".remove_product", (e) ->
		e.preventDefault()
		productId = 'product_' + $(this).data 'product'
		productList = $('#cart_totals').find('#'+ productId)
		if productList.length
			co.unscan productId
		if co.cart[productId].qty < 1
			productList.addClass 'unvisible'
		else
			productList.find '.qty'
				.text co.cart[productId].qty
			
	$cart_totals.on "click",".check_totals", (e) ->
		console.log co.total(),co.pricingRules