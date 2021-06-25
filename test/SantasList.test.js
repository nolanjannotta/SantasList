const SantasList = artifacts.require("./SantasList");

const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const { expect } = require('chai');
require('chai')
	.use(require('chai-as-promised'))
	.should()
const tokens = (n) => {
	return new web3.utils.BN(web3.utils.toWei(n.toString(), 'ether'))
}

contract("SantasList", ([santa, nice1, nice2, naughty1, naughty2]) => {
	let santasList, santasAddress, name1, name2, result1, result2, nicelist, naughtylist, fee, nice1fee, nice2fee

	before(async () => {
		santasList = await SantasList.new()
		santasAddress = santasList.address



	})

	it("deploys successfully", async () => {
		assert.notEqual(santasAddress, 0x0)
      	assert.notEqual(santasAddress, '')
      	assert.notEqual(santasAddress, null)
      	assert.notEqual(santasAddress, undefined)
      	console.log("contract address:", santasAddress)
	})
	it("has a getNice fee", async () =>{
		fee = await santasList.fee({from: santa})
		console.log(fee.toString())
	})

	describe ("Nice List", async () => { 

		it("Allows Santa to add people to the Nice List", async () => {
			name1 = "Bob"
			name2 = "Alice"
			result1 = await santasList.nice(name1, nice1, {from: santa})
			result2 = await santasList.nice(name2, nice2, {from: santa})
		})

		it("emits Nice event", async () => {

			expectEvent(result1, 'Nice', {
				_name: name1,
				_address: nice1
			});
			expectEvent(result2, 'Nice', {
				_name: name2,
				_address: nice2
			});
		})

		it("contract can return the Nice List", async () => {
			nicelist = await santasList.NiceList({from: santa})
			console.log("Nice List:", nicelist)

		})
	})

	describe("Naughty list", async () => {


		it("allows Santa to add people to the Naughty list", async () => {
			name1 = "Frank"
			name2 = "Tim"
			result1 = await santasList.naughty(name1, naughty1, {from: santa})
			result2 = await santasList.naughty(name2, naughty2, {from: santa})
		})

		it("emits Naughty event", async () => {

			expectEvent(result1, 'Naughty', {
				_name: name1,
				_address: naughty1
			});
			expectEvent(result2, 'Naughty', {
				_name: name2,
				_address: naughty2
			});

		})

		it("contract can return the Naughty List", async () => {
			naughtylist = await santasList.NaughtyList({from: santa})
			console.log("Naughty List:", naughtylist)

		})

	})

	describe("Get Nice", async() => {
		let nice1fee, nice2fee, nice3fee
		name1 = "Frank"
		name2 = "Tim"

		it("allows users on the naughty list to pay to be moved to nice list", async () => {
			result = await santasList.getNice(name1, {from: naughty1, value: tokens(1) })
			nicelist = await santasList.NiceList({from: santa})
			console.log("Nice List:", nicelist)
			naughtylist = await santasList.NaughtyList({from: santa})
			console.log("Naughty List:", naughtylist)

		})

		it("splits fees between nice people", async () => {
			nice1fee = await santasList.niceFees(nice1)
			nice2fee = await santasList.niceFees(nice2)
			assert.equal(nice1fee.toString(), tokens(.5).toString())
			assert.equal(nice2fee.toString(), tokens(.5).toString())
		})
		// it("gets nice and transfers again...", async () => {
		// 	result = await santasList.getNice(name2, {from: naughty2, value: tokens(1) })
		// 	nicelist = await santasList.NiceList({from: santa})
		// 	console.log("Nice List:", nicelist)
		// 	naughtylist = await santasList.NaughtyList({from: santa})
		// 	console.log("Naughty List:", naughtylist)

		// })

		// it("splits fees again", async () => {
		// 	nice1fee = await santasList.niceFees(nice1)
		// 	nice2fee = await santasList.niceFees(nice2)
		// 	nice3fee = await santasList.niceFees(naughty1)
		// 	assert.equal(nice1fee.toString(), (tokens(5/6).toString()))
		// 	assert.equal(nice2fee.toString(), (tokens(5/6).toString()))
		// 	assert.equal(nice3fee.toString(), (tokens(1/3).toString()))
		// })

	})

	describe("cashing out", async () => {

		it("allows users to transfer their nicefee to their account", async () => {
			result = await santasList.cashOut({from: nice1})
			// console.log(result)
			fee = await santasList.niceFees(nice1)
			assert.equal(fee, 0)
		})

		it("emits cashout event", async () => {
			expectEvent(result, "cashout", {
				_address: nice1,
				_fee: tokens(.5).toString()
			})
		})
	})

})
























