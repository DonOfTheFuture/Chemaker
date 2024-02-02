(function elmntInfo(){
	let elmntStrg = elmntsList()
const url = 'https://chemical-elements.p.rapidapi.com/';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '2914da1d34msh351ab7879406227p10bf89jsne4b256644e61',
		'X-RapidAPI-Host': 'chemical-elements.p.rapidapi.com'
	}
};
fetch(url, options).then(result=>{
return response.json()
}).then(result=>{
	if(elmntStrg.length === 119){
		elmntStrg = elmntStrg.map((elmntObj)=>{
			let elmntTxt = Promise.resolve(extractProp('url', elmntObj))
			elmntObj.text = elmntTxt
			return elmntObj
		})
	  localStorage.setItem('elements', elmntStrg)
	  console.log(localStorage.getItem('elements'))
	}}).catch((error)=>{
	console.error(error);
})
})()
/*
 1. when creating the molecule make sure that the elements vary so that the probability of availability increases
 2. if the value of an iterated element is more or less than the target value of the new molecule, determine whether the target value is equally divisible by the element or saved molecule.
 If not, get a similar value of another element to make a similar molecule according to the description
 3. when iterating through the elements, determine whether the element is in another molecule. This should start in finding out whether or not the molecule is in the new molecule table already.
 4. search every new molecule on google
 5. when double clicked, the new molecule row can be saved to the local storage
*/

function setChemDes(){
	let elmntStrg = JSON.parse(localStorage.getItem('elements'))
let elmntTraits = ['melting point', 'boiling point', 'density', 'solubility','Volume','Thermal Conductivity','acidity','hygroscopity','Strength', 'triple point']
let units = ['K', 'g/L', 'g/cm^3', 'kPa', 'MPa', '/mol', 'J/']
/*
make sure that the target chemical and iterated element have similar traits
make sure that the units 
when a similar trait matches, iterate through the element list for more new molecule similarities
1. when iterating through the different elements, find the similarities between the new molecule description and the iterated element
2. when the element attributes to the new mol value's description in the average of the new mol result or equals the difference value, add to the newMolTraits
3. if the resDtlObjArr or same details check function has no less or more values, it is the correct molecule
*/
let newElmDtls = getNewElmDtls()
let [MP,BP,Density,Viscocity,Solubility,Crystal,Color,Conductivity,Malleability,Flammability,Toxicity,Acidity,Hygroscopity,Elasiticity,Brittleness]=newElmDtls
let newMolTraits = []
iterateElm()
function iterateElm(){
for(let n = 0; n< Number.MAX_VALUE; n++){
	
let smlrElmnts = elmntStrg.filter((elmntObj, i)=>{
	let elmKeyVals
	if(!elmntObj.hasOwnProperty('wiki')){
	elmKeyVals = getElmURL(elmntObj.name)
	elmntObj.wiki = elmKeyVals
	elmntStrg[i] = elmntObj
	localStorage.setItem('element', JSON.stringify(elmntStrg))
	console.log(JSON.parse(localStorage.getItem('element')))
	}else{
	elmKeyVals = elmntObj.wiki	
	}
	
	
		let elmData = elmntObj
		let chemDesProm = new Promise((res, rej)=>{
	Promise.resolve(elmntObj.wiki).then((keyValRes)=>{
		/*
		newObj.rowHead = tbleHead
			newObj.value = tbleDta
		*/
		keyValRes = JSON.parse(keyValRes)
	let txt = elmntObj.text.toLowerCase().trim()
	//put a hyphen in between element trait strings 
	elmntTraits.forEach((str)=>{
		str = (str.includes(' ')):str.replace(' ', '-')?str
	txt = txt.replace(str, ' '+str+' ')
})
	let traits = elmntTraits.map((traitStr)=>{
		traitStr = traitStr.replace(' ', '-')
		traitStr = traitStr.toLowerCase().trim()
	      let traitHead = txt.slice(txt.indexOf(traitStr), txt.length)
		  let traitValue = traitHead.split(' ').map((wrd)=>{
			  let isTraitWrd = elmntTraits.some((trait)=>{ 
				  trait = trait.replace(' ', '-')
				  return trait.toLowerCase() === wrd
			  })
			  if(isTraitWrd === true){
				  traitHead = traitHead.slice(0, traitHead.indexOf(wrd)-1)				  
				  traitHead = traitHead.toLowerCase().trim()
			  }
		let smlrVals = keyValRes.map((elmObj, i)=>{
		let [elmHead,elmDta] = elmObj
		  if(elmHead === traitHead){
			return xtrctUnit(elmDta)
		  }
		})
		if(smlrVals.length >= 1){
		return smlrVals[0]
		}
	})
	if(traitValue.length >= 1){
	return traitValue
	}
})
res((traits).toString())
}).catch(e=>{console.error(e.name, e.message)})

})
return Promise.resolve(chemDesProm).split(',').map((str)=>{return str})
})

if(newMolTraits.length === 0){
	if(smlrElmnts.length === 1){

if(isElmDet(smlrElmnts[0]) === true){
	newMolTraits = smlrElmnts[0]
	break
	}}
	}else if(newMolTraits.length >= 1){
		
		
			let numArr = intoNum(newMolTraits[newMolTraits.length-1])
		let [MP_num,BP_num,Density_num,Viscocity_num,Solubility_num,Crystal_num,Color_num,Conductivity_num,Malleability_num,Flammability_num,Toxicity_num,Acidity_num,Hygroscopity_num,Elasiticity_num,Brittleness_num] = numArr.map((numObj)=>{
			return numObj.value
		})
			newMolTraits = numArr.map((num, i2)=>{
				let avrg = [newMolTraits[i2], num].reduce((a,b)=>{return a+b}, 0)
				avrg = avrg/2
				return avrg
			})
			newMolTraits= newMolTraits
		if(newMolTraits.length < 1){
			newMolTraits =  smlrElmnts[0]
		}
	
	}
	let resDtlObjArr = sameDetails(newMolTraits,newElmDtls,elmntTraits).map((traitObj, i)=>{
		let {diff,dtl_str,type} = traitObj
		let newObj = Object.create({})
		if(type === 'less'){
		newObj.diffVal = parseInt('-'+diff, 10)
		}else if(type === 'more'){
			newObj.diffVal = parseInt(diff, 10)
		}
		newObj.dtl_str = dtl_str
		newObj.type = type
		return newObj
	})
	//makes sure that each unit has a correct AMOUNT based on the formula
	let amountsRights = resDtlObjArr.map((dtlObj, i, dArr)=>{
		let {diffVal, dtlStr} = dtlObj
		let cplePrblms 
		if(diffVal < 0){
			diffVal = (diffVal+'').replace('-', '')
			diffVal = parseInt(diffVal, 10)
			cplePrblms = getAddPrblms(diffVal)
		}else if(diffVal > 0){
		  cplePrblms = getAddPrblms(diffVal)
		}
		   let prblmInfoArr = cplePrblms.map((prblm)=>{
			   let prblmObj = Object.create({})
			   let sum = prblm.reduce((a,b)=>{return a+ b}, 0)
			   prblmObj.sum = sum
			   prblmObj.prblm = prblm
			   return prblmObj
		   })
		   
	})
	let areSmlr = newMolTraits.every((valNum, i4)=>{
		return Math.abs(valNum - newElmDtls[i4]) < 1
	})
	return newMolTraits.map((traitNum, i3)=>{
		return numComb(traitNum, elmntTrait[i3])
	}) 
}
}

function getAddPrblms(num){
	let newArr = []
	//two num prblms
			let dvsble = ((num/2)+'')
		if(dvsble.includes('.5')){
		 dvsble = dvsble.replace('.5', '')	
		}
		dvsble = parseInt(dvsble, 10)
	let twoLng = []
	for(let c0 = 0; c0 <= dvsble; c0++){
		if(c0 > dvsble){
			for(let i = dvsble; i >= dvsble; i++){
				twoLng.push(i)
			}
			break
		}
		twoLng.push(c0)
	}
	twoLng = twoLng.map((b, i, arr)=>{
		let twoArr = []
		let prtDiff = (num - b)
		return [prtDiff, b]
	})
	return twoLng
	/*
	for(let c=0; c <= num; c++){
		let arr = []
		for(let n1 = 0; n1 <= c;n1++){
			arr.push(1)
		}
	}
	*/
}
/*
  1. extract possible addition numbers
  2. count up from one to the half high number
  3. replace each number with corresponding number of ones 
  4. for each number greater than one, break it down with the countUp function and return the number list
 5. if the current flattened out number array exists in the number array array, dont push it into the number combo possibility list 
 6. flatten out the result into the main function
*/
/*
 1. iterate over 
*/

function countUp(hiNum){
	let numsList = []
		let dvsble = remDec(hiNum)
		newNumList()
		//branch off of the numbers in the array if all the numbers are in an array and if their are some that are more than one
		function newNumList(){
			let newArr = []
	for(let n = 0; n <= dvsble; n++){
			let crntNum = n	
			let inNewArr = (newArr.length > 1)?newArr.some((n2, i)=>{
				return n2 === crntNum
			
			}):false
		if(inNewArr === false){
		newArr.push(crntNum)
		let numDiff = hiNum - crntNum
		
		newArr.push(numDiff)
		}
				let eqlsHiNum = newArr.reduce((a,b)=>{return a + b}, 0)

		 let inNumArr = (numsList.length > 0) ? numsList.some((nums)=>{
			 return nums.flat(Infinity) === newArr.flat(Infinity)
		 }): false
		 if(inNumArr === false && eqlsHiNum === hiNum){
		  numsList.push(newArr)	 
		 }
		 let newTtls = []
		 numsList.forEach((nums)=>{
			 let numPrblmVars = scanNumArr(nums)
			 let theMax = [numPrblmVars, hiNum].map((c, i)=>{return c.reduce((a,b)=>{return a + b}, 0)})
			 if(theMax[0] === theMax[1]){
			numPrblmVars.forEach((numPrblmObj)=>{
				for(let [objProp, objVal] in numPrblmObj){
					let numArr = objVal
					for(let ai = 0; ai < numArr.length; ai++){
						newTtls.push(elmntVals(ai, theMax[0],hiNum))
					}
				}
			})
			 }
		 })
		 			return newTtls
		}
		/*
		 count up numbers to max num
		 when each number is broken down in an array, flatten the array out and make sure that sum equals the max
		 if the array is different than another array save it into the add prblms list
		*/

	} 
	function elmntVals(num,max ,wholeNum, propStr){
		let percChar = (max*100)/wholeNum
	let ttlMax = (percChar*wholeNum)/100
		let ttl = fitIn(ttlMax, wholeNum, propStr)*num
		return ttl
	}
	//ttlNum is the number that is calculated from the current calculted number from the element object
	//wholeNum is the target numerical value
	
	function fitIn(ttlNum, crntNum,prop){
		
	for(let n = 0; n <= Number.MAX_VALUE; n++){
		if(Math.abs(crntNum - ttlNum) < 1){
			return crntNum
		}else{
				let elmnts = elmntsList.filter((obj, i)=>{
			let elmntVal = (obj[prop])	
			for(let n = elmntVal; n <= ttlNum; n++){
				if(Math.abs(elmntVal - ttlNum) < 1){
				return Math.abs(elmntVal - ttlNum) < 1
				}else{
					elmntVal+=1
				}	
			}
				})[0]
			return elmnts[props]
		}
	}
}
}
		function pssblePrblms(maxNum){
			maxNum = remDec(maxNum)
			let nArr = []
			for(let sn = 0; sn <= maxNum; sn++){
				nArr.push(sn)
			}
				return nArr
		}
function getElmntAvrg(xtraNum, crntAvrg,elmntDtls,type, dtlStr, traitsList, elmntObj){
  let traitIdx = traitsList.indexOf(dtlStr)
  let traitVal = elmntDtls[traitIdx]
  let shells = elmntObj.shells.reduce((a,b)=>{return a + b}, 0)
  let avrgDiff = 0
  	let elmntStrg = localStorage.getItem('elements')
	elmntStrg = JSON.parse(elmntStrg)
	for(let n = 0; n <= Number.MAX_NUMBER; n++){
		let nmbrPrdct = (n*traitVal)
	if(nmbrPrdct > crntAvrg){
		avrgDiff = nmbrPrdct - crntAvrg
		let lwrNums = getLwrNums(avrgDiff)
		let pssbleElms = lwrNums.map((n3)=>{
			let numCombs = []
			let crctElm = elmntStrg.filter((obj)=>{
				let atmNum = obj.number
				return atmNum ==== n3
			})[0]
			if((typeof crctElm) === 'object'){
			return crctElm
			}
		})
		if(pssbleElms.length > 0){
				return pssbleElms
		}
	}
	}
	function getLwrNums(num){
		let numArr = []
		for(let n2 = 0; n2 < num; n2++){
			numArr.push(n2)
		}
		return numArr
	}
}
function intoNum(strArr){
			let numArr =strArr.map((detStr, i)=>{
			let unitNum = remNums(detStr)
			unitNum = detStr.replace(unitNum, '')
			return {value:parseInt(unitNum, 10), idx: i}
		})	
			return numArr
}
function isElmDet(elmnts){
	 let isElmList = elmnts.every((arr)=>{
	 let isElmDtls = arr.every((itm, i)=>{
	let hasUnit = units.some((unit)=>{
		return itm.includes(unit)
	})
	if(hasUnit === true){
	return trait
	}
	 })
	 return isElmDtls === true
})
return isElmList
}

let molsTable = allDivs()['mol-table']
let tableClne = molsTable.children[0].cloneNode(true)
let infoRows = Array.from(tableClne.querySelectorAll('.info-row'))
let frstRow = infoRows[0]
let tdHeads = frstRow.previousElementSibling.children
tdHeads = Array.from(tdHeads).map((head)=>{
	return head.innerText
})
frstRow.style.display = 'none'
let rowClne = frstRow.cloneNode(true)
rowClne.onclick = (e) =>{
	saveNewMol(rowObj)
}
rowClne.onclick = function(e){
	let count = 0
	this.onkeydown = function(e){
		let countInt = setInterval(()=>{
			if(count === 5){
				 clearInterval(countInt)
				 	saveNewMol(this)
			}else{
				count++
			}
		})
		this.onclick = (e)=>{
			e.preventDefault()
		} 
	}
	}
	
tableClne.appendChild(rowClne)
molsTable.appendChild(tableClne) 

}

function sameDetails(dtlArr, newDtlArr, dtlStrs){
	let dtlObjArr = newDtlArr.filter((dtl, di)=>{
		   let dtlObj = Object.create({})
		   let numDiff = (dtl > dtlArr[di])? (dtl - dtlArr[di]) : (dtlArr[di] - dtl)
		   let typeStr = ''
		   if(dtl > dtlArr[di]){
			   typeStr = 'more'
		   }else if(dtl < dtlArr[di]){
				typeStr = 'less'
		   }
		   dtlObj.diff = numDiff
		   dtlObj.dtl_str = dtlStrs[di]
		   dtlObj.type = typeStr
		   return dtlObj
		})
		return dtlObjArr
}

function numComb(numArr,trait){
	let unit;
	//['melting point', 'boiling point', 'density', 'solubility','Volume','Thermal Conductivity','acidity','hygroscopity','Strength', 'triple point']
	switch(trait){
		case trait === 'heat capacity' || trait === 'melting point' || trait === 'boiling point'  || trait === 'triple point':
		 unit = 'K'
		 break
		case trait === 'density':
		unit = 'g/cm^3'
		break;
		case trait === 'solubility':
		unit = 'g/L'
		break;
		case trait === 'volume':
		unit = 'cm^3'
		break;
		case trait === 'thermal conductivity':
		unit = 'w/(m*K)'
		break;
		case trait === 'acidty':
		unit = 'pH'
		break;
		case trait === 'hygroscopity':
		unit = 'mGF'
		break
		case trait === 'strength':
		unit = 'Pa'
		break;
	}
	let avrg = numArr.reduce((a, b)=>{return a+b}, 0)/numArr.length
	return avrg+' '+unit
}
//determine type of reaction from the elements in the chemicals
//['NaNO3', 'CH3']

function xtrctUnit(valStr){
	let frstPrnth = valStr.indexOf('(')
	let secPrnth = valStr.indexOf(')')+1
	let prnthsStr = valStr.slice(frstPrnth, secPrnth)
	if(valStr[frstPrnth-1] !== '/'){
	valStr = valStr.replace(prnthsStr, '')
	}
	valStr = valStr.replaceAll('(H2)', '')
	let valArr
	if(valStr.includes(', ')){
	valArr = valStr.split(', ')
	}else{
		valArr = [valStr]
	}
	return valArr[0]
}

function chemReact(chemArr = []){
	let elmntsStrg = elmntsList()
	if(chemArr.length === 2){
		let molNumArr = []
	//make array of chemicals without numbers
	let molArr = chemArr.map((chem)=>{
		let molNum = (typeof parseInt(chem[0],10) === 'number'): true? false
		if(molNum === true){
		molNumArr.push(parseInt(molNum, 10))
		}else{
		molNumArr.push(1)
		}
		let {num_arr, new_str} = remNums(chem) 
		return new_str
	})
	let elmHasA = ['As', 'Ar']
	let isWeakAcid = molArr.map((str)=>{
		elmHasA.forEach((s)=>{
		  if(str.includes(s)){
			  str = str.replaceAll(s, '')
		  }
		})
		return str.includes('A', '')
	})
	isWeakAcid = isWeakAcid.length >= 1
	let frstMol = molArr[0], secMol = molArr[1]
	//does the compund have oxygen?
	let hasOxy = molArr.some((mol)=>{
		return mol === 'O'
	})
	let hasCH = molArr.some((mol)=>{
		return mol === 'C' && mol === 'H'
	})
	//separate the molecules from the formula into the array of elements from each molecule
      let chemMolsArr = chemArr.map((chem)=>{
		return allElements(chem)
	})
	let isSngleDis = chemMolsArr.some((elmArr)=>{
		return elmArr.length === 1
	}) 
	let idDbleDis = chemMolsArr.every(elmArr=>{
		return elmArr.length > 2
	})
	
	let decomp = (chemMolsArr.length === 1)
	/*
	determine type of chemical reaction
	when you figure out the electron shell count number determine if chemcal is acidic
	
	1. synthesis
	2. neutralization
	3. decomposition
	4. combustion
	5. precipitation
	6. double displacement
	*/
	let molShellElctrnCntArr = chemMolsArr.map((arr)=>{
		let shellCnt = arr.map((elm)=>{
			let elmObj = elmntsStrg.filter((obj)=>{
				return obj.symbol === elm
		})[0]
		let elmElctrns = elmObj.shells.reduce((a,b)=>{
			return a+b
		}, 0)
		return elmElctrns
	})
	return shellCnt.reduce((a1, b1)=>{
		return a1 + b1
	}, 0)
	})
	//is acid base
	 let canReact = isReactive([molShellElctrnCntArr.reverse(), molShellElctrnCntArr])
	//molecule string array
	chemMolsArr = chemMolsArr.map((elmArr)=>{
		return elmArr.toString().replaceAll(',', '')
	})
	//equation string
	let eqtnStr = chemMolsArr[0] +' + '+ chemMolsArr[1]
	
	if(hasOxy === true && hasCH === true){
	  return solveEquation('combustion',chemMolsArr,molNumArr)
	}else if(isSngleDis === true){
	  return	solveEquation('single displacement',chemMolsArr,molNumArr)
	}else if(isDbleDis === true){
	 return solveEquation('double displacement',chemMolsArr,molNumArr)
	}else if(decomp === true){
	   return solveEquation('decomposition',chemMolsArr,molNumArr)
	}else if(canReact === true){
		return solveEquation('neutralization',chemMolsArr,molNumArr)
	}

	}
  }

function getNewElmDtls(){
	let dtlDiv = allDivs(document.body)['des-div']
	let dtls = Array.from(dtlDiv.querySelectorAll('div'))
	dtls = Array.from(dtls.querySelectorAll('input[type=number]')).map((dtl)=>{
		return parseInt(dtl.value, 10)
	})
	return dtls
}

function isReactive(mainArr){
		  let acidBase = [[], []]
	 mainArr.forEach((cntArr)=>{
	  cntArr.forEach((eCnt)=>{
		  if(eCnt % 2 !== 0){
			  acidBase[0].push('acid')
		  }else if(eCnt % 2 === 0){
			  acidBase[1].push('base')
		  }
	  })
	 })
	 
	 let strArr = ['acid', 'base']
	    let isNtrl = acidBase.map((arr, i)=>{
			return arr.every((str, i2)=>{
				return str === strArr[i]
			})
		}).every((bool, i2)=>{return bool === true})
		let sameSize = acidBase[0].length === acidBase[1].length
return isNtrl === true && sameSize === true		
}
function elementType(mol){
	
	let elmArr
	for(let n = 0;n<mol.length; n++){
		if(typeof parseInt(mol[n], 10) === 'number'){
			mol = mol.replace(mol[n], '<(o)>')
		}
	}
	elmArr = mol.split('<(o)>')
	let reactiveTypes = ['alkali metal', 'alkaline earth metal', 'reactive nonmetal']
	let metalTypes = ['transition metal', 'post-transition metal', 'lanthanoid', 'actinoid']
    let elmntList = elmntsList()
		let molShellElctrnCntArr = chemMolsArr.map((arr)=>{
		let shellCnt = arr.map((elm)=>{
			let elmObj = elmntsStrg.filter((obj)=>{
				return obj.symbol === elm
		})[0]
		let molState = elmObj
		let elmType = elmObj.summary
		let elmElctrns = elmObj.shells.reduce((a,b)=>{
			return a+b
		}, 0)
				
		let isMtl = metalTypes.some((type)=>{
			return (type === elmObj.category || elmObj.summary.toLowerCase().includes(type))
		})
		  let atm_num = elmObj.number
		  let isOdd = (atm_num%2 !== 0): 'odd'? 'even'
			
		let isReactMtl = (isOdd === 'even' && isMtl === true)
		return elmElctrns || isReactMtl
	})
	return shellCnt.reduce((a1, b1)=>{
		return a1 + b1
	}, 0)
	})
	//is acid base
	let boolArr = [[], []]
	  let acidBase = [[], []]
	 [molShellElctrnCntArr.reverse(), molShellElctrnCntArr].forEach((cntArr)=>{
	  cntArr.forEach((eCnt)=>{
		  if(eCnt % 2 !== 0){
			  acidBase[0].push('acid')
		  }else if(eCnt % 2 === 0){
			  acidBase[1].push('base')
		  }
	  })
	 })
	 
	 let strArr = ['acid', 'base']
	    let isNtrl = acidBase.map((arr)=>{
			return arr.every((str, i)=>{
				return str === strArr[i]
			})
			return isNtrl
		}).every((bool)=>{return bool === true})
		
	let isReactive = elmArr.some((elm)=>{
	let elmObj = elmntsStrg.filter((obj)=>{
				return obj.symbol === elm
		})[0]
		let isReactType = elmntTypes.some((type)=>{
			return (type === elmObj.category || elmObj.summary.toLowerCase().includes(type))
		})
	  
	})
	let typesList = []
	let viscPhases = ['solid', 'gas']
	let wasVisc = allElements(mol).every((s)=>{
		let crntElmObj = elmntsStrg.filter((obj)=>{
			return obj.name === s
		})[0]
		let phaz = crntElmObj.phase
		let isPhaz = viscPhases.filter((s2)=>{
			return s2 === phaz.toLowerCase()
		})
		if(isPhaz.length >= 1){
			if(isPhaz[0].phase === 'solid'){
			typesList.push(2)
			}else{
			typesList.push(1)
			}
		}
	})
		let solNum = 0
		let gasNum = 0
	let moreSolid = (e) =>{
		for(let n = 0; n <= typesList.length; n++){
			if(typesList[n] === 'solid'){
				solNum += 1
			}
		}
		return solNum
	}
	let moreGas = (e) =>{
		for(let n = 0; n <= typesList.length; n++){
			if(typesList[n] === 'gas'){
				gasNum += 1
			}
		}
		return gasNum
	}
	let highVisc = moreSolid >= moreGas
let nonSlble = ['CO3', 'PO4'].some((str)=>{
	return mol.includes(str)
})
let isSlble = ['Li', 'Na', 'K', 'Rb', 'Cs','Ag', 'Ca', 'Sr', 'Ba', 'Pb', 'Hg', 'N','Cl','Br','I', 'S'].some((s)=>{
	return mo.includes(s)
})
let mllble = ['Ag','As','Al','Cu','Sn','Pt','Pb','Zn'].some((s)=>{
	return mol.includes(s)
})
let isFlameType = ['alkali metals', 'alkali earth metals'].some((str)=>{
	return elmObj.category.includes(str)
})
let isToxic = ['Cd', 'Hg', 'As','Pb', 'Zn', 'Tl', 'Fe', 'Fl', 'Co', 'Po'].some((s)=>{
	return mol.includes(s)
})
let bothSolid = []
let isBrittle = allElements(mol).map((s)=>{
	let elmPhaz = elmntStrg.filter((obj)=>{
		return obj.name === s && obj.phase === 'solid'
	})[0]
	if(elmPhaz.length === 1){
		bothSolid.push('solid')
	}
	let reactiveElmnt = isReactive(s)
	if(reactiveElmnt === true){
		return true
	}else if(reactiveElmnt === false){
		return false
	}
})
bothSolid = bothSolid.every((phse)=>{
	return phse === 'solid'
})
isBrittle = isBrittle.every((bool)=>{
	return bool === true
})

let molIsBrittle = isBrittle === true && bothSolid === true
}
function solveEquation(type, molChemArr, molNumArr){
	//molChemArr - array of elements
	switch(type){
	let prdct = []
	let [mol1Num, mol2Num] = molNumArr
	molChemArr = molChemArr.map((elmArr)=>{
		elmArr = elmArr.toString().replaceAll(',', '')
		return elmArr
	})
	let [chemArr1, chemArr2] = molChemArr.map((chemStr)=>{
		let molStr = extractMols(chemStr).toString().replaceAll(',', '+')
		return molStr
	})

	let lowestMltples = [chemArr1, chemArr2].map((chemArr)=>{
		return Math.min(...chemArr.split('+').map((elmStr)=>{
			let numArr = []
			for(let n = 0; n < elmStr.length; n++){
				if(typeof parseInt(elmStr[n], 10) === 'number'){
					numArr.push(parseInt(elmStr[n], 10))
				}
			}
			return numArr
		}))
	})
		let highestMltples = [chemArr1, chemArr2].map((chemArr)=>{
		return Math.max(...chemArr.split('+').map((elmStr)=>{
			let numArr = []
			for(let n = 0; n < elmStr.length; n++){
				if(typeof parseInt(elmStr[n], 10) === 'number'){
					numArr.push(parseInt(elmStr[n], 10))
				}
			}
			return numArr
		}))
	})
	
	let reactiveElmnts = [chemArr1, chemArr2].map((chemStr)=>{
		return allElements(chemStr).filter((str)=>{
			return remNum(str)
		})
	})
	
	//F4+C6+Ti7 (+) Fl2+He3+H5 ---> 
	/*
	when displacing molecules start with the number of the first element 
	also mind the lowest number of an element
	if there is the same element in the other molecule, remove it and add the number to the same one
	make sure number of elements in molecule parts are multiples of the first reactive element
	
	*/
	let frmlaStr = molChemStr.toString().replaceAll(',', ' + ')
	let rsltMol = ''
		case 'combustion':
		let defMols = ['H20', 'C02']
		rsltMol = sameElmnt(frmlaStr, defMols)
		break;
		case 'single displacement':
		rsltMol = sameElmnt(frmlaStr)
		break;
		case 'synthesis':
		rsltMol = sameElmnt(frmlaStr)
		break;
		case 'double displacement':
		rsltMol = sameElmnt(frmlaStr)
		break;
		case 'neutralization':
		rsltMol = sameElmnt(frmlaStr)
		break;
		default:
		return rsltMol
		break;
	}
	function minNum(nums){
		return Math.min(nums)
	}
	function maxNum(nums){
		return Math.max(nums)
	}
}

/*
1. add first element isolated from parenthesis to the element list
2. number from last should be multiplied by the numbers within the parenthesis from the last index and then be eliminated
3. add first molecule outside of parenthesis to the new molecule list
4. remove it from beginning
*/

function isMetal(elm){
	    let elmntList = elmntsList()
	let elmObj = elmntsStrg.filter((obj)=>{
				return obj.symbol === elm
		})[0]	
		let isMtl = ['transition metal'].some((type)=>{
			return (type === elmObj.category || elmObj.summary.toLowerCase().includes(type) || elmObj.category.toLowerCase().trim().includes(type))
		})
return isMtl		
}
function completeSynth(molArr){
	let elmArr
	if((typeof molArr).toLowerCase() === 'string'){
		elmArr = molArr.split(' + ')
	}
		elmArr = molArr[0].concat(molArr[1])
	let allMetals = elmArr.every((elmnt)=>{
		return isMetal(elmnt) === true
	})
	let hasReactive = elmArr.some((elmnt)=>{
		return isReactive([elmnt]) === true
	})
	let rsltStr = ''
	if(allMetals === true && hasReactive=== false){
		rsltStr = elmArr.replaceAll(',', '')
	}else if(allMetals === false && hasReactive=== true){
		rsltStr = simplify(elmArr)
	}
	function elmSynth(){
	  let [frstMol, secMol] = molArr
	  let reactivesList = molArr.map((arr)=>{
		  return arr.filter((mol_elm)=>{
			  return isReactive([mol_elm]) === true
		  })
	  })
		let elmntsNum = molArr.map((arr)=>{
			return arr.map((elm)=>{
				let numStr = elm.replace(remNums(elm), '')
				return parseInt(numStr, 10)
			})
		})
	 let elmnts = elmntsList()
			  let elctrnCnt = molArr.map((elms)=>{
				  return elms.map((elm)=>{
					  let elmObj = elmnts.filter((obj)=>{
						  return obj.name === elm
					  })[0]
					  return elmObj.shells
				  })
			  })
			let valCnt = elctrnCnt.map((shellArr)=>{
				return shellArr[shellArr.length-1]
			})

	 let [reactiveElms1,reactiveElms2] = reactivesList
	  let [nonreactiveElms1,nonreactiveElms2] = reactivesList.map((arr)=>{
		  let newArr = arr
		  arr.forEach((itm, i)=>{
			   newArr.splice(i, 1)
		  })
		  return newArr
	  })
	
	}
	function equalShare(reactObj, neutralObj){
		let numArr = arguments.map((obj)=>{return obj.number})
		let [reactNum, neutralNum] = numArr
		let shllArr = arguments.map((obj)=>{return obj.valShell})
		let [reactVal, neutralVal] = shllArr
		let insertCnt = 0
		let quotient = 0
		let totalBonds 
		if(reactVal > neutralVal){
			quotient = reactVal / neutralVal
		totalBonds = calcBonds({valence: reactVal, number:reactNum}, {valence: neutralVal, number:neutralNum}, quotient)
		}else if(neutralVal > reactVal){
			quotient = neutralVal / reactVal
		totalBonds = calcBonds({valence: neutralVal, number:neutralNum},{valence: reactVal, number:reactNum}, quotient)
		} 
		
	}
	function calcBonds(main, side, quotient){
		let {mainVal, mainNum} = main
		let {sideVal, sideNum} = side
	   	let prprtnlBonds =  mainNum*quotient
		
		let potentialBonds = mainVal*mainNum
		//remainder of potential bonds to the main molecule
			 let rmndrOfRemaining = (potentialBonds % sideNum)+''
			 rmndrOfRemaining = (rmndrOfRemaining !== 0 && rmndrOfRemaining.includes('.'))? remDec(rmndrOfRemaining) : Math.round(rmndrOfRemaining)
		// are the remaining potential bonds 
		let remaining = potentialBonds - prprtnlBonds
			if(remaining > 0){
				remaining =  rmndrOfRemaining - remaining
				prptnlBonds = prprtnlBonds+remaining
				return prprtnlBonds
			}
			//let lastBonds = potentialBonds - rmndrOfRemaining
	}
	function remDec(decmlStr){
	let isDecml = ((isDecml+'').includes('.') === true)
	let num
	if(isDecml === true){
		let perIdx = decmlStr.indexOf('.')
	  let xtra = isDecml.slice(perIdx, decmlStr)
	  num = decmlStr.replace(xtra, '')
	  return parseInt(num, 10)
	}
	}
	function reactiveElms(elmnts){
		let hasReactive = elmnts.some((elmnt)=>{
		return isReactive([elmnt]) === true
	})
	return hasReactive
	}
	function simplify(){
		let elmMltples = []
		let nonReactiveElms  elmArr.filter((elm, i)=>{
			let newObj = Object.create({})
			newObj.idx = i
			newObj.reactive = isReactive([elm])
			let num = elm.replace(remNums(elm), '')
			if(typeof parseInt(num, 10) === 'number'){
			newObj.number = num
			}
			return newObj
		}) 
		let numMltples = nonReactiveElms.filter((obj)=>{
			return obj.hasOwnProperty('number') 
		}).map((obj)=>{return obj.number})
		let hcf = getHCF(numMltples)
		let lcm = getLCM(hcf)
		numMltples = numMltples.map((num)=>{
			return num / lcm
		})
		elmMltples = numMltples
		return elmMltples
	}
}
function getLCM(hcf){
	let n = 0
	let lcm = (hcf % n !== 0 && n > 0)
	for(n < 10; n++){
		if(hcf % n === 0){
			return n
		}
	}
}
function saveNewMol(tr, tHeads){
	//onclick="saveNewMol(this)" apply to all info rows in all tables
	let molName = tr.title
	let tdList = Array.from(tr.querySelectorAll('td'))
	let listsDiv = allDivs(document.body)['new-mol-list']
	let listDiv = listsDiv.children[0].cloneNode(true)
	
	let {h3, ul} = Array.from(listDiv.children)
	tdList.forEach((td)=>{
		let newLi = ul.children[0].cloneNode(true)
		newLi.innerText = td.innerText
		newLi.style.display = 'block'
		ul.appendChild(newLi)
	})
	h3.innerText = molName
	list.title = molName
	listDiv.style.display = 'block'
	listDiv.ondblclick = (e) =>{
		cnfrmDel(listDiv)
	}

	listDel.onclick = (e) =>{
	 		let newMolsStrg = localStorage.getItem('new_mols')
	newMolsStrg = (newMolsStrg !== null || newMolsStrg !== undefined):JSON.parse(newMolsStrg)? []
	let molExsts = newMolsStrg.some((obj, i)=>{return obj.name === newMolObj.name || obj.frmla === newMolObj.frmla})
		let newMolObj = Object.create({})
	tdHeads.forEach((head, i)=>{
		newMolObj[head] = tr[i]
	})
	if(molExsts ===true){
	localStorage.setItem(newMolObj)
	console.log(localStorage.getItem(newMolObj))
	}
	}
	listsDiv.appendChild(listDiv)
	
	}

function cnfrmDel(elm){
let newMolsStrg = localStorage.getItem('new_mols')
newMolsStrg = (newMolsStrg !== null || newMolsStrg !== undefined):JSON.parse(newMolsStrg)? []
		let cnfrm = confirm('delete '+elm.tagName)
		if(cnfrm === true){
			 elm.remove()
			//		return obj.name === newMolObj.name || obj.frmla === newMolObj.frmla})

			 if(elm.classList.value=== 'new-mol'){
				 let savedMol = newMolsStrg.filter((molObj)=>{
					 return molObj.name === elm.title
				 })[0]
			newMolsStrg.splice(1, savedMol)
			localStorage.getItem('new_mols', JSON.stringify(newMolStrg))
			console.log(JSON.parse(localStorage.getItem('new_mols')))
			 }
		}else{
			e.preventDefault()
		}
	}
function getMolInfo(molStr){
	let wikiURL = 'https://en.wikipedia.org/wiki/'+molStr
	let molInfo = textExtract(wikiURL,'text')
	Promise.resolve(molInfo).then((resObj)=>{
		let {text, html} = resObj['article']
		let frst20 = text.split('.')
		frst20 = frst20.slice(0, 21)
		let descDiv = allDivs()['mol-desc']
		let descs = Array.from(descDiv.children)
		let newDesc = descs[0].cloneNode(true)
		let molDivs = Array.from(newDesc.querySelectorAll('.mol-div'))
		let [imgDiv, molDesc] = molDivs
		molDesc.querySelector('h2').innerText = molStr
		molDesc.querySelector('p').innerText = frst20
		getImages(molStr).then((urlRes)=>{
			molDesc.querySelector('img').src= urlRes
		})
		styleElm(molDesc, {
			display: 'block'
		})
		desc.appendChild(molDesc)
	})
}
function synth(frmla, reactiveElms, elmntsArr){
	let hasReactants = reactiveElms.filter((elmArr)=>{
		return elmArr.length >= 1
	})
	if(hasReactants.length >= 1){
		let displaceType = reactiveElms.map((elmArr, i)=>{			
		  return elmArr.length
		})
		displaceType = getDisplaceType(numArr)
		
		let molObjs = elmntsArr.map((arr, i)=>{
			let elmObj = Object.create({})
				elmObj.idx = i
				elmObj.elmntList = arr
				elmObj.reactiveList = reactiveElms[i]
			return elmObj
		})
		let {frstMol, secMol} = molObjs
		let dbl = [frstMol,secMol].map((obj)=>{
			if(obj.elmntList.length >= 1){
			return obj.elmntsList
			}
		})
		let reactive = molObjs.map((obj)=>{return obj.reactiveList})
		let resultMol = ''
		let isSngleMol = elmntsArr.length === 1
		if(displaceType === 'single displacement'){
			dbl.forEach((arr, i)=>{
				let chngeIdx = (i === 1): 2? 1
				let reactElm = reactive[i]
				let molStr = arr.toString().replaceAll(',', '')
				let othrObj = molObjs[chngeIdx]
				let {othrIndex, othrElmntList, othrReactiveList} = othrObj
				let othrMol = othrMol.toString().replaceAll(',', '')
				if(molStr.includes(reactElm)){
					dbl[i] = dbl[i].replace(reactElm, '')
					dbl[chngeIdx] = dbl[chngeIdx].replace(othrElmntList, reactElm+othrMol)
				}
			})
			resultMol = dbl
		}else if(displaceType === 'synthesis'){
			resultMol = molObjs.map((obj)=>{
				return obj.elmntList.toString().replace(',', '')
			})
			resultMol =resultMol.toString().replaceAll(',')
		}else if(displaceType === 'double displacement'){
							let bothIdxs = [chngeIdx, i]
							bothIdxs.forEach((idxItm)=>{
				let reactElm = reactive[idxItm]
				let molStr = arr.toString().replaceAll(',', '')
				let chngeIdx = (idxItm === 1): 2? 1
				let othrObj = molObjs[chngeIdx]
				let {othrIndex, othrElmntList, othrReactiveList} = othrObj
				let othrMol = othrMol.toString().replaceAll(',', '')
				if(molStr.includes(reactElm)){
					dbl[idxItm] = dbl[idxItm].replace(reactElm, '')
					dbl[chngeIdx] = dbl[chngeIdx].replace(othrElmntList, reactElm+othrMol)
				}
			})
			resultMol = dbl
		}else if(displaceType === 'neutralization'){
			 
		}else if(isSngleMol === true){
			resultMol = elmntsArr[0].toString().replaceAll(',')
		}
	}
}
function getDisplaceType(numArr){
	let boolArr = []
	numArr.forEach((num)=>{
		if(num === 1){
		boolArr.push('one')
		}else if(num > 1){
			boolArr.push('more')
		}
	})
	typeStr = boolArr.toString()
	if(typeStr === 'one,more'){
		return 'single displacement'
	}else if(typeStr === 'more,more'){
		 return 'double displacement'
	}else if(typeStr === 'one,one'){
		return 'synthesis'
	}
}
function getElmntTxts(tagStr){
	document.body.innerHTML = document.body.innerHTML+tagStr
	let htmlStr = lastElmnt.outerHTML
	let notAllwd = ['<style', '<link', '<span', '&'].some((str)=>{
		return htmlStr.includes(str)
	})
	if(notAllwd === true){
	for(let n = 0; n < htmlStr.length; n++){
		let weirdStr = ''
		 if(htmlStr === '&'){
			 		let pmrsndSlice = htmlStr.slice(n, htmlStr.length)
			 for(let n2 = 0; n<pmrsndSlice.length; n++){
				if(pmrsndSlice[n2] === ';'){
					weirdStr = pmrsndSlice.slice(0, n2)
					htmlStr = htmlStr.replace(weirdStr, '')
					break
				}
			 }
		 }
	}
	
	let styleFrst = htmlStr.indexOf('<style>')
	let styleLst = htmlStr.indexOf('</style>')+9
	let lnkTag = htmlStr.indexOf('<link')
	let lnkLst = htmlStr.indexOf('>')+1
	let styleStr = htmlStr.slice(styleFrst,styleLst)
	let linkStr  = htmlStr.slice(lnkTag, lnkLst)
	htmlStr = htmlStr.replace(styleStr, '')
	htmlStr = htmlStr.replace(linkStr, '')
	htmlStr = htmlStr.replace('<span>', '')
	htmlStr = htmlStr.replace('</span>', '')
	document.body.innerHTML = document.body.innerHTML+htmlStr
		let allElmnts = Array.from(document.body.getElementsByTagName('*'))
			let lastElmnt = allElmnts[0]
let tagElmnts = Array.from(lastElmnt.children)
tagElmnts.forEach((tag)=>{
	let tagHTML = tag.outerHTML
	lastElmnt.innerHTML = lastElmnt.replace(tagHTML, tag.innerText)
	})
   return lastElmnt.innerText
}
}

function sameElmnt(frmlaStr, defaultMols){
	//[['H2O'], ['CO2']]
   let ansrStrArr = []
	let dfltElmsArr = defaultMols.map((molStr)=>{
		let elmArr = allElements(molStr)
		let numArr = elmArr.map((elmStr)=>{
			let newObj = Object.create({})
			let elm = remNums(elmStr)
			let num = elmStr.replace(elmStr, elm)
			num = parseInt(num, 10)
			newObj.elm = elm
			newObj.num = num
			return newObj
		})
		ansrStrArr.push([])
		return elmArr
	})
let moleculeArr = frmlaStr.split(' + ').map((xprsn)=>{
	return (xprsn.includes('+') === true) : xprsn.split('+'): [xprsn]
})
moleculeArr.forEach((elmntArr, i, arr)=>{
	if(i === 0){
		othrArr = arr[1]
		elmnteDbls(elmntArr,othrArr)	
	}else if(i === 1){
		othrArr = arr[0]
		elmnteDbls(elmntArr,othrArr)	
	}
})
/*

before putting the proportional element into the array, make sure thaht the default molecules are filled out
*/
let [frstMol, secMol] = moleculeArr.map((mol)=>{return remNum(mol)})
let elmSwitch = []
moleculeArr.forEach((molObj, i)=>{
	let newArr = []
	let {numArr, newStr, elmArr} = molObj
	let molHCF = getHCF(numArr)
	numArr = numArr.map((num, i)=>{
		
		let isPrprtnl = prprtnl(molHCF, num)
		if(isPrprtnl === true){
			newArr.push(elmArr[i]+num)
		 return num 
	}else{
			
		if(dfltElmsArr.length === 1){
			let flldDfltElms = dfltElmsArr.map((arr)=>{
								let cnfrmArr = []
								return cnfrmArr
							})
			dfltElmsArr.forEach((dfltElmArr, i)=>{			
				let [elms, nums] = dfltElmArr
				let havDta = dfltElmArr.every((arr)=>{return arr.length >= 1 })
				if(havDta.length >= 1){
				let hasElms = elms.some((elmSym, i2)=>{
				    return elmSym === elmArr[i] && prprtnl(nums[i2]) === true
				})

					flldDfltElms[i][flldDfltElms[i].length] = (hasElms)					
				}					
			})
			let hasFlldMol = flldDfltElms.map((boolArr)=>{
				let isTrue = boolArr.every((bool)=>{
					return bool === true
				})
					return isTrue				
			})
			if(hasFlldMol.length >= 1){
				let fullMol = hasFlldMol.map((bool, i)=>{
					if(bool === true){
						return dfltElmsArr[i]
					}
				}).filter((arr)=>{
					return typeof arr === 'object' && arr.toString().includes(',')
				})	
			  fullMol.forEach((atomArr, i)=>{
			   atomArr = atomArr.map((atom)=>{  
			   let obj = Object.create({})
			    let elm = remNums(atom)
				let num = atom.replace(elm, '')
				obj.elm = elm
				obj.hcf = num
				obj.atom = atom
				return obj
			   })
			   	//let {numArr, newStr, elmArr} = molObj
				let arr1 = []
			   let arePrp = atomArr.every((atomObj, i2)=>{
				   let {elm,hcf,atom}=atomObj
					   let sameSym = elmArr.filter((e)=>{
						   return e === elm
					   })
					   if(sameSym.length >= 1){
					   let prpNum = numArr[elmArr.indexOf(sameSym[0])]
					let numPrp = prprtnl(hcf, prpNum)
					
					if(numPrp === true){
						let symStr = sameSym[i2]+prpNum
						arr1.push(symStr)
					}
				   }
				   arr1 = arr1.map((itm, i3)=>{
					   return remNum(itm) === sameSym 
				   })
				   if(arr1.length >= 1){
		ansrStrArr[i2] = arr1
				   }
			   })
			  })
			}
		}}
	})
	elmSwitch.push(newArr)
})
elmSwitch = elmSwitch.reverse()
let molStr = []
moleculeArr.forEach((molObj, i)=>{
	let swtchdElmArr = elmSwitch[i].toString().replaceAll(',', '')
		let {numArr, newStr, elmArr} = molObj
		newStr = newStr+swtchdElmArr
		molStr.push(newStr)
		
})

return molStr.toString().replaceAll(',', '')
function prprtnl(num, hcf){
			let isPrprtnl = (num % hcf === 0)
			return isPrptnl
}
function makeAtmObj(){
	
}

function getHCF(numArr){
	let hcf = 0
	for(let n = 1; n < numArr.length; n++){
   let allCmn= numArr.every((num)=>{
	   return  (num % n) === 0
   })
   if(allCmn === true){
	   hcf = num
	   return hcf
   }
	}
}

function elmteDbls(crntArr, othrArr){
	let molObj, othrObj
	if(i === 0){
		molObj = frstMol
		othrObj = secMol
	}else{
		molObj = secMol
		othrObj = frstMol
	}
	molObj = {molNums, molStr, molElmArr}
	othrObj = {othrNums, othrStr, othrElmArr}
	let inOthrNums = []
	inOthr = othrArr.filter((sym, i)=>{
	  let sameElmnts = crntArr.some((sym2, i2)=>{
		   return sym2 === sym
	  })
	 if(sameElmnts === true){
		 inOthrNums.push(othrNums[i])
		 return true
	 }else{
		 return false
	 } 
	})
	inOthr.forEach((sym, i)=>{ 
	let crntMolStr = crntArr.toString()
	let sameElmIdx = sameElmArr.indexOf(sym)
	let sameElmNum = molNums[sameElmIdx]
	let ttlElm = sym+(sameElmNum+inOthrNums[i])
	othrStr = othrStr.replace(sym+inOthrNums[i], ttlElm)
	moleculeArr[i] = molStr.replaceAll(sym+sameElmNum, '')
	if(i === 0){
		moleculeArr[1] = othrStr
	}else{
		moleculeArr[0] = othrStr
	}
})
}
}
function extractMols(str, molArr = [], mltples = []){
	molArr = molArr.map((m)=>{
		return parseInt(m, 10)
	})

	if(str.includes(')') && str.includes('(')){
		//get previous molecule
	for(let n = 0; n<str.length;n++){
		if(str[n] === '('){ 
		//get previous molecule
		let elmBfor = str.slice(0, str.indexOf(str[n]))
		//add previous molecule to array
		if(elmBfor !== ''){
		molArr.push(elmBfor)
		}
		//remove previous molecule
		str = str.replace(elmBfor, '')
		//get new paragraph
		let frstPrnths = str.indexOf(str[n])
		let lastPrnths = str.lastIndexOf(')')
		
		let numsInPrnths = str.slice(frstPrnths, lastPrnths+1)
		if(numsInPrnths.includes('(') && numsInPrnths.includes(')')){
			let frnt = numsInPrnths.indexOf('(')
		   for(let n = 0; n < frnt.length; n++){		
			if(typeof parseInt(chr, 10) === 'number' && n < frnt){
			  frnt[n] = (mltples.length > 0):parseInt(frnt[n], 10)*mltples[mltples.length-1]?1
			}
		  }
		}
		//add number after last paragraph
		let txtAfter = str.slice(lastPrnths+1, str.length)
		if(molArr.length < 1){
		mltples.push(parseInt(txtAfter, 10))
		}else{
		mltples.push(parseInt(txtAfter, 10)*mltples[mltples.length-1])
		}
		//if there are multiples multiply the last mult
		//(Pb(CO3F(Va5)5)8)1
		chngeNums(str, mltples)
		extractMols(str, molArr, mltples)
		
	}}
	}else{
		let {num_arr, new_str} = remNums(str)
		if(new_str === str){
			str = str+'1'
		}else{
			str = str
		}
		molArr.push(str)
		chngeNums(str, mltples)
		let molArrObj = Object.create({})
		molArrObj.molecules = molArr
		molArrObj.multiples = mltples
		molArrObj.chemStr = mltples.map((mltple, i)=>{
			return molArr[i]+mltple
		}).toString().replaceAll(',', '')
		return molArrObj
	}	
function chngeNums(str, mltples){
			str = str.reverse()
		let frstNum	= parseInt(str[0], 10)*mltples[mltples.length-1]
		str = str.replace(str[0], frstNum)
		str = str.reverse()
		str = str.replace(')'+frstNum, '')
		str = str.replace('(', '')
		return str
}
}
//retrieves all elements from the molecular formula
function allElements(molStr){
let elmntStrg = elmntsList()
let elmSyms = elmntStrg.map((obj)=>{
	return extractProp('symbol', obj)
})
let molElmsArr = []
  for(let n = 0; n < molStr.length; n++){
	  let elmStr = ''
	  let crntLtr = molStr[n]
	  let nxtLtr = molStr[n+1]
	  let itrtdStr 
	  if(crntLtr.toUpperCase() && nxtLtr.toLowerCase()){
		  let num
		  if(typeof parseInt(molStr[n+2], 10) === 'number'){
			  num = parseInt(molStr[n+2], 10)
		  }
		  elmStr =(num === undefined):(crntLtr+nxtLtr)?(crntLtr+nxtLtr+num)
	  }else if(crntLtr.toUpperCase() && (typeof parseInt(nxtLtr, 10) === 'number')){
		    let num
			if(typeof parseInt(nxtLtr, 10) === 'number'){
			  num = parseInt(nxtLtr, 10)
		  }
		elmStr = (num === undefined):(crntLtr)?(crntLtr+num)
	  }else if(crntLtr.toUpperCase() && nxtLtr.toUpperCase()){    
		elmStr = crntLtr
	  }else if(crntLtr.toUpperCase() && nxtLtr.toLowerCase() && (typeof parseInt(molStr[n+2], 10) === 'number')){
		  elmStr = crntLtr+nxtLtr+molStr[n+2]
	  }
	  		  itrtdStr = molStr.slice(n, n+elmStr.length)
	      molStr = molStr.replace(itrtdStr,elmStr)	
		  let isSymbl = sym(elmStr)
		  if(isSymbl === true){
		molElmsArr.push(elmStr)
		  }
  }
  return molElmsArr
   function sym(gvnStr){
	  gvnStr = remNums(gvnStr)
	  let {num_arr, new_str} = gvnStr
	    let isSym = elmSyms.some((str)=>{
		  return str === new_str
	  })
	 return isSyn
   }
}
function remNums(gvnStr){
	let numArr= []
	for(let n = 0; n< gvnStr.length; n++){
		   if(typeof parseInt(gvnStr[n], 10) === 'number'){
			   let slicedNum = gvnStr.slice(n, gvnStr.length) 
			   let fullNum
			    for(let fn = 0;fn < slicedNum.length; fn++){
				   if(typeof parseInt(slicedNum[fn], 10) !== 'number'){
					   fullNum = gvnStr.slice(n,n+(fn))
					   fullNum = parseInt(fullNum, 10)
					   numArr.push(fullNum)
				   }   
			   }
			   gvnStr = gvnStr.replace(gvnStr[n], '')
		   }
	   }
	   let newObj = Object.create({})
	   newObj.numArr = numArr
	   newObj.newStr = gvnStr
	   let molStr = newObj.newStr
	   newObj.numArr.forEach((num, i)=>{
		   molStr = molStr.replace(''+num, '#')
	   })
	   newObj.elmArr = molStr.split('#')

	   return newObj
}
function textExtrct(url, type){
	return new Promise((res,rej)=>{
	const url = 'https://news-article-data-extract-and-summarization1.p.rapidapi.com/extract/';
const options = {
	method: 'POST',
	headers: {
		'content-type': 'application/json',
		'X-RapidAPI-Key': '2914da1d34msh351ab7879406227p10bf89jsne4b256644e61',
		'X-RapidAPI-Host': 'news-article-data-extract-and-summarization1.p.rapidapi.com'
	},
	body: {
		url:type
	}
};

fetch(url, options).then(response =>{
	return response.json();
}).then(result =>{
      res(extractProp(type,result))
}).catch((error)=>{
	console.error(error);
})
	})
}
function elmntsList(){
	let elmntStrg = localStorage.getItem('elements')
	elmntStrg = (elmntStrg === null): [] ? JSON.parse(elmntStrg)
	return elmntStrg
}
function pssblePrblms(maxNum){
			maxNum = remDec(maxNum)
			let nArr = []
			for(let sn = 0; sn <= maxNum; sn++){
				nArr.push(sn)
			}
			
		}
function remDec(num){
			let dvsble = ((num/2)+'')
		if(dvsble.includes('.5')){
		 dvsble = dvsble.replace('.5', '')	
		}
		dvsble = parseInt(dvsble, 10)
		return dvsble
}
//scan numbers in array for number that are greater than 1 after that,
//record that value into the object
//iterats through all of the arrays in the arrays
//when encountered with an array in an array, get the index of the array
//in each iteration over an array in the arrays record the index in an object and pass the object into the function
//make an object for each number array 
function scanNumArr(arr){ 
if(arr !== null || arr !== undefined){
	let areOne = allOne(arr)
	if(areOne === true){
		return getDiffCombs(arr)
	}else{
	let newArr = []
	let arrIdxObj = extractProp('', arr)
   var valArr = isArr(arr)
  objKeyFunct(arr)
  return getDiffCords(newArr)
 function objKeyFunct(obj){
  if((typeof obj).toLowerCase() === 'object' ){
  let valIsArr = isArr(obj)
		  console.log('itrtdKeyObj')

 if((typeof obj).toLowerCase() === 'object' && valIsArr === true){
	     for(let i = 0; i < obj.length; i++){
	    objKeyFunct(obj[i], idx)
		 }
	}	
	
  }else if((typeof obj).toLowerCase() === 'number'){
	  let num = (obj % 2 !== 0): remDec(obj)? obj/2
	  if(num > 1){
		 let numArr = pssblePrblms(num)
		  arr[i] = numArr
		  
	  }
  }
  }
}}
function allOne(arrarr){
	arrarr.forEach((itms)=>{
		
		let boolArr = []
		let hasArr = itms.some((itm)=>{
			let isArr = (typeof itm) === 'object' && itm.toString().includes(',')
			return isArr
		})
		isOne()
		if(hasArr === true){
		 let combArr = getDiffCombs(itms)
		 //get each object in every array. after coming to an array, iterate over the objects in the other arrays for their arrays to see if their arrays combos can fit with the others
		combArr = combArr.map((cmbObj, i, arr)=>{
			for(let [cmbProp,cmbArrVal] in cmbObj){
				let elmntValArr = cmbArrVal.map((val, i2,arr2)=>{
					let elmList = elmntsList().filter((obj, i)=>{
						return obj['atomic_mass']
						})
					return 
				})
				if(){
					
				}
			}
		})
		}
		
		return boolArr.every((n)=>{
			return n === true
		})
			function isOne(){
			let one = itms.every((n)=>{
			return n === 1
		})
		boolArr.push(one)
		}
	})

	}
function getDiffCombs(matrx){
	let prblmListObj = Object.create({})
	for(let an = 0; an <= matrx.length; an++){
		let prbmlsList
		if((typeof an).toLowerCase() === 'number'){
			let nArr = []
			for(let b = 0; b <= an; b++){
				nArr.push(1)
			}
			 prblmsList = combine(nArr)
		}else{
			 prblmsList = combine(an)
		}
		let weirdNum = rndmNum()
		prblmsListObj['prblm_list_'+wrdNum] = prblmsList
		
	}
	//iterate through every number in the array
	//iterate through the array for numbers that will equal the max number
	//if the number item plus the iterated number in the number array equals the max number, make a new array for the numbers
	/*
	  if the numbers that equal the max number already exists in the possible problem array, increment the number that adds to the iterated values in the number array
	*/
	return prblmListObj
	function combine(arr){
		let sumPrblms = []
		sumPrblms.push(arr)
		arr.forEach((n, i, oneArr)=>{
			let newArr = []
			sumPrblms.push(newArr)
			let numMax = oneArr.reduce((a,b)=>{return a + b}, 0)
			let crntArr = []
			let combs = oneArr.map((n1,i2)=>{
				let crntIncrmnt= n 
				let crntDiff = numMax - crntIncrmnt
				let crntSum = crntIncrmnt + n1
				if(numMax === crntSum){
				sumPrblms.push([n1, crntIncrmnt])
				}else if(crntSum < numMax){
					if(crntDiff === (numMax-crntMax)){
						crntArr.push(crntDiff)
					}else{
						crntArr.push(crntSum)
					}
				}
			})
			let prblmsHavArr = prblmsExsts(sumPrblms, crntArr)
			if(prblmsHavArr === false){
				sumPrblms.push(crntArr)
			}
		})
		return sumPrblms
	}
}
}
function prblmsExsts(arrArr, numsArr){
	if(arrArr.length >= 1){
	let hasPrblm = arrArr.some((itrtd_arr, i)=>{
		let allNums = itrtd_arr.every((iN, i2)=>{			
			let numsCnt = [0, 0]
			let addPrblmArr = [itrtd_arr,numsArr]
			addPrblmArr.forEach((prblm_arr, i3)=>{
				addPrblmArr[i3] = prblm_arr.sort((a, b)=>{return a - b})
			})
			let prblm_str = addPrblmArr.map((arr)=>{
				return arr.toString()
			})
			 return (prblm_str[0] === prblm_str[1])
			
		})
		return allNums === true
	})
	return hasPrblm=== true
	}else{
		return false
	}
}
function rndmNum(){
	let rndm = (Math.random()+'')
	let rndmNum = rndm.replace('.', '')
	rndmNum = parseInt(rndmNum, 10)
	return rndmNum
}
function extractProp(str,responseObj){ 
if(responseObj !== null || responseObj !== undefined){
   var valArr = isArr(responseObj)
      console.log('object',(typeof responseObj).toLowerCase(), valArr, responseObj)
let resArr = []
  let keys=Object.keys(responseObj) , itrtdKey 
  objKeyFunct(responseObj)
  return resArr[0]
 function objKeyFunct(obj){
  if((typeof obj).toLowerCase() === 'object' ){

let objKeys = Object.keys(obj)
console.log(objKeys)

for(let ki = 0; ki < objKeys.length; ki++){
let itrtdKey = objKeys[ki]
let newKey = itrtdKey.trim()
  let valIsArr = isArr(obj[itrtdKey])
		  console.log('itrtdKeyObj',obj[itrtdKey])
 if(str === itrtdKey){
 let newObj = Object.create({})
 newObj.propName = itrtdKey
 newObj.response = obj[itrtdKey]
  let newArr = [newObj]
  resArr.push(newObj.response)
  console.log(resArr)
  break
//  return resArr[0]
if((typeof obj[itrtdKey]).toLowerCase() === 'object' && valIsArr === true&&str !== itrtdKey){
	
	     for(let i = 0; i < obj[itrtdKey].length; i++){
	    objKeyFunct(obj[itrtdKey][i])
		 }
	}
	console.log('loop',resArr)
	}
	}
  }
  }
}}
//numbers are different atomic numbers
//check to see if the number combinations can form together to make a rational total atomic unit 
//
function nmbrsFit(trgtVal,responseObj){ 
if(responseObj !== null || responseObj !== undefined){
				 let falseArr = [], trueArr = []
			   let falseItmCnt = 0
			   let trueItmCnt = 0
			   let falseNums = 0
			   
			   let unitNumArr = []
   var valArr = isArr(responseObj)
      console.log('object',(typeof responseObj).toLowerCase(), valArr, responseObj)
let resArr = []
  let keys=Object.keys(responseObj) , itrtdKey 
  objKeyFunct(responseObj)
  return resArr[0]
 function objKeyFunct(obj){
	 let newArr = []
let objKeys = Object.keys(obj)	 
let areNums = allNums(obj)
				let itmArrTrgtVals = getArrUnitSum((falseNumCnt+trueNumCnt), falseNumCnt, trueNumCnt,trueArr, falseArr)

  if((typeof obj).toLowerCase() === 'object' && areNums === false && valArr === true){

let objKeys = Object.keys(obj)
console.log(objKeys)

for(let ki = 0; ki < objKeys.length; ki++){
let itrtdKey = objKeys[ki]
let newKey = itrtdKey.trim()
  let valIsArr = isArr(obj[itrtdKey])
  if(valIsArr === false){
	  	dataFromArr(obj[itrtdKey])
  }else if(valIsArr === true){
	  let areAllNums = allNums(obj[itrtdKey])
if(areAllNums === true){
				   return itmArrTrgtVals   
}else if(areAllNums === false){
	dataFromArr(obj[itrtdKey])
}
    nmbrsFit(obj[itrtdKey])
  }
	}
 }else if((typeof obj).toLowerCase() === 'object' && areNums === true){
	     dataFromArr(obj)
	  }
	   if(trueArrs.length === 0 && falseArrs.length > 0){
				return itmArrTrgtVals   
			   }else if(falseArrs.length === 0 && trueArrs.length > 0){
			   nmbrsFit(itmArrTrgtVals,elmntsList)   
			   }
    }
  }
  function dataFromArr(obj){
	  for(let i = 0; i < obj[itrtdKey].length; i++){
			 let valIsArr2 = isArr(obj[itrtdKey])
			 if(valIsArr2 === true){
			 let allNums2 = allNums(obj[itrtdKey])
			 let trueArrs = obj[itrtdKey].map((itm, i2)=>{
				  if(isArr(itm) === true){
					  trueArr.push(itm)
					  return true
				  }else{
				    falseArr.push(itm)
					  return false
				  }
			 })
			 let trueCnt = trueArrs.filter((b, i2)=>{
				 return b === true
			 })
			 trueCnt = trueCnt.length
	       if(allNums2 === true){
			   return itmArrTrgtVals   
		   }else if(allNums === false){
			   let itmCnt = obj[itrtdKey].length
			   let arrNumCnt = arrCnt(obj[itrdtdKey])
			   //[[2,7,9], 3, 8, 9]
			   let arrStrs = trueArrs.map((bool, i3)=>{
				   if(bool === true){
					   let arrItm = obj[itrtdKey][i3].toString()
					   let allNums = remChars(['[', ']'], arrItm)
					   let arrNumSum = allNums.reduce((a,b)=>{return a + b}, 0)
					   trueItmCnt += 1
					   unitNumArr.push(arrNumSum)
				   }else{
					    falseItmCnt+=1
						falseNums+=1
					unitNumArr.push(obj[itrtdKey])
				   }
			   })
	        }
		  }
	    }
  }
  function placeElmnt(numArr,trgtVal){
	  let elmList = elementList()
	  let nums = numArr.map((n,i3,arr)=>{
		  return elmList.filter((elmObj, i2)=>{
			  return elmObj['number'] === n
		  })[0]['atomic_mass']
	  })
	  let massTtl = nums.reduce((a, b)=>{
		  return a+ b
		  }, 0)
	  return massTtl === trgtVal
  }
  function getArrUnitSum(ttl,falseTtl,trueTtl,trueArrs, falseArrs){
	  let arrItmsInfo = [trueArrs, falseArrs].map((numArr, i)=>{
		  let newObj = Object.create({})
		  newObj.totalUnits = numArr.reduce((a, b)=>{
			  return a + b
		  }, 0)
		  newObj.totalPerc = (newObj.totalUnits*100)/ttl
		  return newObj
	  })
	  
	 let arrItmTtls = [falseTtl, trueTtl].map((t, i)=>{
		 return (ttl - t)
	 })
	 let [trueArrItmTtl, falseArrItmTtl] = arrItmTtls
    
	 let retObj = Object.create({})
	 retObj.trueArrs= trueArrs
	 retObj.falseArrs = falseArrs
	 retObj.trueItmTtl = trueArrItmTtl
	 retObj.falseItmTtl = falseArrItmTtl
	 return retObj
  }
  function arrCnt(arr){
	  let n = 0
	  for(let i =0; i < arr.length; i++){
		  let isArrVar = isArr(arr[i])
		  if(isArrVar === true){
			  n += 1
		  }
	  }
	  return n
  }
  function allNums(arr){
	let areNums = objKeys.every((key, i, a)=>{
	return (typeof key).toLowerCase() === 'number'
})
return areNums  
  }
}
function getSmlrElm(propValArr){
	let elmList = elmntsList()
	let elmObjProps = Object.keys(elmList[0])
	let elmnts = propValArr.map((obj)=>{
		let objProps = Object.keys(obj)
	    let hasProps = elmObjProps.some((str, i, arr)=>{
			return objProps.some((str2,i2)=>{
				let [newStr, newStr2]= [str, str2].map((s)=>{
				  return str2.toLowerCase().trim().replace(' ', '_')
				})
				return newStr === newStr2
				})
				
			})
		return hasProps
		})
		return elmnts
	}

function remChars(chars, str){
	chars.forEach((c, i)=>{
		str.replaceAll(c, '')
	})
	for(let n = 0; n <= str.length; n++){
		if(str[n] === ','){
			let crntSlice = str.slice(n, str.length)
			for(let n2 = 0; n2 <= crntSlice.length; n2++){
				let notCma = crntSlice[n2] !== ','
				if(notCma === true){
					let xtndedCmas = crntSlice.slice(0, n2+1)
					str = str.replace(xtndedCmas,'')
					return str
				}
			}
		}
	}
}
function isArr(responseObj){
     var allNums = Object.keys(responseObj).map(function(s){
       return (typeof s === 'number')? parseInt(s, 10): s
     }).every(function(num){
       return (typeof num).toLowerCase() === 'number'
     })
	 return allNums
     }
	function loadCode(txt, iframe){
  let file = new Blob([txt], {type: 'text/html'})
  let codeURL = window.URL.createObjectURL(file) || window.URL.webkitcreateObjectURL(file)
  console.log(txt, codeURL)
  try{
  let frameCntnt = iframe.contentWindow || iframe.contentWindow.document || iframe.contentDocument
 frameCntnt.document.open()
 frameCntnt.document.write(txt)
 frameCntnt.document.close()
}catch(e){console.log(console.error(e))}

try{
iframe.srcdoc = codeURL	
}catch(e){console.log(e.name, e.message)}
}
function styleElm(elm, obj){
	let keys = Object.keys(obj)
	keys.forEach((k, i, arr)=>{
		elm.style[k] = obj[k] 
	})
	return elm
}
function allDivs(div, sel){
let elm = (div === undefined)? document.body.getElementsByTagName('*') : div.getElementsByTagName('*')
 return elm
}
function rndmNum(){
  let rndm = (Math.random()+'')
  let num = rndm.slice(rndm.indexOf('.'), rndm.length)
  return parseInt(num, 10)
} 
function getElmURL(elm){
	return new Promise((res, rej)=>{
	const url = 'https://serphouse.p.rapidapi.com/serp/live';
const options = {
	method: 'POST',
	headers: {
		'content-type': 'application/json',
		Authorization: 'Bearer <api_token>',
		'Content-Type': 'application/json',
		Accept: 'application/json',
		'X-RapidAPI-Key': '2914da1d34msh351ab7879406227p10bf89jsne4b256644e61',
		'X-RapidAPI-Host': 'serphouse.p.rapidapi.com'
	},
	body: {
		data: {
			domain: 'google.co.uk',
			lang: 'en',
			q: elm+' Wikipedia',
			loc: 'United States',
			device: 'desktop',
			serp_type: 'web'
		}
	}
};
fetch(url, options).then(response=>{
	return response.json()
	}).then(result=>{
		let elmntTraits = ['melting point', 'boiling point', 'density', 'solubility','Volume','Thermal Conductivity','acidity','hygroscopity','Strength', 'triple point']

	let wikiLink = extractProp('organic', result).filter((obj)=>{
		return obj.url.toLowerCase().includes('wikipedia') || obj.url.toLowerCase().includes('elm')
		})[0].link
		let elmHTML = textExtract(wikiLink,'html')
        let newFrame = document.createElement('iframe')
		let codeLoaded = loadCode(elmHTML, newFrame)
		let getTable = newFrame.querySelector('table')
		let trList = Array.from(getTable.querySelectorAll('tr'))
		let imprtntTRs = trList.filter((trElm)=>{
			let elmCode = trElm.innerHTML.toLowerCase()
			let trait = elmntTraits.some((str, i)=>{
				return elmCode.includes(str)
			})
			return trait === true
		})
		if(imprtntTRs.length >= 1){
		let dtlPairs = imprtntTRs.map((traitElm)=>{
			let elms = ['th', 'td']
			let divClne = document.createElement('div')
			divClne.innerHTML = traitElm
			let getTRElms = elms.map((str)=>{
				return divClne.querySelector(str)
			})
			let newArr = []
			let [tbleHead,tbleDta] = getTRElms.map((tbleElm)=>{
			let dtaStr = getElmntTxts(tbleElm)
			dtaStr = dtaStr.toLowerCase().trim().replaceAll(' ', '-')			
			return dtaStr
			})
			let newObj = Object.create({})
			newObj.rowHead = tbleHead
			newObj.value = tbleDta
			return newObj
		
		})
		res(JSON.stringify(dtlPairs))
		}
}).catch((error)=>{
	console.error(error);
})
	})
}
function getImages(t){
		return new Promise(res=>{
	console.log(t,'term')
srchImg(t).then(x=>{
console.log(x)
JSON.parse(x).forEach((imgObj)=>{
  res(imgObj.url)
})
}).catch(e=>{console.log(e.name, e.message, 'line 791')})
		})
}
function srchImg(term){

return new Promise(res=>{
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '2914da1d34msh351ab7879406227p10bf89jsne4b256644e61',
		'X-RapidAPI-Host': 'webit-image-search.p.rapidapi.com'
	}
};

fetch('https://webit-image-search.p.rapidapi.com/search?q='+term+'&number=1', options)
	.then(response =>{ 
	return response.json()
	}).then(response => {
	if(response['status'] === '200'){
	  let imgRes = response['data']['results']
	  console.log(imgRes)
	  res(JSON.stringify(imgRes))
	}else{
	console.log('search image error')
	}
	}).catch(err => console.error(err));

  	
	})
}
