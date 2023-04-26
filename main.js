const margin = { top: 0, right: 0, bottom: 0, left: 0 };
const width = 1000 - margin.left - margin.right;
const height = 1000 - margin.top - margin.bottom;

//  The Map is 1000 x 1000 px, so margins throw off the data.
//  You could accomodate and skew but it feels unnecessary.
const svg = d3
  .select('#map')
  .append('svg')
  .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);


// These are the x and y pixel coordinates of each gate in a look-up table
const gates = [
{ name: 'camping0', x: 265, y: 209},       
{ name: 'camping1', x: 645,  y: 255},       
{ name: 'camping2', x: 226,  y: 324},       
{ name: 'camping3', x: 229,  y: 340},       
{ name: 'camping4', x: 245,  y: 448},       
{ name: 'camping5', x: 105,  y: 607},       
{ name: 'camping6', x:  750,  y: 884},       
{ name: 'camping7', x:  903,  y: 725},       
{ name: 'camping8', x: 914,  y: 244},       
{ name: 'entrance0', x: 315,  y: 69},       
{ name: 'entrance1', x: 92,  y: 339},       
{ name: 'entrance2', x: 914,  y: 438},      
{ name: 'entrance3', x: 577,  y: 833},      
{ name: 'entrance4', x: 700,  y: 919},      
{ name: 'gate0', x: 317,  y: 169},          
{ name: 'gate1', x: 294,  y: 225},          
{ name: 'gate2', x: 124,  y: 275},          
{ name: 'gate3', x: 745,  y: 303},          
{ name: 'gate4', x: 820,  y: 571},        
{ name: 'gate5', x: 655,  y: 731},          
{ name: 'gate6', x: 581,  y: 755},          
{ name: 'gate7', x: 486,  y: 798},          
{ name: 'gate8', x: 691,  y: 903},          
{ name: 'general-gate0', x: 552,  y: 53},   
{ name: 'general-gate1', x: 323,  y: 130},  
{ name: 'general-gate2', x: 521,  y: 165},  
{ name: 'general-gate3', x: 928,  y: 280},  
{ name: 'general-gate4', x: 349,  y: 492},  
{ name: 'general-gate5', x: 620,  y: 558},  
{ name: 'general-gate6', x: 680,  y: 686},  
{ name: 'general-gate7', x: 328,  y: 719},  
{ name: 'ranger-base', x: 641,  y: 874},    
{ name: 'ranger-stop0', x: 447,  y: 87},    
{ name: 'ranger-stop1', x: 102,  y: 126},   
{ name: 'ranger-stop2', x: 404,  y: 179},   
{ name: 'ranger-stop3', x: 741,  y: 229},   
{ name: 'ranger-stop4', x: 95,  y: 477},    
{ name: 'ranger-stop5', x: 754,  y: 592},   
{ name: 'ranger-stop6', x: 617,  y: 736},   
{ name: 'ranger-stop7', x: 503,  y: 760},   
];


/** 

// DROP DOWN MENU - Some Suggestions

// Select the dropdown menu?
const dropdown = d3.select("#car-dropdown");

// Add an event listener to the dropdown menu?
dropdown.on("change", function() {
  // Get the selected car id
  const selectedCarId = d3.select(this).property("value");
  
  // Create/Call the plotCarPath method with the selected car id?
  plotCarPath(selectedCarID);
});


*/


//  DATA EXTRAPOLATION - our data has string data that needs to become
//  coordinates, so getX() and getY() will take in the gate string and 
//  compare with the gates look-up table above

// Takes in a gate, returns X coordinate
function getX(gateName){
  const gate = gates.find(g => g.name === gateName);
  return gate ? Number(gate.x) : null;
}

// Takes in a gate, returns Y coordinate
function getY(gateName){
  const gate = gates.find(g => g.name === gateName);
  return gate ? Number(gate.y) : null;
}

// loads CSV, Picks out specific ID (Replace with variable to enable to ability to switch!)
d3.csv('data.csv').then((d) => {
  return d;
}).then((data) => {
  const selectedCarData = data.filter(d => d.id === "20155705025759-63");
  

  //  xScale and yScale are NORMALLY necesary, however since we were able to 
  //  essentially create the exact pixel location for each gate, they will 
  //  only ruin the data.. for now they do not get used, however they are here
  //  in case you need them!

  const xScale = d3.scaleLinear()
    .domain([0, 1000])
    .range([0, width]);

  const yScale = d3.scaleLinear()
    .domain([0, 1000])
    .range([height, 0]);

  //  This adds the image to the svg and sizes it approprately
  svg.append('image')
    .attr('xlink:href', 'Lekagul_Map_Upscale.png')
    .attr('width', width)
    .attr('height', height);

  //  This is where the magic happens, our pruned data will now utilizes
  //  the getX and getY functions to get the coordinates needed to map 
  //  the circles.
  svg.selectAll('.selectedCarData')
    .data(selectedCarData)
    .join('circle')
    .attr('class', 'selectedCarData')
    .attr('cx', (d) => getX(d.gate))
    .attr('cy', (d) => getY(d.gate))
    .attr('r', 5)
    .style('fill', 'red');

  //  This line element will draw in between the circles, its important
  //  that the coordinate conversion still occurs here!
  const lineGenerator = d3.line()
    .x((d) => getX(d.gate))
    .y((d) => getY(d.gate))
    .curve(d3.curveCatmullRom.alpha(0.5));

  //  The final piece that connects all the lines together into a stroke.
  //  There is some fancy curve work above that may need to be adjusted.
  svg.append('path')
    .datum(selectedCarData)
    .attr('d', lineGenerator)
    .attr('stroke', 'red')
    .attr('stroke-width', 2)
    .attr('fill', 'none');
});