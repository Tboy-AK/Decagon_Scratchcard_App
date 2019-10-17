$(document).ready(()=>{
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
							success: (data1,status1)=>{
								console.log("Network Signin GET success");
								//if sign in is already occupied, sign that profile out
								if (data1.length!==0) {
									for(let i=0;i<data1.length; i++) {
										$.ajax({
											url: "http://localhost:3000/signin/"+data1[i].id,
											method: "DELETE",
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
				console.log("Network Signin GET success\n");
				signedinUser=data[0].username;
				signedinEmail=data[0].email;
				$("header.appHeader h4.salutation").text("Welcome, "+signedinUser);
				$("header.appHeader p.salutation span").text(signedinEmail);
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
			$.ajax({
				url: "http://localhost:3000/generated",
				method: "GET",
				data: {
					email: signedinEmail
				},
				dataType: "json",
				success: (data, status)=>{
					console.log("Network success\n");
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
										for(let i=0; i<data1.length; i++){
											scratchcardTableBody.append(
												"<tr class='row"+(i+1)+"'>" +
													"<th class='sNum' scope='row'>"+(i+1)+"</th>" +
													"<td class='value'>"+data1[i].value+"</td>" +
													"<td class='bought'>"+"-----------------"+"</td>" +
													"<td class=''>"+data1[i].pin+"<input type='checkbox' name='row"+(i+1)+"'></td>" +
												"<tr>"
											);
											$.ajax({
												url: "http://localhost:3000/bought",
												method: "GET",
												data: {
													email: signedinEmail
												},
												dataType: "json",
												success: (data3, status3)=>{
													console.log("Network boughtPIN GET success");
													if(data3.length!==0){
														for(let j=0; j<data3.length; j++){
															$("table.pinsList tbody tr.row"+data3[j].scratchcardSN+" td.bought").text(data3[j].pin);
														}
													}
												},
												error: ()=>{
													console.log("Network boughtPIN GET error");
												}
											});
										}
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
				url: "http://localhost:3000/generated",
				method: "GET",
				data: {
					email: signedinEmail
				},
				dataType: "json",
				success: (data1, status1)=>{
					console.log("Network generatedPIN GET success");
					if(data1.length!==0){
						for(let i=0; i<data1.length; i++){
							scratchcardTableBody.append(
								"<tr class='row"+(i+1)+"'>" +
									"<th class='sNum' scope='row'>"+(i+1)+"</th>" +
									"<td class='value'>"+data1[i].value+"</td>" +
									"<td class='bought'>--------------------</td>" +
									"<td class='generated'>"+data1[i].pin+"<input type='checkbox' name='row"+(i+1)+"'></td>" +
								"<tr>"
							);
							$.ajax({
								url: "http://localhost:3000/bought",
								method: "GET",
								data: {
									email: signedinEmail
								},
								dataType: "json",
								success: (data, status)=>{
									console.log("Network generatedPIN GET success");
									if(data.length!==0){
										for(let j=0; j<data.length; j++){
											$("table.pinsList tbody tr.row"+(data1.findIndex((e)=>{return e.scratchcardSN===data[j].scratchcardSN})+1)+" td.bought").text(data[j].pin);
										}
									}
								},
								error: ()=>{
									console.log("Network boughtPIN GET error");
								}
							});
						}
					}
				},
				error: ()=>{
					console.log("Network generatedPIN GET error");
				}
			});
			viewBtn.css("display","none");
			buyBtn.css("visibility","visible");
			detBtn.css("visibility","visible");
			scratchcardTable.css("visibility","visible");
		});
	
	
		let selectedPINS=[];
		
			
			/*$.ajax({
				url: "http://localhost:3000/generated",
				method: "GET",
				data: {
					email: signedinEmail
				},
				dataType: "json",
				success: (data, status)=>{
					console.log("Network generatedPIN GET success for checklist");
					for(let i=0; i<data.length; i++){
						//selectedPINS[data[i].scratchcardSN]=data[i].scratchcardSN;
						if($("input[name='row"+data[i].scratchcardSN+"']").prop("checked")){
							
							//console.log(JSON.stringify(data[i]));
							selectedPINS.push(data[i]);
							//console.log($("input[name='row"+data[i].scratchcardSN+"']:checked").attr("name"));
						}
					}
					//console.log("checklist\n"+JSON.stringify(selectedPINS));
				},
				error: ()=>{
					console.log("Network generatedPIN GET error for checklist");
				}
			});*/
	
	//delete scratchcard
		
		
		detBtn.on("click", ()=>{
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
						//selectedPINS[data[i].scratchcardSN]=data[i].scratchcardSN;
						if($("input[name='row"+(i+1)+"']").prop("checked")){
							
							//console.log(JSON.stringify(data[i]));
							selectedPINS.push(data[i]);
							//console.log($("input[name='row"+data[i].scratchcardSN+"']:checked").attr("name"));
							
							$.ajax({
								url: "http://localhost:3000/generated/"+data[i].id,
								method: "DELETE",
								success: ()=>{
									console.log("Network generatedPIN GET success for  deleting PINs");
									
									$.ajax({
										url: "http://localhost:3000/generated",
										method: "GET",
										data: {
											email: signedinEmail
										},
										dataType: "json",
										success: (data2, status2)=>{
											console.log("Network generatedPIN GET success\n");
											if(data2.length!==0){
												scratchcardTableBody.empty();
												for(let j=0; j<data2.length; j++){
													scratchcardTableBody.append(
														"<tr class='row"+(j+1)+"'>" +
															"<th class='sNum' scope='row'>"+(j+1)+"</th>" +
															"<td class='value'>"+data2[j].value+"</td>" +
															"<td class='bought'>--------------------</td>" +
															"<td class='generated'>"+data2[j].pin+"<input type='checkbox' name='row"+(j+1)+"'></td>" +
														"<tr>"
													);
													$.ajax({
														url: "http://localhost:3000/bought",
														method: "GET",
														data: {
															email: signedinEmail
														},
														dataType: "json",
														success: (data3, status3)=>{
															console.log("Network generatedPIN GET success");
															if(data3.length!==0){
																for(let k=0; k<data3.length; k++){
																	$("table.pinsList tbody tr.row"+(data2.findIndex((e)=>{return e.scratchcardSN===data3[k].scratchcardSN})+1)+" td.bought").text(data[k].pin);
																}
															}
														},
														error: ()=>{
															console.log("Network boughtPIN GET error");
														}
													});
												}
											}
										},
										error: ()=>{
											console.log("Network generatedPIN GET error");
										}
									});
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
		});
	

    //buy scratchcard
        //a scratchcard is not bought until paid for
        //delete scratchcards from generated_scratchcards and update the `generated` column after buying
        //post bought scratchcards in `bought_scratchcards` db rsource
        //this resource will have a main property named after the signed-in username
        //the other properties fall under this usernamed property
        //add the bought scratchcard to the `bought` column of the scratchcard table
		let purchaseBody = $("table.pinsList tbody");
		
});