/*
Author: Cillian Tighe
Student No: N00152737
Interactive Graphics CA
*/

//JQuery function to check when the page has loaded and then carries out the function
$(document).ready(function () {

    // ----------------------------------- //
    // -------- GLOBAL VARIABLES --------- //
    // ----------------------------------- //

    //A variable which holds a reference to all the bars that are to be drawn
    var rects;
    //A variable to hold the width of the bars
    var rectWidth;
    //An array which holds a reference to all the lines that are to be drawn
    var path = new Array;
    //An array which holds a reference to all the scatterpoints that are to be drawn
    var scatterPoints = new Array;
    //An array which holds all the colors that are going to be applies to the lines & bars
    var colorArray = ["#2ecc71", "#3498db", "#9b59b6", "#1abc9c", "#f1c40f",
                      "#e67e22", "#e74c3c", "#F62459", "#36D7B7", "#446CB3",
                      "#c0392b", "#2980b9"];

    //A variable that will hold fatalities sorted by country
    var fatalitiesByCountry;
    //A variable that will hold fatalities sorted by year
    var fatalitiesByYear;
    //This variable was created to cut back on code
    //It is used when appending info on the bar chart to the legend and creating a button for it
    var US = {
        key: ""
    };

    //Object to hold all the margin sizes
    var margin = {
        top: 25,
        right: 25,
        bottom: 25,
        left: 25
    };

    //Gets a reference to the div where the graph is going to my placed
    var myGraph = document.getElementById("myGraph");

    //Calculating the width and height of the graph by retrieving the parent's width
    var width = myGraph.offsetWidth - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    // ----------------------------------- //
    // ----------- FUNCTIONS ------------- //
    // ----------------------------------- //

    // ------------ PARSE TIME ---------- //
    var parseTime = d3.timeParse("%Y");

    // ----------- X & Y SCALE ----------- //
    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);

    // --------- Y AXIS GRIDLINES -------- //
    function make_y_gridlines() {
        return d3.axisLeft(y)
            .ticks(20)
    }

    // ------------ DRAW LINE ------------ //
    var valueline = d3.line()
        .x(function (d) {
            return x(d.key);
        })
        .y(function (d) {
            return y(d.value);
        })
        //This will give the line a curved look
        .curve(d3.curveCatmullRom);

    // ---------- APPENDING SVG ---------- //
    var svg = d3.select("#myGraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // -------- APPENDING TOOLTIP -------- //
    var toolTip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    // ---------- OPTION LIST ------------ //
    var list = d3.select("#options").append("div")
        .attr("id", "menu");

    // ------ BUTTON EVENT LISTENER -------- //
    //An event listener for the checkboxes(switches)
    $("#menu").on("click", "input:checkbox", function () {

        //If the switch is checked and the id is not 10(This is the button for turning the bar graph on)
        if ($(this).is(":checked") && $(this).attr('id') != 10) {
            var i = $(this).attr('id');

            //Finds the path with the index and sets the color and opacity
            path[i].style("opacity", 1)
                .style("stroke", colorArray[i]);
            var totalLength = path[i].node().getTotalLength();

            //This will animate the line 
            path[i]
                .attr("stroke-dasharray", totalLength + " " + totalLength)
                .attr("stroke-dashoffset", totalLength)
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);
            //This will show the scatterpoints for that line
            //All indexes are mirrored in the path and scatterpoints array
            scatterPoints[i]
                .style("opacity", 1)
                .style("fill", colorArray[i]);

        }
        //If the switch is not checked and the id is not 10(This is the button for turning the bar graph on)
        else if ($(this).not(":checked") && $(this).attr('id') != 10) {
            var i = $(this).attr('id');

            var totalLength = path[i].node().getTotalLength();
            //Finds the path with the index and animates the line to disappear in reverse
            path[i]
                .transition()
                .duration(1000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", totalLength);
            //Hides the scatterpoints
            scatterPoints[i]
                .style("opacity", 0);
        }
        //If the switch is checked and the id is 10(This is the button for turning the bar graph on)
        else if ($(this).is(":checked") && $(this).attr('id') == 10) {
            //This animates the bars to draw vertically 
            rects
                .transition()
                .duration(1000)
                .attr("y", 0)
                .attr("height", height)
                .style("opacity", 0.1);
        }
        //If the switch is not checked and the id is 10(This is the button for turning the bar graph on)
        else if ($(this).not(":checked") && $(this).attr('id') == 10) {
            //This animates the bars to disappear vertically 
            rects
                .transition()
                .duration(1000)
                .attr("y", height)
                .attr("height", 0)
                .style("opacity", 1);
        }
    });

    // ------ LEGEND FUNCTION -------- //
    function addToLegend(d, i) {
        //If statements to add 'hr' tags to break up the content
        if (i == 0) {
            d3.select(".legend").append("p")
                .text("COUNTRIES")
                .attr("class", "legend")
            d3.select(".legend").append("hr")
                .attr("class", "divider")
        } else if (d.key == "Republican") {
            d3.select(".legend").append("p")
                .text("POLITICAL POWER")
                .attr("class", "legend")
            d3.select(".legend").append("hr")
                .attr("class", "divider")
        }
        d3.select(".legend").append("div")
            .attr("class", "legendText")
            .text(d.key.toUpperCase())
            .append("div")
            .attr("class", "legendColor")
            .style("background-color", colorArray[i])
    }

    // ------ BUTTON FUNCTION -------- //
    function addButton(d, i) {
        var div = list.append("div")
            .attr("class", "toggleButtons");

        div.append("p")
            .attr("class", "toggleInfo")
            .text(d.key.toUpperCase())

        var item = div.append("label")
            .attr("class", "switch");

        item.append("input")
            .attr("id", i)
            .attr("type", "checkbox")
            .attr("value", d.key);

        item.append("span")
            .attr("class", "slider round");

    }

    // ----------------------------------- //
    // ------------ LOAD CSV ------------- //
    // ----------------------------------- //
    d3.csv("data/data.csv", function (error, rawData) {

        // ----------------------------------- //
        // ---------- FORMAT DATA ------------ //
        // ----------------------------------- //

        // ------- FATALITIES BY YEAR -------- //
        /*
            Using the nest function to retrieve only the data that I need
            Here I'm asking to use 'Year' as a key
            Within that key is another key which is 'USA_Power' and the value 'Terrorism_Fatalities'
            This will list all the years and within that the US power at the time and the total fatalities
        */
        fatalitiesByYear = d3.nest()
            .key(function (d) {
                return d.Year;
            })
            .key(function (d) {
                return d.USA_Power;
            })
            .rollup(function (v) {
                return d3.sum(v, function (d) {
                    return d.Terrorism_Fatalities
                })
            })
            .entries(rawData);

        // --------- FORMATTING DATA --------- //
        fatalitiesByYear.forEach(function (d) {
            d.key = parseTime(d.key);
        });

        // ------ FATALITIES BY COUNTRY ------- //
        /*
            Here I'm asking to use 'Country' as a key
            Within that key is another key which is 'Year' and the value 'Terrorism_Fatalities'
            This will list all the countries and within that the years at the time and the total fatalities
        */
        fatalitiesByCountry = d3.nest()
            .key(function (d) {
                return d.Country;
            })
            .key(function (d) {
                return d.Year;
            })
            .rollup(function (v) {
                return d3.sum(v, function (d) {
                    return d.Terrorism_Fatalities
                })
            })
            .entries(rawData);

        // --------- FORMATTING DATA --------- //
        fatalitiesByCountry.forEach(function (d) {
            d.values.forEach(function (d) {
                d.key = parseTime(d.key);
            })
        });

        // ----------------------------------- //
        // -------- APPENDING TO SVG --------- //
        // ----------------------------------- //

        // --------- X DOMAIN SETUP --------- //
        //Setting up the 'x' domain by getting the earliest and latest years
        x.domain(d3.extent(fatalitiesByYear, function (d) {
            return d.key;
        }));

        // -------- Y DOMAIN SETUP --------- //
        //Setting up the 'y' domain by retrieving the highest number
        y.domain([0, d3.max(fatalitiesByCountry, function (d) {
            return d3.max(d.values, function (d) {
                return d.value;
            });
        })]);

        // -------- APPENDING RECTS ------- //
        //Calculating the width of each bar by getting the length of 'fatalitiesByYear' and divid it into the width of the graph
        rectWidth = width / fatalitiesByYear.length;
        rects = svg
            .append("g")
            .attr("class", "rects")
            .selectAll("rect")
            .data(fatalitiesByYear)
            .enter()
            .append("rect");

        //Calculating the 'x' position of each rect by multipling the width by the index
        rects.attr("x", function (d, i) {
                return i * rectWidth;
            })
            //Setting the 'y' to the height of the graph which will place it at the bottom
            .attr("y", height)
            //Setting the 'width' of the bars to the width calculated above
            .attr("width", rectWidth)
            //Setting the 'height' to 0 as i don't want it to display them yet
            .attr("height", 0)
            .attr("class", "rects")
            //Function to see whether the current bar that is being styled is in a year where a Republican or Democrat was in power
            .style("fill", function (d) {
                var data = d.values;
                if (data[0].key == "Republican") {
                    //Hardcoded this as index 10 & 11 are exclusively for these
                    return colorArray[10];
                } else if (data[0].key == "Democratic") {
                    return colorArray[11];
                };
            })

        // ----- APPENDING Y GRIDLINES ---- //
        svg.append("g")
            .attr("class", "grid")
            .call(make_y_gridlines()
                .tickSize(-width)
                .tickFormat("")
                .tickSizeOuter(0)
            )

        // ---------- ADDING X AXIS ---------- //
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .attr("class", "x-axis")
            .call(d3.axisBottom(x).tickSizeOuter(0));

        // ---------- ADDING Y AXIS ---------- //
        svg.append("g")
            .call(d3.axisLeft(y).ticks(10, "s").tickSizeOuter(0));

        // --- ADDING SCATTER PLOT POINTS ---- //
        //Using a forEach for get into the nested data 
        fatalitiesByCountry.forEach(function (d, i) {
            //Extracting the values from 'd' and putting it into a variable
            var data = d.values;
            var country = d.key;
            scatterPoints.push(
                svg.selectAll("dots")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "scatterPoint")
                .attr("r", 3)
                .attr("cx", function (d) {
                    return x(d.key);
                })
                .attr("cy", function (d) {
                    return y(d.value);
                })
                /*
                    Function to check when the mouse is over a point
                    It checks to see if the opacity is '1' and if it is then that means the scatterpoint is currently visible on the graph
                    Which will use the 'tooltip to display the information that is associated with that point
                */
                .on("mouseover", function (d, i) {
                    if (d3.select(this).style("opacity") == 1) {

                        d3.select(this).attr("r", 6);
                        toolTip.transition()
                            .duration(200)
                            .style("opacity", .7);
                        toolTip.html("Country: " + country + "<br/>" + "Year: " + d.key.getFullYear() + "<br/>" + "Fatalities: " + d.value)
                            .style("left", (d3.event.pageX) + "px")
                            .style("top", (d3.event.pageY) + "px");
                    }
                })
                //Resets the size of the scatterpoint and hides the tooltip
                .on("mouseout", function (d) {
                    d3.select(this).attr("r", 3);

                    toolTip.transition()
                        .duration(500)
                        .style("opacity", 0);
                })
            );
        });

        // --------- DRAWING THE LINE -------- //
        fatalitiesByCountry.forEach(function (d, i) {
            path.push(svg.append("g")
                .append("path")
                .attr("id", i)
                .data([d.values])
                .attr("class", "line")
                .attr("d", valueline));

            //Calling the function to add a button for the current 'd'
            addButton(d, i);

            //Calling the function to add information for the current 'd'
            addToLegend(d, i);

        });

        // --------- BAR CHART  -------- //
        //Adding a button for the bar chart
        US.key = "us power"
        addButton(US, 10);
        //Adding to the legend
        US.key = "Republican"
        addToLegend(US, 10);
        US.key = "Democratic"
        addToLegend(US, 11);

    });
});
