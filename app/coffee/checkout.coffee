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
co = new Checkout 'pricingRules'

$ ->
	$cart_totals = $('#cart_totals')
	$('#available_product_list').on "click",".add_product", (e) ->
		e.preventDefault()
		$('#cart_totals').find '.product_list li:first-child'
			.addClass 'hidden'
		co.scan $(this).data 'product-name'
		productName = $(this).data 'product-name'
		productList = $('#cart_totals').find('#'+ productName)
		if productList.length
			productList.removeClass 'unvisible'
				.find '.qty'
				.text co.cart[productName].qty

	$('#cart_totals').on "click",".remove_product", (e) ->
		e.preventDefault()
		productName = $(this).data 'product-name'
		productList = $('#cart_totals').find('#'+ productName)
		if productList.length
			co.unscan productName
		if co.cart[productName].qty < 1
			productList.addClass 'unvisible'
		else
			productList.find '.qty'
				.text co.cart[productName].qty
			
	$cart_totals.on "click",".check_totals", (e) ->
		console.log(co.total())