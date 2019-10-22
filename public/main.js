$(document).ready(()=>{
	//don't delete multiple things at a time
    $('#myModal').on('shown.bs.modal', function () {
        $('#myInput').trigger('focus');
    });
    $(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });

    //sign-up user
        //check for input errors after a blur/keyup on the given input
        //for errors, add custom error-defined attributes to the given input, else remove
        //use css display property to manipulate the input error correction fields
        //post input details to users db resource if no input errors
        //hide sign-up section and display sign-in section
        let regUsername = $("#regUsername");
        let regEmail = $("#regEmail");
        let regPass = $("#regPassword");
        let confirmPass = $("#confirmPassword");
        let regBtn = $("#regBtn");
		let signinLink = $("#sign-in-link button");
		let signinFrame = $("#sign-in-frame");
		let errorRegMail = $("#error-regMail");
		let errorPassAlert = $("#error-confirmPass"); 
	
	$("form").on("submit", (e)=>{
		e.preventDefault();
	});
	$("button[type='submit']").on("submit", (e)=>{
		e.preventDefault();
	});
	
	let user = {
		username: regUsername.val(),
		email: regEmail.val(),
		password: regPass.val()
	};
	
	/*regBtn.on("submit", (e)=>{
		e.preventDefault();
	});*/
	
	signinLink.on("click", ()=>{
		signupFrame.fadeOut(600, "swing", ()=>{
			signinFrame.fadeIn(1000);
			$(".error").css("display", "none");
		});
	});
	/*
	regBtn.on("click", ()=>{
		if(regPass.val()===confirmPass.val()){
			$(".error").css("display", "none");
			$.ajax({
				url: "http://localhost:3000/users",
				method: "GET",
				data: {"email":regEmail.val()},
				dataType: "json",
				success: (data, status)=>{
					if (regEmail.val().length!==0)
					{errorRegMail.css("display", "block").text("* email has been registered\nplease sign in");}
				},
				error: (data, status)=>{
					$(".error").css("display", "none");
					console.log("Details, not on register!");
					$.ajax({
						url: "http://localhost:3000/users",
						method: "POST",
						data: JSON.stringify(user),
						dataType: "json",
						success: (data, status)=>{
							window.open("index.html", "_self", "", true);
							alert("Account Successful\nYou can now Sign in");
						},
						error: (data, status)=>{
							console.log(status+"\nFailed to POST\nor\nServer breakdown after POST");
						}
					});
				}
			});
		} else {
			if (regPass.val()!==confirmPass.val()) {
				errorPassAlert.css("display", "block").text("* the passwords do not match");
			} else if (regPass.val()===confirmPass.val()) {
				errorPassAlert.css("display", "none");
			}
		}
		
	});*/

    //sign-in user
        //check for input errors after a blur/keyup on the given input
        //verify user input
        //empty signed-in db resource
        //post input details to `signed-in` db resource if no input errors
        let inputEmail = $("#inputEmail");
        let inputPass = $("#inputPassword");
        let signinBtn = $("#signinBtn");
		let signupLink = $("#sign-up-link button");
		let signupFrame = $("#sign-up-frame");
		let errorSigninAlert = $("#error-signin");
	
	signinBtn.on("submit", (e)=>{
		e.preventDefault();
	});
	
	signupLink.on("click", ()=>{
		signinFrame.fadeOut(600, "swing", ()=>{
			signupFrame.fadeIn(1000);
		});
	});
	
	let inStatus="signed-in"; //haven't made use of this yet
	let signedinUser;
	let signedinEmail;
	signinBtn.on("click", ()=>{
		if(inputEmail.val().length!==0 && inputPass.val().length!==0) {
			//check if user with the given email and password exists
			$.ajax({
				url: "http://localhost:3000/users",
				method: "GET",
				async: false,
				data: {
					email: inputEmail.val(),
					password: inputPass.val()
				},
				dataType: "json",
				success: (data, status)=>{
					console.log("Signin GET success");
					//condition to check if such profile exists
					if (data.length!==0 && data[0].email===inputEmail.val() && data[0].password===inputPass.val()) {
						errorSigninAlert.css("display", "none");
						console.log("user found\n"+data[0].username+"\n"+data[0].email);
						//check against a previously signed in user
						$.ajax({
							url: "http://localhost:3000/signin",
							method: "GET",
							async: false,
							success: (data1,status1)=>{
								console.log("Network Signin GET success");
								
								//if sign in is already occupied, sign that profile out
								if (data1.length!==0) {
									for(let i=0;i<data1.length; i++) {
										$.ajax({
											url: "http://localhost:3000/signin/"+data1[i].id,
											method: "DELETE",
											async: false,
											success: ()=>{
												console.log("Success Sign out previous user");
											},
											error: ()=>{
												console.log("Network error Sign out previous user\n"+JSON.stringify(data1));
											}
										});
									}
								}
								
								//when sign in is empty, sign in new session
								if (data1.length===0) {
									$.ajax({
										url: "http://localhost:3000/signin",
										method: "POST",
										data: data[0],
										dataType: "json",
										async: false,
										success: (data2, status2)=>{
											console.log("Network Signin POST success\n"+JSON.stringify(data2));
											window.open("main.html", "_self", "", true);
										},
										error: ()=>{
											console.log("Network error Sign in");
										}
									});
								}
							},
							error: ()=>{
								console.log("Network error previous user");
							}
						});
					} else {
						console.log("email-password pair not registered");
						errorSigninAlert.css("display", "block").text("* Incorrect email or password.Sign up if you don't have an account.");
					}
				},
				error: ()=>{
					console.log("Signin GET failed");
				}
			});
		}
	});
	

	//the main app
	$.ajax({
		url: "http://localhost:3000/signin",
		method: "GET",
		dataType: "json",
		success: (data, status)=>{
			//check for user presence in `signin` before any further requests can be made
			if(data.length!==0){

				/*$(window).on("unload", ()=>{
					$.ajax({
						url: "http://localhost:3000/signin",
						method: "GET",
						data: {
							email: inputEmail.val(),
							password: inputPass.val()
						},
						dataType: "json",
						success: (dataOnClose, statusOnClose)=>{
							$.ajax({
								url: "http://localhost:3000/signin/"+dataOnClose[0].id,
								method: "DELETE",
								error: ()=>{
									console.log("Network error cleaning end session");
								}
							});
						},
						error: ()=>{
							console.log("Network GET error cleaning end session");
						}
					});
				});*/
			//generate scratchcard
				//post generated scratchcard to `generated_scratchcards` db resource
				//this resource will have a main property named after the signed-in username
				//the other properties fall under this usernamed property
				//add the generated scratchcard to the `generated` column of the scratchcard table
				let signoutBtn = $("#sign-out-link button");
				let valueSet = $("select");
				let generatorBtn = $("#generatorBtn");
				let generatorDisplay = $("p.pinGenerator");

				let viewBtn = $("div.pinsList button:first");
				let buyBtn = $("button.buy-scratch-btn");
				let detBtn = $("button.det-scratch-btn");
				let scratchcardTable = $("table.pinsList");
				let scratchcardTableBody = $("table.pinsList tbody");

				//tag webpage with username and email
				$.ajax({
					url: "http://localhost:3000/signin",
					method: "GET",
					dataType: "json",
					success: (data, status)=>{
						if(data.length!==0){
							console.log("Network Signin GET success\n");
							signedinUser=data[0].username;
							signedinEmail=data[0].email;
							$("header.appHeader h4.salutation").text("Welcome, "+signedinUser);
							$("header.appHeader p.salutation span").text(signedinEmail);
						}
					},
					error: ()=>{
						console.log("Network error GET Sign in");
					}
				});

				//signout functionailty
				signoutBtn.on("click", ()=>{
					$.ajax({
						url: "http://localhost:3000/signin",
						method: "GET",
						data: {
							username:signedinUser,
							email: signedinEmail
						},
						dataType: "json",
						success: (data,status)=>{
							$.ajax({
								url: "http://localhost:3000/signin/"+data[0].id,
								method: "DELETE",
								success: ()=>{
									console.log("succesful signout");
									window.open("index.html", "_self", "", true);
									alert("Succesfully Signed out");
								},
								error: ()=>{
									console.log("Failed to Sign out\nprobably Server breakdown");
								}
							});
						},
						error: ()=>{
							console.log("Failed to GET Sign out");
						}
					});
				});

				//generate PINS
				generatorBtn.on("click", ()=>{
					let randomPIN=[];
					//generate a 17-digit PIN
					for(let i=0; i<17; i++){
						randomPIN.push(Math.floor(Math.random()*10));
					}

					//specify algorithm for a given scratchcard value
					if(valueSet.val()==="200"){
						randomPIN[0]=2;
						randomPIN[5]=2;
						randomPIN[12]=2;
					} else if(valueSet.val()==="500"){
						randomPIN[0]=5;
						randomPIN[5]=5;
						randomPIN[12]=5;
					} else if(valueSet.val()==="1000"){
						randomPIN[0]=3;
						randomPIN[5]=3;
						randomPIN[12]=3;
					}
					generatorDisplay.text(randomPIN.join(""));

					let generatedPIN = {
						pin: randomPIN.join(""),
						value: valueSet.val(),
						email: signedinEmail,
						scratchcardSN: ""
					}

					//Display generated and stored scratchcards created by the user
					//first create serial number for the cards before posting
					$.ajax({
						url: "http://localhost:3000/generated",
						method: "GET",
						data: {
							email: signedinEmail
						},
						dataType: "json",
						success: (data, status)=>{
							console.log("Network success");
							generatedPIN.scratchcardSN = data.length + 1;
							$.ajax({
								url: "http://localhost:3000/generated",
								method: "POST",
								data: generatedPIN,
								dataType: "json",
								success: (data2, status2)=>{
									console.log("Network generatedPIN POST success\n");
									$.ajax({
										url: "http://localhost:3000/generated",
										method: "GET",
										data: {
											email: signedinEmail
										},
										dataType: "json",
										success: (data1, status1)=>{
											console.log("Network generatedPIN GET success\n");
											if(data1.length!==0){
												scratchcardTableBody.empty();
												
												$.ajax({
													url: "http://localhost:3000/bought",
													method: "GET",
													data: {
														email: signedinEmail
													},
													dataType: "json",
													success: (data3, status3)=>{
														console.log("Network boughtPIN GET success");
														
														//for(let j=0; j<data3.length; j++) {
															//$("table.pinsList tbody tr.row"+(data1.findIndex((e)=>{return e.pin===data3[j].pin})+1)+" td.bought").text(data3[j].pin);
														
														for(let i=0; i<data1.length; i++) {
															scratchcardTableBody.append(
																"<tr class='row"+(i+1)+"'>" +
																	"<th class='sNum' scope='row'>"+(i+1)+"</th>" +
																	"<td class='value'>"+data1[i].value+"</td>" +
																	"<td class='bought'>"+"-----------------"+"</td>" +
																	"<td class='generated'>"+data1[i].pin+"<input type='checkbox' name='row"+(i+1)+"'></td>" +
																"<tr>"
															);
														}
														for(let k=0; k<data3.length; k++) {
															if(data3.length!==0){
																$("table.pinsList tbody tr.row"+(data1.findIndex((e)=>{return e.pin===data3[k].pin})+1)+" td.bought").text(data3[k].pin);
																$("table.pinsList tbody tr.row"+(data1.findIndex((e)=>{return e.pin===data3[k].pin})+1)+" td.generated").text(data3[k].pin);
															}
														}
														//}
													},
													error: ()=>{
														console.log("Network boughtPIN GET error");
													}
												});
											}
										},
										error: ()=>{
											console.log("Network generatedPIN GET error");
										}
									});
								},
								error: ()=>{
									console.log("Network generatedPIN error");
								}
							});
						},
						error: ()=>{
							console.log("Network error");
						}
					});
				});

				//scratchcard table display functionality
				viewBtn.on("click", ()=>{
					$.ajax({
						url: "http://localhost:3000/bought",
						method: "GET",
						data: {
							email: signedinEmail
						},
						dataType: "json",
						success: (data3, status3)=>{
							console.log("Network boughtPIN GET success for refreshing");

							//for generated
							$.ajax({
								url: "http://localhost:3000/generated",
								method: "GET",
								data: {
									email: signedinEmail
								},
								dataType: "json",
								success: (data2, status2)=> {
									console.log("Network generatedPIN GET success for refreshing");
									scratchcardTableBody.empty();
									for(let j=0; j<data2.length; j++) {
										scratchcardTableBody.append(
											"<tr class='row"+(j+1)+"'>" +
												"<th class='sNum' scope='row'>"+(j+1)+"</th>" +
												"<td class='value'>"+data2[j].value+"</td>" +
												"<td class='bought'>-----------------</td>" +
												"<td class='generated'>"+data2[j].pin+"<input type='checkbox' name='row"+(j+1)+"'></td>" +
											"<tr>"
										);
									}
									for(let k=0; k<data3.length; k++) {
										if(data3.length!==0) {
											$("table.pinsList tbody tr.row"+(data2.findIndex((e)=>{return e.pin===data3[k].pin})+1)+" td.bought").text(data3[k].pin);
											$("table.pinsList tbody tr.row"+(data2.findIndex((e)=>{return e.pin===data3[k].pin})+1)+" td.generated").text(data3[k].pin);
										}
									}
								},
								error: ()=>{
									console.log("Network generatedPIN GET error");
								}
							});
						},
						error: ()=>{
							console.log("Network boughtPIN GET error");
						}
					});
					viewBtn.css("display","none");
					buyBtn.css("visibility","visible");
					detBtn.css("visibility","visible");
					scratchcardTable.css("visibility","visible");
				});



			//delete scratchcard
				let selectedPINS=[];
				detBtn.on("click", ()=>{
					$.ajax({
						url: "http://localhost:3000/bought",
						method: "GET",
						data: {
							email: signedinEmail
						},
						dataType: "json",
						async: false,
						success: (dataBoughtdet, statusBoughtdet)=>{
							$.ajax({
								url: "http://localhost:3000/generated",
								method: "GET",
								data: {
									email: signedinEmail
								},
								dataType: "json",
								success: (data, status)=>{
									console.log("Network generatedPIN GET success for checklist");
									for(let i=0; i<data.length; i++){

										if($("input[name='row"+(i+1)+"']").prop("checked")){
											selectedPINS.push(data[i]);
											$.ajax({
												url: "http://localhost:3000/generated/"+data[i].id,
												method: "DELETE",
												async: false,
												success: ()=>{
													console.log("Network generatedPIN GET success for deleting PINs");
												},
												error: ()=>{
													console.log("Network generatedPIN GET error for deleting PINs");
												}
											});
										}
									}
									console.log("checklist\n"+JSON.stringify(selectedPINS));

								},
								error: ()=>{
									console.log("Network generatedPIN GET error for checklist");
								}
							});
						},
						error: ()=>{
							console.log("Network boughtPIN GET error for checklist");
						}
					});
					
					//refresh the table body content
					$.ajax({
						url: "http://localhost:3000/bought",
						method: "GET",
						data: {
							email: signedinEmail
						},
						dataType: "json",
						success: (data3, status3)=>{
							console.log("Network boughtPIN GET success for refreshing");

							//for generated
							$.ajax({
								url: "http://localhost:3000/generated",
								method: "GET",
								data: {
									email: signedinEmail
								},
								dataType: "json",
								success: (data2, status2)=> {
									console.log("Network generatedPIN GET success for refreshing");
									scratchcardTableBody.empty();
									for(let j=0; j<data2.length; j++) {
										scratchcardTableBody.append(
											"<tr class='row"+(j+1)+"'>" +
												"<th class='sNum' scope='row'>"+(j+1)+"</th>" +
												"<td class='value'>"+data2[j].value+"</td>" +
												"<td class='bought'>-----------------</td>" +
												"<td class='generated'>"+data2[j].pin+"<input type='checkbox' name='row"+(j+1)+"'></td>" +
											"<tr>"
										);
									}
									for(let k=0; k<data3.length; k++) {
										if(data3.length!==0){
											$("table.pinsList tbody tr.row"+(data2.findIndex((e)=>{return e.pin===data3[k].pin})+1)+" td.bought").text(data3[k].pin);
											$("table.pinsList tbody tr.row"+(data2.findIndex((e)=>{return e.pin===data3[k].pin})+1)+" td.generated").text(data3[k].pin);
										}
									}
								},
								error: ()=>{
									console.log("Network generatedPIN GET error");
								}
							});
						},
						error: ()=>{
							console.log("Network boughtPIN GET error");
						}
					});
				});

			//buy scratchcard
				//a scratchcard is not bought until paid for
				//delete scratchcards from generated_scratchcards and update the `generated` column after buying
				//post bought scratchcards in `bought_scratchcards` db rsource
				//this resource will have a main property named after the signed-in username
				//the other properties fall under this usernamed property
				//add the bought scratchcard to the `bought` column of the scratchcard table
				let purchaseBody = $("table.pinsList tbody");
				//$("table.pinsList tbody tr");
				let priceTotalView = $("div.screenbox h1 span:nth-of-type(1)");
				let quantity200 = $("p.quantity200");
				let price200 = $("p.price200 span:nth-of-type(2)");
				let quantity500 = $("p.quantity500");
				let price500 = $("p.price500 span:nth-of-type(2)");
				let quantity1000 = $("p.quantity1000");
				let price1000 = $("p.price1000 span:nth-of-type(2)");

				buyBtn.on("click", ()=>{
					//price display section
					
					let pay200, pay500, pay1000, totalPrice, amount200=[], amount500=[], amount1000=[];
					$.ajax({
						url: "http://localhost:3000/bought",
						method: "GET",
						data: {
							email: signedinEmail
						},
						dataType: "json",
						async: false,
						success: (datatoBuy, statustoBuy)=>{
							console.log("Network GET bought for price success");
							$.ajax({
								url: "http://localhost:3000/generated",
								method: "GET",
								data: {
									email: signedinEmail
								},
								dataType: "json",
								async: false,
								success: (dataViewBuy, statusViewBuy)=>{
									console.log("Network GET generated for price success");
									selectedPINS=[];
									for(let d=0; d<dataViewBuy.length; d++){
										
										if($("input[name='row"+(d+1)+"']").prop("checked")){
											selectedPINS.push(dataViewBuy[d]);
											console.log(dataViewBuy[d]);
											if(dataViewBuy[d].value==200) {
												amount200.push(dataViewBuy[d]);
											} else if(dataViewBuy[d].value==500) {
												amount500.push(dataViewBuy[d]);
											} else if(dataViewBuy[d].value==1000) {
												amount1000.push(dataViewBuy[d]);
											}
										}
										
									}
									pay200 = amount200.length * 200;
									pay500 = amount500.length * 500;
									pay1000 = amount1000.length * 1000;
									totalPrice = pay200 + pay500 + pay1000;

									priceTotalView.text(totalPrice);
									quantity200.text(amount200.length);
									price200.text(pay200);
									quantity500.text(amount500.length);
									price500.text(pay500);
									quantity1000.text(amount1000.length);
									price1000.text(pay1000);

								},
								error: ()=>{
									console.log("Network error GET generated for price");
								}
							});
						},
						error: ()=>{
							console.log("Network error GET bought for price");
						}
					});
				});


				//payment section
				let cardNumber1 = $("fieldset.card-digits input:nth-of-type(1)");
				let cardNumber2 = $("fieldset.card-digits input:nth-of-type(2)");
				let cardNumber3 = $("fieldset.card-digits input:nth-of-type(3)");
				let cardNumber4 = $("fieldset.card-digits input:nth-of-type(4)");
				let cardMonth = $("fieldset.card-date input[placeholder='mm']");
				let cardYear = $("fieldset.card-date input[placeholder='yy']");
				let cardCVC = $("fieldset.card-cvc input");
				let cardHolder = $("fieldset.card-name input");
				let payBtn = $("#payBtn");

				cardNumber1.on("keyup", (e)=>{
					if(cardNumber1.val().length>=4){
						for(let i=0; i<4; i++){
							cardNumber1.val(cardNumber1.val().slice(0,4));
						}
						cardNumber2.focus();
					}
				});
				cardNumber1.on("change", ()=>{
					if(cardNumber1.val()[0]+cardNumber1.val()[1]+cardNumber1.val()[2]!=="444" && cardNumber1.val()[0]+cardNumber1.val()[1]+cardNumber1.val()[2]!=="555"){
						$("#error-number").text("* invalid card. Rewrite the card number.").css("display", "block");
					} else {
						$("#error-number").css("display", "none");
					}
				});
				cardNumber2.on("keyup", (e)=>{
					if(cardNumber2.val().length>=4){
						for(let i=0; i<4; i++){
							cardNumber2.val(cardNumber2.val().slice(0,4));
						}
						cardNumber3.focus();
					}
					if(e.key==="Backspace" && cardNumber2.val().length===0){
						cardNumber1.focus();
					}
				});
				cardNumber3.on("keyup", (e)=>{
					if(cardNumber3.val().length>=4){
						for(let i=0; i<4; i++){
							cardNumber3.val(cardNumber3.val().slice(0,4));
						}
						cardNumber4.focus();
					}
					if(e.key==="Backspace" && cardNumber3.val().length===0){
						cardNumber2.focus();
					}
				});
				cardNumber4.on("keyup", (e)=>{
					if(cardNumber4.val().length>=4){
						for(let i=0; i<4; i++){
							cardNumber4.val(cardNumber4.val().slice(0,4));
						}
						cardMonth.focus();
					}
					if(e.key==="Backspace" && cardNumber4.val().length===0){
						cardNumber3.focus();
					}
				});
				cardMonth.on("keyup", ()=>{
					if(cardMonth.val().length>=2) {
						$("#error-month").css("display", "none");
						if(isNaN(Number(cardMonth.val()))) {
							console.log(Number(cardMonth.val()));
							$("#error-month").text("* invalid input. Month should be in number.").css("display", "block");
							} else if(!isNaN(Number(cardMonth.val())) && (Number(cardMonth.val())<1 || Number(cardMonth.val())>12)) {
								$("#error-month").text("* invalid month range.").css("display", "block");
							} else {
								$("#error-month").css("display", "none");
							}
						cardYear.focus();
					} else if (cardMonth.val().length===0){
						$("#error-month").css("display", "none");
					} else {
						$("#error-month").text("* invalid month range.").css("display", "none");
					}
				});
				cardYear.on("keyup", ()=>{
					if(cardYear.val().length>=2){
						$("#error-year").css("display", "none");
						if(isNaN(Number(cardYear.val()))) {
							$("#error-year").text("* invalid input. Year should be in number.").css("display", "block");
						} else if(!isNaN(Number(cardYear.val())) && Number(cardYear.val())<20) {
							$("#error-year").text("* invalid year range.").css("display", "block");
						} else {
							$("#error-year").css("display", "none");
						}
						cardCVC.focus();
					} else if (cardYear.val().length===0){
						$("#error-year").css("display", "none");
					} else {
						$("#error-year").text("* invalid year range.").css("display", "block");
					}
				});
				cardCVC.on("keyup", ()=>{
					if(cardCVC.val().length>=3){
						if(isNaN(Number(cardCVC.val()))) {
							$("#error-cvc").text("* invalid input.").css("display", "block");
						} else {
							$("#error-cvc").css("display", "none");
						}
						cardHolder.focus();
					} else if (cardCVC.val().length===0){
						$("#error-cvc").css("display", "none");
					} else {
						$("#error-cvc").text("* invalid input.").css("display", "block");
					}
				});
				payBtn.on("click", ()=>{
					if((cardNumber1.val().length + cardNumber2.val().length + cardNumber3.val().length + cardNumber4.val().length !== 16) || isNaN(Number(cardNumber1.val() + cardNumber2.val() +  cardNumber3.val() + cardNumber4.val()))){
						$("#error-number").text("* invalid card. Rewrite the card number.").css("display", "block");
					} else {
						$("#error-number").css("display", "none");
						$.ajax({
							url: "http://localhost:3000/generated",
							method: "GET",
							data: {
								email: signedinEmail
							},
							dataType: "json",
							success: (dataGenBuy, statusGenBuy)=>{
								console.log("Network generatedPIN GET success for bought");
								for(let t=0; t<dataGenBuy.length; t++){
									//Send data to `bought` resource before deletion
									if($("input[name='row"+(t+1)+"']").prop("checked")){
										selectedPINS.push(dataGenBuy[t]);
										$.ajax({
											url: "http://localhost:3000/bought",
											method: "POST",
											data: dataGenBuy[t],
											dataType: "json",
											async: false,
											success: (data4, status4)=>{
												console.log("Network POST  to bought success");
											},
											error: ()=>{
												console.log("Network POST to bought error");
											}
										});
										/*$.ajax({
											url: "http://localhost:3000/generated/"+dataGenBuy[t].id,
											method: "DELETE",
											async: false,
											success: ()=>{
												console.log("Network generatedPIN GET success for deleting PINs");
											},
											error: ()=>{
												console.log("Network generatedPIN GET error for deleting PINs");
											}
										});*/
									}
									
								}
								//refresh the table body content
								$.ajax({
									url: "http://localhost:3000/bought",
									method: "GET",
									data: {
										email: signedinEmail
									},
									dataType: "json",
									success: (data3, status3)=>{
										console.log("Network boughtPIN GET success for refreshing");

										//for generated
										$.ajax({
											url: "http://localhost:3000/generated",
											method: "GET",
											data: {
												email: signedinEmail
											},
											dataType: "json",
											success: (data2, status2)=> {
												console.log("Network generatedPIN GET success for refreshing");
												scratchcardTableBody.empty();
												for(let j=0; j<data2.length; j++) {
													scratchcardTableBody.append(
														"<tr class='row"+(j+1)+"'>" +
															"<th class='sNum' scope='row'>"+(j+1)+"</th>" +
															"<td class='value'>"+data2[j].value+"</td>" +
															"<td class='bought'>-----------------</td>" +
															"<td class='generated'>"+data2[j].pin+"</td>" +
														"<tr>"
													);
												}
												for(let k=0; k<data3.length; k++) {
													if(data3.length!==0){
														$("table.pinsList tbody tr.row"+(data2.findIndex((e)=>{return e.pin===data3[k].pin})+1)+" td.bought").text(data3[k].pin);
													}
												}
												window.open("main.html", "_self", "", true);
											},
											error: ()=>{
												console.log("Network generatedPIN GET error");
											}
										});
									},
									error: ()=>{
										console.log("Network boughtPIN GET error");
									}
								});
							},
							error: ()=>{
								console.log("Network generatedPIN GET error for bought");
							}
						});
					}
				});
				
			}
		},
		error: ()=>{
			console.log("Network error GET Sign in");
		}
	});
    
});