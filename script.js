		"use strict";


		$("#i2cList").sortable();
		$("#checkpointsList").sortable();
		
		
		// <!-- let data={ -->
			// <!-- V1:{type:"i2c",x:"10%",y:"10%",side:false}, -->
			// <!-- V2:{type:"i2c",x:"20%",y:"20%",side:false}, -->
			// <!-- V3:{type:"i2c",x:"30%",y:"30%",side:true}, -->
			// <!-- V4:{type:"i2c",x:"40%",y:"40%",side:true}, -->
			// <!-- V5:{type:"i2c",x:"99%",y:"99%",side:false}, -->
			// <!-- V6:{type:"i2c",x:"97%",y:"97%",side:false}, -->
			// <!-- R1:{type:"checkpoint",text:"50 Ohm",left:"10%",top:"15%",right:"80%",bottom:"75%",side:false}, -->
			// <!-- C1:{type:"checkpoint",text:"20 uF",left:"15%",top:"20%",right:"75%",bottom:"70%",side:true}, -->
			// <!-- R2:{type:"checkpoint",text:"55 kOhm",left:"20%",top:"25%",right:"70%",bottom:"65%",side:true}, -->
			// <!-- C2:{type:"checkpoint",text:"50 uF",left:"25%",top:"30%",right:"65%",bottom:"60%",side:false}, -->
		// <!-- }; -->
		
		
		
		// <!-- for(const [key,value] of Object.entries(data)){ -->
			// <!-- let elem=document.createElement("li"); -->
			// <!-- elem.innerHTML=key; -->
			// <!-- document.querySelector("#list>ul").append(elem); -->
		// <!-- }; -->
		
		//infoPanel=document.createElement("div");	  
		//infoPanel.classList.add("classList");
		
		
		// <!-- (function($){ -->
			// <!-- $("#logo").on("click",function(){ -->
				// <!-- $("#list").toggleClass("hidden"); -->
			// <!-- }); -->
			// <!-- $("#board").scroll(function(){ -->
				// <!-- console.log("adsadsa"); -->
				// <!-- $("#image").width($("#image").width()/1.1); -->
				// <!-- return false; -->
			// <!-- }) -->
		// <!-- })(jQuery); -->
		let map=document.getElementById("map");
		let canvas=document.getElementById("canvas");
		let ctx=canvas.getContext("2d");
		ctx.fillStyle="rgba(0,0,0,0.7)";
		ctx.strokeStyle="rgb(255,0,0)";
		
				

		let mapLeftBorder=document.querySelector("#map .map-left-border"),
			mapTopBoreder=document.querySelector("#map .map-top-border"),
			mapTopLeftCorner=document.querySelector("#map .map-top-left-corner"),
			flipMap=document.getElementById("flipMap"),
			mapImage=document.querySelector("#map img"),
			board=document.getElementById("board"),
			sideFlag=true,
			image=document.getElementById("image"),
			logo=document.getElementById("logo"),
			i2cList=document.getElementById("i2cList"),
			sidePanel=document.getElementById("sidePanel"),
			checkpointsList=document.getElementById("checkpointsList"),
			connectButton=document.getElementById("connect"),
			dummyLayer=document.getElementById("dummyLayer");
			
		let side_image=new Image();
	
	
	
	
	
	
	
	
	
		const WHEEL_FACTOR=1000,
			  MARKER_WIDTH=2,
			  MARKER_TO_BOARD_WIDTH_RATIO=5,
			  MAP_MIN_WIDTH=100,
			  MAP_MAX_WIDTH=400,
			  //image=document.getElementById("image"),
			  //board=document.getElementById("board"),
			  infoLayer=document.getElementById("infoLayer");
		
		function scaleAndScroll(scaleFactor,x,y,multiply=null){
			let scrollLeft=board.scrollLeft,
				scrollTop=board.scrollTop,
				resultWidth=scaleFactor*(multiply? infoLayer.clientWidth:board.clientWidth);
			
			if(resultWidth<=board.clientWidth){
					infoLayer.classList.add("fitted");
					refreshMap();
					return;
			}else{
				infoLayer.classList.remove("fitted");
			};
			
			infoLayer.style.width=resultWidth+"px";
				
			if(typeof(x)==="number"&&typeof(y)==="number"){
				let offsetLeft=x-dummyLayer.offsetLeft,
					offsetTop=y-dummyLayer.offsetTop;
				
				board.scroll((scrollLeft+offsetLeft)*scaleFactor-offsetLeft,
							 (scrollTop+offsetTop)*scaleFactor-offsetTop);
			}else if(typeof(x)==="string"&&typeof(y)==="string"){
				board.scroll(parseFloat(x)*infoLayer.clientWidth/100-board.clientWidth/2,
							 parseFloat(y)*infoLayer.clientHeight/100-board.clientHeight/2);
			};
			
			refreshMap();
			//board.dispatchEvent(new CustomEvent("scroll"));
			
			console.log("scroll");
		};
		
		logo.addEventListener("click",function(){
			document.getElementById("sidePanel").classList.toggle("hidden");
			if(board.clientWidth>infoLayer.clientWidth) infoLayer.classList.add("fitted");
			refreshMap();
		});
		
		dummyLayer.addEventListener("wheel",function(event){
			event.preventDefault();
			let dXsign=Math.sign(event.deltaX),
				dYsign=Math.sign(event.deltaY),
				factor=1;
			if(dXsign&&dYsign) return;
			if(dXsign) factor*=event.deltaX;
			if(dYsign) factor*=event.deltaY;
			factor/=(-WHEEL_FACTOR);
			factor+=1;
			
			scaleAndScroll(factor,event.clientX,event.clientY,true);
		});
		
		image.addEventListener("pointerdown",function down(pressEvent){
			event.preventDefault();
			let that=this;
			this.classList.add("grabbing");
			let fromX=pressEvent.clientX,
				fromY=pressEvent.clientY;
			function move(moveEvent){
				board.scrollBy(fromX-moveEvent.clientX,
							   fromY-moveEvent.clientY);
				fromX=moveEvent.clientX;
				fromY=moveEvent.clientY;
			};
			function up(){
				that.classList.remove("grabbing");
				this.removeEventListener("pointermove",move);
				this.removeEventListener("pointerup",up);
			};
			document.addEventListener("pointermove",move);
			document.addEventListener("pointerup",up);
		});
		
		function refreshMap(){
			ctx.clearRect(0,0,canvas.width,canvas.height);
			ctx.fillRect(0,0,canvas.width,canvas.height);
			
			let left=canvas.width*board.scrollLeft/infoLayer.clientWidth;
			let top=canvas.height*board.scrollTop/infoLayer.clientHeight;
			let width=canvas.width*board.clientWidth/infoLayer.clientWidth;
			let height=canvas.height*board.clientHeight/infoLayer.clientHeight;
			ctx.clearRect(left,top,width,height);
			ctx.strokeRect(left,top,width,height);
			
			document.querySelectorAll(".i2cList-field").forEach((elem)=>elem.fit());
			
			console.log("refresh");
		};
		
		board.addEventListener("scroll",refreshMap);
		
		window.addEventListener("resize",function(){
			if(infoLayer.clientWidth<=board.clientWidth) infoLayer.classList.add("fitted");
			refreshMap();
		});
		
		[{elem:mapLeftBorder,top:false},
		 {elem:mapTopBoreder,top:true},
		 {elem:mapTopLeftCorner,top:false}].forEach(function(item){
			item.elem.addEventListener("mousedown",function(event){
				event.stopPropagation();
				
				let moveEventHandler=moveBorderGen(item.top);
				
				document.addEventListener("mousemove",moveEventHandler);
				document.addEventListener("mouseup",function mouseUp(event){
					document.removeEventListener("mousemove",moveEventHandler);
					document.removeEventListener("mouseup",mouseUp);
				});
			});
		});

		function moveBorderGen(top){
			console.log("moveborder");
			return function moveBorder(event){
				event.preventDefault();
				
				let width;
				
				if(top){
					width=(map.offsetTop+map.offsetHeight-event.clientY)*map.offsetWidth/map.offsetHeight;
				}else{
					width=map.offsetLeft+map.offsetWidth-event.clientX;
				};
				if(width<MAP_MIN_WIDTH||width>MAP_MAX_WIDTH) return;
				map.style.width=width+"px";
			};
		};
		
		map.addEventListener("mousedown",function(event){
			if(event.button!==0) return;
			map.addEventListener("mouseup",function mouseUp(){
				map.classList.toggle("folded");		
				map.removeEventListener("mouseup",mouseUp);
			});
		});
		
		
		let board,side;
		
		async function loaded(){
			let data=await fetch("/admin/set/info");
			let json=await data.json();
			
			let obj=JSON.parse(json);
			
			image.src=obj.image;
			mapImage.src=obj.image;
			
			board=obj.board;
			board=obj.side;
		};
		
		
		EventTarget.prototype.addEventListenerWrapper=function(event,eventHandler){
			this.addEventListener("mouseleave",function(){
				this.removeEventListener(event,eventHandler);
			});
			this.addEventListener(event,eventHandler);
		};
		
		
		Element.prototype.onhover=function(pointerOnCallback,pointerOffCallback){
			this.onmouseenter=function(){
				pointerOnCallback();
				this.addEventListener("mouseleave",function mouseleave(){
					pointerOffCallback();
					this.removeEventListener("mouseleave",mouseleave);
				});
			};
		};
		
		document.getElementById("i2cList_add").setAttribute("data-dummyMarkerExist",false);
		document.getElementById("checkpointsList_add").setAttribute("data-dummyMarkerExist",false);
		
		
		//dummyLayer.addEventListener
		
		document.getElementById("i2cList_add").onclick=function(){
			let heightOffset=side_image.width*MARKER_WIDTH/(2*side_image.height);
			if("false"===this.getAttribute("data-dummyMarkerExist")){
				let dummyMarker=document.createElement("div");
				dummyMarker.classList.add("i2cList-marker");
				dummyMarker.style.width="10%";
				dummyMarker.style.position="absolute";
				dummyMarker.style.left="45%";
				dummyMarker.style.top="45%";
				dummyLayer.append(dummyMarker);
				
				let cancelButton=document.createElement("div");
				cancelButton.textContent="cancel";
				cancelButton.style.position="absolute";
				
				cancelButton.style.right=board.clientWidth/10+"px";
				
				dummyMarker.onclick=(event)=>{
					dummyMarker.onclick=null;
					console.log("click")
					this.setAttribute("data-dummyMarkerExist",false);
					let x=(dummyMarker.offsetLeft+dummyMarker.clientWidth/2+board.scrollLeft)*100/infoLayer.clientWidth+"%";
					let y=(dummyMarker.offsetTop+dummyMarker.clientHeight/2+board.scrollTop)*100/infoLayer.clientHeight+"%";
					//dummyMarker.style.width=MARKER_WIDTH+"%";
					cancelButton.remove();
					dummyMarker.remove();
					//infoLayer.append(dummyMarker);
					
					let f1=function(){console.log(this);this.marker.style.width=MARKER_WIDTH+"%";
											 this.marker.style.top="calc("+y+" - "+heightOffset+"%)";
											 this.marker.style.left="calc("+x+" - "+MARKER_WIDTH/2+"%)";};
					let f2=function(){this.field.style.top="calc("+y+" + "+heightOffset+"%)";
											this.field.style.left="calc("+x+" + "+MARKER_WIDTH/2+"%)";
											this.field.setAttribute("data-top",parseFloat(y)+heightOffset);
											this.field.setAttribute("data-left",parseFloat(x)+MARKER_WIDTH/2);
											$(this.field).resizable({containment:this.parent,stop:function(){
												let left=(100*this.offsetLeft/this.parentElement.clientWidth),
													top=(100*this.offsetTop/this.parentElement.clientHeight),
													width=(100*this.clientWidth/this.parentElement.clientWidth),
													height=(100*this.clientHeight/this.parentElement.clientHeight);
												this.style.left=left+"%";
												this.style.top=top+"%";
												this.style.width=width+"%";
												this.style.height=height+"%";
											}});};
					
					let boardInfoRender=new BoardInfoRender("new",null,f1,
							f2,"i2cList-marker","i2cList-field",i2cList,infoLayer);
					boardInfoRender.render();
				}
				
				
				cancelButton.style.top=board.clientHeight/10+"px";
				cancelButton.onclick=()=>{dummyMarker.remove();cancelButton.remove();this.setAttribute("data-dummyMarkerExist",false)}
				
				dummyLayer.append(cancelButton);
				
				
				
				this.setAttribute("data-dummyMarkerExist",true);
			}
		};
		
		document.getElementById("checkpointsList_add").onclick=function(){
		let heightOffset=side_image.width*MARKER_WIDTH/(2*side_image.height);
			if("false"===this.getAttribute("data-dummyMarkerExist")){
				let dummyMarker=document.createElement("div");
				dummyMarker.classList.add("ckeckpointsList-marker");
				dummyMarker.style.left=board.clientWidth/10+"px";
				dummyMarker.style.right=board.clientWidth/10+"px";
				dummyMarker.style.top=board.clientHeight/10+"px";
				dummyMarker.style.bottom=board.clientHeight/10+"px";
				dummyMarker.style.position="absolute";
				$(dummyMarker).resizable({handles:"all",});
				dummyLayer.append(dummyMarker);
				
				let cancelButton=document.createElement("div");
				cancelButton.textContent="cancel";
				cancelButton.style.position="absolute";
				
				
				dummyMarker.onclick=(event)=>{
					dummyMarker.onclick=null;
					console.log("click")
					this.setAttribute("data-dummyMarkerExist",false);
					
					let left=(dummyMarker.offsetLeft+board.scrollLeft)*100/infoLayer.clientWidth;
					let top=(dummyMarker.offsetTop+board.scrollTop)*100/infoLayer.clientHeight;
					let bottom=(infoLayer.clientHeight<board.clientHeight)? 100:(dummyMarker.offsetTop+dummyMarker.offsetHeight+board.scrollTop)*100/infoLayer.clientHeight;
					let right=(dummyMarker.offsetLeft+dummyMarker.offsetWidth+board.scrollLeft)*100/infoLayer.clientWidth;
					
					console.log(bottom);console.log(right);
					
					cancelButton.remove();
					dummyMarker.remove();
					//infoLayer.append(dummyMarker);
					
					let f1=function(){
											this.marker.style.left=left+"%";
											 this.marker.style.right=100-right+"%";
											 this.marker.style.top=top+"%";
											 this.marker.style.bottom=100-bottom+"%";
											 
											 $(this.marker).resizable({classes:{},containment:this.parent,
											 handles:"all",
											 stop:function(){
												let left=(100*this.offsetLeft/this.parentElement.clientWidth),
													top=(100*this.offsetTop/this.parentElement.clientHeight),
													width=(100*this.clientWidth/this.parentElement.clientWidth),
													height=(100*this.clientHeight/this.parentElement.clientHeight);
												this.style.left=left+"%";
												this.style.top=top+"%";
												this.style.width=width+"%";
												this.style.height=height+"%";
											}});
					};
					let f2=function(){
						this.field.style.top=bottom+heightOffset+"%";
											this.field.style.left=right+MARKER_WIDTH/2+"%";
											this.field.setAttribute("data-top",bottom+heightOffset);
											this.field.setAttribute("data-left",right+MARKER_WIDTH/2);
											$(this.field).resizable({containment:this.parent,stop:function(){
												let left=(100*this.offsetLeft/this.parentElement.clientWidth),
													top=(100*this.offsetTop/this.parentElement.clientHeight),
													width=(100*this.clientWidth/this.parentElement.clientWidth),
													height=(100*this.clientHeight/this.parentElement.clientHeight);
												this.style.left=left+"%";
												this.style.top=top+"%";
												this.style.width=width+"%";
												this.style.height=height+"%";
					}})};
					
					let boardInfoRender=new BoardInfoRender("new",null,f1,
							f2,"ckeckpointsList-marker","ckeckpointsList-field",checkpointsList,infoLayer);
					boardInfoRender.render();
				}
				
				cancelButton.style.right=board.clientWidth/10+"px";
				
				cancelButton.style.top=board.clientHeight/10+"px";
				cancelButton.onclick=()=>{dummyMarker.remove();cancelButton.remove();this.setAttribute("data-dummyMarkerExist",false)};
				dummyLayer.append(cancelButton);
				
				
				
				this.setAttribute("data-dummyMarkerExist",true);
			}
		};
		
		
		
		
		
		
		
		let setMarker_i2c=function(x,y,heightOffset){this.marker.style.width=MARKER_WIDTH+"%";
											 this.marker.style.top="calc("+y+" - "+heightOffset+"%)";
											 this.marker.style.left="calc("+x+" - "+MARKER_WIDTH/2+"%)";};
		
		
		let setField_i2c=function(x,y,heightOffset){this.field.style.top="calc("+y+" + "+heightOffset+"%)";
											this.field.style.left="calc("+x+" + "+MARKER_WIDTH/2+"%)";
											this.field.setAttribute("data-top",parseFloat(y)+heightOffset);
											this.field.setAttribute("data-left",parseFloat(x)+MARKER_WIDTH/2);
											$(this.field).resizable({containment:this.parent,stop:function(){
												let left=(100*this.offsetLeft/this.parentElement.clientWidth),
													top=(100*this.offsetTop/this.parentElement.clientHeight),
													width=(100*this.clientWidth/this.parentElement.clientWidth),
													height=(100*this.clientHeight/this.parentElement.clientHeight);
												this.style.left=left+"%";
												this.style.top=top+"%";
												this.style.width=width+"%";
												this.style.height=height+"%";
											}});}
		
		let setMarker_checkpoint=function(left,right,top,bottom,heightOffset){this.marker.style.left=left;
											 this.marker.style.width=100-parseFloat(right)-parseFloat(left)+"%";
											 this.marker.style.top=top;
											 this.marker.style.height=100-parseFloat(bottom)-parseFloat(top)+"%";
											 $(this.marker).resizable({classes:{},containment:this.parent,
											 handles:"all",
											 stop:function(){
												let left=(100*this.offsetLeft/this.parentElement.clientWidth),
													top=(100*this.offsetTop/this.parentElement.clientHeight),
													width=(100*this.clientWidth/this.parentElement.clientWidth),
													height=(100*this.clientHeight/this.parentElement.clientHeight);
												this.style.left=left+"%";
												this.style.top=top+"%";
												this.style.width=width+"%";
												this.style.height=height+"%";
											}});};
		let setField_checkpoint=function(left,right,top,bottom,heightOffset){this.field.style.top="calc(100% - "+bottom+" + "+heightOffset+"%)";
											this.field.style.left="calc(100% - "+right+" + "+MARKER_WIDTH/2+"%)";
											this.field.setAttribute("data-top",100-parseFloat(bottom)+heightOffset);
											this.field.setAttribute("data-left",100-parseFloat(right)+MARKER_WIDTH/2);
											$(this.field).resizable({containment:this.parent,stop:function(){
												let left=(100*this.offsetLeft/this.parentElement.clientWidth),
													top=(100*this.offsetTop/this.parentElement.clientHeight),
													width=(100*this.clientWidth/this.parentElement.clientWidth),
													height=(100*this.clientHeight/this.parentElement.clientHeight);
												this.style.left=left+"%";
												this.style.top=top+"%";
												this.style.width=width+"%";
												this.style.height=height+"%";
											}});};
		
		
		
		
		
		
		
		
		
		
		
		
		async function placeMarkers(){
			let heightOffset=side_image.width*MARKER_WIDTH/(2*side_image.height);
			
		
			let promises=[
										// <!-- new Promise(async function(resolve){ -->
															// <!-- let response=await fetch("/admin/data/"+boardName+"/sideA"); -->
															  // <!-- let response1_json=await response.json(); -->
															  // <!-- let i2c=JSON.parse(response1_json); -->
															  // <!-- let content=await i2c.content -->
															  
															  // <!-- for(const [key,value] of Object.entries(i2c)){ -->
																	// <!-- let boardInfoRender=new BoardInfoRender(key, -->
																											// <!-- value, -->
																											// <!-- content, -->
																											// <!-- let f1=function(){setMarker_i2c(value.x,value.y,heightOffset)}.bind(boardInfoRender), -->
																											// <!-- let f2=function(){setField_i2c(value.x,value.y,heightOffset)}.bind(boardInfoRender), -->
																											// <!-- "i2cList-marker", -->
																											// <!-- "i2cList-field", -->
																											// <!-- i2cList, -->
																											// <!-- infoLayer); -->
																	// <!-- boardInfoRender.render(); -->
															  // <!-- }; -->
															  // <!-- resolve();}), -->
						  new Promise(async function(resolve){let response=await fetch("/admin/data/"+boardName+"/"+document.getElementById("side").textContent);
															  let response2_json=await response.json();
															  let checkpoints=JSON.parse(response2_json);
															  let content=await checkpoints.content
															  let f1,f2;
															  for(const [key,value] of Object.entries(checkpoints)){
																	let boardInfoRender=new BoardInfoRender(key,
																											value,
																											content,
																											f1=function(){setMarker_checkpoint(value.left,value.right,value.top,value.bottom,heightOffset)}.bind(boardInfoRender),
																											f2=function(){setField_checkpoint(value.left,value.right,value.top,value.bottom,heightOffset)}.bind(boardInfoRender),
																											"ckeckpointsList-marker",
																											"ckeckpointsList-field",
																											checkpointsList,
																											infoLayer);
																	boardInfoRender.render();
															  };
															  resolve();
						};									  
			];
			
			await Promise.all(promises);
		};		
				
				
			
		
		
		async function imgToBlob(img){
			let canvas=document.createElement("canvas");
			canvas.width=img.naturalWidth;
			canvas.height=img.naturalHeight;
			
			let context=canvas.getContext("2d");
			
			context.drawImage(img,0,0);
			
			let resultBlob=await new Promise(resolve=>{canvas.toBlob(resolve)});
			console.log("blob",resultBlob);
			return resultBlob;
		}
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		class BoardInfoRender{
			static number=0;
			
			constructor(key,value,content,setMarkerSize,setFieldSize,markerClass,fieldClass,list,containment){
				this.listItem=document.createElement("li");
				this.marker=document.createElement("div");
				this.field=document.createElement("div");
				
				list.append(this.listItem);
				infoLayer.append(this.marker,this.field);		
				
				let delButton=document.createElement("div");
				delButton.textContent="del";
				
				delButton.onclick=()=>{this.listItem.remove();this.marker.remove();this.field.remove();delButton.remove();};
				
				list.parentElement.querySelector("div").append(delButton);
				
				
				Object.defineProperty(this.marker,"centerX",{get:function(){
					return (this.offsetLeft+this.clientWidth/2)*100/this.parentElement.clientWidth+"%";
				}})
				
				Object.defineProperty(this.marker,"centerY",{get:function(){
					return (this.offsetTop+this.clientHeight/2)*100/this.parentElement.clientHeight+"%";
				}})
				
				Object.defineProperty(this.marker,"width",{get:function(){
					return (this.clientWidth*100/this.parentElement.clientWidth);
				}})
				
				this.textArea=document.createElement("div");
				this.textArea.classList.add("textArea");
				this.textArea.contentEditable=true;
				
				this.insertImage=document.createElement("input");
				this.insertImage.type="file";
				this.insertImage.textContent="Insert image";
				this.insertImage.style.visibility="hidden";
				this.insertImage.style.width="0";
				this.insertImage.id=BoardInfoRender.number.toString();
				
				this.insertImageLabel=document.createElement("label");
				this.insertImageLabel.textContent="Insert image";
				this.insertImageLabel.htmlFor=BoardInfoRender.number.toString();
				
			
				
				this.field.appendChild(this.textArea);
				this.field.appendChild(this.insertImage);
				this.field.appendChild(this.insertImageLabel);
				
				this.field.id=key;
				//this.field.contentEditable=true;
				this.field.style.width="50px";
				this.field.style.width="100px";
				this.marker.persistent=false;
				
				
				
				
				
				
				
				
				let that=this;
				
				$(this.marker).draggable({addClasses:false,
										  containment:"parent",
										  stop:function(){
												let left=(100*this.offsetLeft/this.parentElement.clientWidth),
													top=(100*this.offsetTop/this.parentElement.clientHeight);
												this.style.left=left+"%";
												this.style.top=top+"%";
												
												let heightOffset=side_image.width*MARKER_WIDTH/(2*side_image.height);
												that.field.setAttribute("data-left",left+100*this.offsetWidth/this.parentElement.clientWidth+MARKER_WIDTH/2);
												that.field.setAttribute("data-top",top+100*this.offsetHeight/this.parentElement.clientHeight+heightOffset);
												
												that.field.fit();
										  },
										  cursor:"crosshair",
				});
				
				
				
				this.key=key;
				this.value=value;
				// <!-- this.width=(value.left&&value.right)? 100-parseFloat(value.right)-parseFloat(value.left):MARKER_WIDTH; -->
				// <!-- this.height=(value.top&&value.bottom)? 100-parseFloat(value.bottom)-parseFloat(value.top):MARKER_WIDTH; -->
				// <!-- this.x=value.x??parseFloat(value.left)+this.width/2+"%"; -->
				// <!-- this.y=value.y??parseFloat(value.top)+this.height/2+"%"; -->
				
				this.markerClass=markerClass;
				this.fieldClass=fieldClass;
				this.setMarkerSize=setMarkerSize;
				this.setFieldSize=setFieldSize;
				
							
				// <!-- this.marker.style.width=this.width+"%"; -->
				// <!-- this.marker.style.height=this.height+"%"; -->
				
				BoardInfoRender.number++;
				
				
				
				
				
				this.marker.style.position="absolute";
			};
			
			render(){
				this.setListItem();
				this.setMarker();
				this.setField();
				this.pastContent();
				this.listItemHoverHandler();
				this.listItemClickHandler();
				this.markerClickHandler();
				this.insertImageHandler();
				
			};
		
			setListItem(){
				this.listItem.textContent=this.key;
				this.listItem.classList.add("cursor-pointer");
			};
			
			setMarker(){
				this.marker.classList.add(this.markerClass);
				this.setMarkerSize();
			};
			
			setField(){
				this.field.classList.add(this.fieldClass);
				this.field.style.visibility="hidden";
				this.setFieldSize();
			};
			
			pastContent(){
				this.textArea.content=this.content;
			};
			
			listItemHoverHandler(){
				this.listItem.onhover(()=>{this.marker.classList.add("ckeckpointsList-marker-hover")},()=>{this.marker.classList.remove("ckeckpointsList-marker-hover")});	
			};
			
			listItemClickHandler(){
				this.listItem.onclick=(()=>{scaleAndScroll(100/(MARKER_TO_BOARD_WIDTH_RATIO*this.marker.width),this.marker.centerX,this.marker.centerY);
										this.field.style.visibility="visible";this.textArea.focus();});
			};
			
			// <!-- markerHoverHandler(){ -->
				// <!-- this.marker.onhover(()=>{ -->
					// <!-- this.field.style.visibility="visible"; -->
					// <!-- this.field.addEventListener("mouseenter",function mouseenter(){ -->
						// <!-- this.style.visibility="visible"; -->
						// <!-- this.addEventListener("mouseleave",function mouseleave(){  -->
							// <!-- this.removeEventListener("mouseenter",mouseenter); -->
							// <!-- this.removeEventListener("mouseleave",mouseleave); -->
							
						// <!-- });	 -->
					// <!-- }); -->
				// <!-- },()=>{ -->
					// <!-- //this.field.style.visibility="hidden"; -->
					// <!-- if(!this.marker.persistent) this.field.style.visibility="hidden"; -->
							// <!-- console.log(this.marker.persistent) -->
				// <!-- }); -->
			// <!-- }; -->
			
			markerClickHandler(){
				this.marker.onmousedown=((event)=>event.preventDefault());
				this.marker.onclick=((event)=>{console.log("click");this.field.style.visibility="visible";this.textArea.focus()});
				
				
				// <!-- this.field.onmousedown=((event)=>{this.textArea.focus()}); -->
				this.textArea.onblur=((event)=>{this.marker.persistent=false;this.field.style.visibility="hidden";});
			};
			
			
			insertImageHandler(){
				this.insertImage.onchange=(()=>{
					let image=document.createElement("img");
					image.style.width="100%";
					console.log(window.URL.createObjectURL(this.insertImage.files[0]))
					image.src=window.URL.createObjectURL(this.insertImage.files[0]);
					this.textArea.append("\n");
					this.textArea.appendChild(image);
					
					this.insertImage.value="";
					
					let range=new Range();
					range.selectNodeContents(this.textArea);
					range.collapse(false);
					let selection=document.getSelection();
					selection.removeAllRanges();
					selection.addRange(range);
					this.field.style.visibility="visible";
					this.textArea.focus();
				});
				
				this.insertImageLabel.onmousedown=((event)=>{let onblurevent=this.textArea.onblur;
															this.textArea.onblur=null;
															this.insertImageLabel.onclick=()=>this.textArea.onblur=onblurevent})//event.stopPropagation()});
				// <!-- this.insertImage.onclick=()=>{this.field.style.visibility="visible";this.textArea.focus()} -->
			};
		};
		
		//function for_jQooeyr 
		
		Element.prototype.fit=function(){
			let parent=this.parentElement;
			if((this.getAttribute("data-left")*parent.offsetWidth/100+this.offsetWidth)>parent.offsetWidth){
				this.style.left="";
				this.style.right=0;
			}else{
				this.style.right="";
				this.style.left=this.getAttribute("data-left")+"%";
			};
			if((this.getAttribute("data-top")*parent.offsetHeight/100+this.offsetHeight)>parent.offsetHeight){
				this.style.top="";
				this.style.bottom=0;
			}else{
				this.style.bottom="";
				this.style.top=this.getAttribute("data-top")+"%";
			};
		};
		
		
		
		async function initial(){
			await loaded();
			refreshMap();
			await placeMarkers();
		};
		
		initial();
		
		
		
		
		
		
		
	
		
		
		
		document.getElementById("confirm").onclick=async function(){
			let checkpoints=infoLayer.querySelectorAll(".ckeckpointsList-field");
			let i2c_array=infoLayer.querySelectorAll(".i2c-field");
			
			let dict={};
			
			for(let checkpoint of checkpoints){
				let blobAr=[];
				let nodes=checkpoint.querySelector(".textArea").childNodes;
				for(let node of nodes){
					if(node.nodeType==3){
						blobAr.push({"text":node.textContent})
					}else if(node.nodeType==1){
						let blob=await imgToBlob(node);
						let reader=new FileReader();
						reader.readAsDataURL(blob);
				
						await new Promise((resolve)=>reader.onload=()=>resolve());
						
						
						blobAr.push({"img":reader.result});
					};
				};
				dict[checkpoint.id]={};
				dict[checkpoint.id].content=blobAr;
				dict[checkpoint.id].left=checkpoint.offsetLeft;
				dict[checkpoint.id].top=checkpoint.offsetTop;
				dict[checkpoint.id].right=checkpoint.offsetLeft+checkpoint.clientWidth;
				dict[checkpoint.id].bottom=checkpoint.offsetTop+checkpoint.clientHeight;
				
			};
			
			
			await fetch("/admin/data/"+boardName+"/"+document.getElementById("side").textContent,{method:"POST",body:dict});
		};
		