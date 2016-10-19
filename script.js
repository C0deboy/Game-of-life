(function () {	//IIFE
	
	"use strict";
	
	function insert(i)
	{
		var id = i;
		var intX=0;
		var intY=0;
		
		//Pobieranie X i Y na podstawie ID:
		
		for (var y=0; y<yNumb; y++)
		{
			for (var x=0; x<xNumb; x++)
			{
				if(idTable[x][y]==id)
				{
					intX=x;
					intY=y;
				}
			}
		}
		
		//Sprawdzanie i ustawianie stanu:
		
		if(stateTable[intX][intY]==0) stateTable[intX][intY]=1;
		else if(stateTable[intX][intY]==1) stateTable[intX][intY]=0;
		
		refreshCells();	
	}

	function refreshCells()
	{
		//Rysowanie stanu komórek:
	
		for (var y=0; y<yNumb; y++)
		{
			for (var x=0; x<xNumb; x++)
			{
				var id = idTable[x][y];
				
				if(stateTable[x][y]==0) document.getElementById(id).style.background="black";
				else if(stateTable[x][y]==1) document.getElementById(id).style.background="yellow";
			}
		}
	}

	function evolution()
	{
		//Sprawdzanie ilości sąsiadów:
		
		for(var y=0;y<yNumb;y++)
		{
			for(var x=0;x<xNumb;x++)
			{
				var neighborsNumber=0;
				try{ if(stateTable[x-1][y-1]==1) neighborsNumber++; } catch(err){}
				try{ if(stateTable[x][y-1]==1) neighborsNumber++; } catch(err){}
				try{ if(stateTable[x+1][y-1]==1) neighborsNumber++; } catch(err){}
				try{ if(stateTable[x-1][y]==1) neighborsNumber++; } catch(err){}
				try{ if(stateTable[x+1][y]==1) neighborsNumber++; } catch(err){}
				try{ if(stateTable[x-1][y+1]==1) neighborsNumber++; } catch(err){}
				try{ if(stateTable[x][y+1]==1) neighborsNumber++; }catch(err){}
				try{ if(stateTable[x+1][y+1]==1) neighborsNumber++; }catch(err){}
				
				//Określanie przyszłego stanu komórki:
				
				if(neighborsNumber==3&&stateTable[x][y]==0)futureStateTable[x][y]=1;
				else if(neighborsNumber!=3&&stateTable[x][y]==0)futureStateTable[x][y]=0;
				else if((neighborsNumber>1&&neighborsNumber<4)&&stateTable[x][y]==1)futureStateTable[x][y]=1;
				else if((neighborsNumber<2||neighborsNumber>3)&&stateTable[x][y]==1)futureStateTable[x][y]=0;
			}
		}
		
		//Zmienianie stanu tabeli stateTable:
		
		for(var y=0;y<yNumb;y++)
		{
			for(var x=0;x<xNumb;x++)
			{
				stateTable[x][y]=futureStateTable[x][y];
			}
		}
		
		refreshCells();
	}

	function clearCells()
	{
		for(var y=0;y<yNumb;y++)
		{
			for(var x=0;x<xNumb;x++)
			{
				stateTable[x][y]=0;
			}
		}
		refreshCells();
	}

	function fillRandom()
	{
		clearCells();
		var numbersOfCells = Math.round(Math.random()*xNumb*yNumb);
		
		for(var i=0;i<numbersOfCells;i++)
		{
			var x = xNumb;
			while(x>(xNumb-1))x = Math.round(Math.random()*xNumb);
			var y = yNumb;
			while(y>(yNumb-1))y = Math.round(Math.random()*yNumb);
			
			stateTable[x][y]=1;
		}
		
		refreshCells();
		
	}

	var simulation=null;
	var speed;
	
	//Dynamiczny suwak speed
	
	function refreshSpeed()
	{
		if(simulation!==null)
		{
			speed=document.getElementById("speed").value*-1;
			clearInterval(simulation);
			simulation = setInterval(evolution,speed);
		}
	}
	
	//Start/stop
	
	function simulationStart()
	{
		if(simulation==null)
		{
			speed=document.getElementById("speed").value*-1;
			simulation = setInterval(evolution,speed);
		}
	}

	function simulationStop()
	{
		if(simulation!=null)
		{
			clearInterval(simulation);
			simulation=null;
		}
	}
		
	//Key listener
	window.onkeypress = function(e) 
	{
		var key = e.keyCode ? e.keyCode : e.which;
		if (key == 32) 
		{
		   evolution();
		}
	}
	
	//Eventy
	document.getElementById("click").addEventListener("mousedown", evolution);
	document.getElementById("clear").addEventListener("mousedown", clearCells);
	document.getElementById("random").addEventListener("mousedown", fillRandom);
	document.getElementById("start").addEventListener('click', simulationStart);
	document.getElementById("stop").addEventListener('click', simulationStop);
	document.getElementById("speed").addEventListener("input", refreshSpeed);
	
	//Ilość rzędów
	var xNumb=45;
	//Ilość kolumn
	var yNumb=45;	
		
	//Deklaracja tablic:
	var stateTable = [];
	var idTable = [];
	var futureStateTable = [];
	
	for(var x = 0;x<xNumb;x++)
	{
		stateTable[x] = [];
		idTable[x] = [];
		futureStateTable[x] = [];
		
		for(var y = 0; y < yNumb;y++)
		{
			stateTable[x][y] = 0;
			idTable[x][y] = 0;
			futureStateTable[x][y] = 0;
		}
	}

	//Tworzenie divów:
	var id=0;
	
	for (var y=0; y<yNumb; y++)
	{
		for (var x=0; x<xNumb; x++)
		{
			var field = document.createElement('div');
			field.classList.add('field');
			field.id = id;
			field.textContent =id;
			document.getElementById('fields').appendChild(field);
			
			idTable[x][y]=id;
			id++;
		}
		
		var nextRow = document.createElement('div')
		nextRow.classList.add('nextRow');
		document.getElementById('fields').appendChild(nextRow);
	}
	
	//Even Delegation
	document.getElementById("fields").addEventListener("click",function(e)
	{
		if(e.target.classList.contains('field'))
		{
			parseInt( e.target.id );
			insert( e.target.id );
		}
		
	});

})(); //IFFE
