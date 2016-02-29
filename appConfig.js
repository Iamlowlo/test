var appConfig = {
	products : [
		{
			name:"Voucher",
			icon_class:"flaticon-voucher",
			price:5
		},
		{
			name:"T-shirt",
			icon_class:"flaticon-tshirt",
			price:20
		},
		{
			name:"Mug",
			icon_class:"flaticon-mug",
			price:7.5
		}
	],
	discounts:[
		{
			product:1,
			method_title:"2x1",
			method_op:""
		},
		{
			product:2,
			method_title:"Bulk discount",
			method_op:""
		}
	]
}

module.exports = appConfig;