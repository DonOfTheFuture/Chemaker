function elmntInfo(){
const url = 'https://chemical-elements.p.rapidapi.com/';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '2914da1d34msh351ab7879406227p10bf89jsne4b256644e61',
		'X-RapidAPI-Host': 'chemical-elements.p.rapidapi.com'
	}
};
fetch(url, options).then(result=>{
response.json()
}).then(result=>{
	console.log(result);
}).catch((error)=>{
	console.error(error);
})
}
function setChemDes(){
/*melting points, boiling points, density, viscosity, solubility, crystal shape, and color
Changing states without altering or changing the identity of the substance
Volume,
Conductivity,
Malleability,
flammability,
toxicity,
acidity,
*/

}