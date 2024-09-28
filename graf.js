// Učitavanje TXT (CSV formatirane) podatke
d3.text('data.txt').then(function(data) {
    // Pretvaranje tekstualnih podataka u podatke koji su kompatibilni s d3.js-om.
    const parsedData = d3.dsvFormat(';').parse(data, function(d) {
        return {
            datetime: d3.timeParse("%d/%m/%Y %H:%M:%S")(d.Date + ' ' + d.Time),
            year: +d.Date.split('/')[2],
            hour: +d.Time.split(':')[0],
            Global_active_power: +d.Global_active_power,
            Voltage: +d.Voltage,  // Parsing Voltage
            Global_intensity: +d.Global_intensity  // Parsing Global Intensity
        };
    });
    

    // Funkcija za filtriranje podataka po godini
    function filterDataByYear(year) {
        return parsedData.filter(d => d.year === year);
    }

    // Funkcija za grupiranje podataka po satima
    function groupDataByHour(data) {
        return d3.rollup(data, v => d3.mean(v, d => d.Global_active_power), d => d.hour);
    }

    // Postavljanje dimenzija i margina grafikona
    const margin = {top: 100, right: 30, bottom: 90, left: 70},
          width = 800 - margin.left - margin.right,
          height = 400 - margin.top - margin.bottom;

    // Kreiranje SVG elementa za bar chart
    const barSvg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Dodavanje naslova grafu
    barSvg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", -60)
        .attr("text-anchor", "middle")
        .text("Global Active Power Consumption Throughout the Day");

    // Skaliranje
    const x = d3.scaleBand()
        .domain(d3.range(24))
        .range([0, width])
        .padding(0.1);
    const y = d3.scaleLinear()
        .domain([0, 3]) //vrijednost za y os
        .range([height, 0]);

    // Dodavanje X i Y osi
    barSvg.append("g")
        .attr("class", "x-axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickFormat(d => d + ":00").tickSize(0))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");
    
    barSvg.append("g")
        .attr("class", "y-axis axis--y")
        .call(d3.axisLeft(y).ticks(5).tickFormat(d => d + " kW"));

    // Dodavanje oznaka osi
    barSvg.append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height + 60)
        .attr("text-anchor", "middle")
        .text("Hour of the Day");

    barSvg.append("text")
        .attr("class", "y-axis-label")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Global Active Power (kW)");

    let previousBarsData = [];

    function updateBarChart(year, startHour) {
        const filteredData = filterDataByYear(year);
        const hourlyData = groupDataByHour(filteredData);
        const hourlyDataArray = Array.from(hourlyData, ([hour, power]) => ({hour, power}));
    
        const endHour = startHour + 1;
        const data = hourlyDataArray.filter(d => d.hour >= startHour && d.hour < endHour);
    
        if (startHour > previousBarsData.length) {
            previousBarsData = previousBarsData.concat(data);
        } else {
            previousBarsData = previousBarsData.slice(0, startHour).concat(data);
        }
    
        // Get the max power value for scaling the colors
        const maxPower = d3.max(previousBarsData, d => d.power);
    
        const bars = barSvg.selectAll(".bar")
            .data(previousBarsData, d => d.hour + "-" + d.power);
    
        // Remove old bars
        bars.exit().transition()
            .duration(800)
            .ease(d3.easeBounceOut)
            .attr("y", y(0))
            .attr("height", 0)
            .remove();
    
        // Add new bars with colors based on the Plasma scale
        bars.enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.hour))
            .attr("y", y(0))
            .attr("width", x.bandwidth())
            .attr("height", 0)
            .merge(bars)
            .transition()
            .duration(800)
            .ease(d3.easeBounceOut)
            .attr("x", d => x(d.hour))
            .attr("y", d => y(d.power))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.power))
            // Color each bar based on the power value, normalized by the max power
            .style("fill", d => d3.interpolatePlasma(d.power / maxPower));
    
        // Update numeric values on the side
        const barResultsDiv = d3.select("#barResults");
        barResultsDiv.html(""); // Clear previous results
        previousBarsData.forEach(d => {
            barResultsDiv.append("div").text(`Hour: ${d.hour}:00 - Power: ${d.power.toFixed(2)} kW`);
        });
    }
    

    // Inicijalno ažuriranje bar chart
    updateBarChart(2006, 0);

  // Dodavanje događaja za time slider
d3.select("#timeSlider").on("input", function() {
    const startHour = +this.value;
    const year = +document.querySelector('.year-button.active').getAttribute('data-year');
    d3.select("#timeLabel").text(startHour);
    d3.select("#timeLabelEnd").text(startHour + 1);
    updateBarChart(year, startHour); // Ažuriramo grafikon sa odabranom godinom
});


    // Kreiranje SVG elementa za line chart
    const lineSvg = d3.select("#lineChart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Dodavanje naslova za line chart
    lineSvg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .text("Hourly Trend of Global Active Power");

    // Postavljanje X i Y osi za line chart
    const xLine = d3.scaleLinear().range([0, width]);
    const yLine = d3.scaleLinear().range([height, 0]);

    const xAxisLine = lineSvg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")");
    const yAxisLine = lineSvg.append("g")
        .attr("class", "y-axis");

    // Dodavanje oznaka osi
    lineSvg.append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height + 50)
        .attr("text-anchor", "middle")
        .text("Hour of the Day");

    lineSvg.append("text")
        .attr("class", "y-axis-label")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Global Active Power (kW)");

    // Funkcija za ažuriranje line chart
    function updateLineChart(year) {
        const filteredData = filterDataByYear(year);
        const hourlyData = groupDataByHour(filteredData);
        const hourlyDataArray = Array.from(hourlyData, ([hour, power]) => ({hour, power}));

        // Postavljanje domena za osi
        xLine.domain([0, 23]);
        yLine.domain([0, d3.max(hourlyDataArray, d => d.power)]);

        xAxisLine.call(d3.axisBottom(xLine).tickFormat(d => d + ":00").tickSize(0))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");
        yAxisLine.call(d3.axisLeft(yLine).ticks(5).tickFormat(d => d + " kW"));

        const line = d3.line()
            .x(d => xLine(d.hour))
            .y(d => yLine(d.power));

        lineSvg.selectAll(".line").remove();

        lineSvg.append("path")
            .datum(hourlyDataArray)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line);
    }

    // Inicijalno ažuriranje line chart
    updateLineChart(2006);

    // Selektovanje svih dugmića za godine
const yearButtons = document.querySelectorAll('.year-button');

// Funkcija za ažuriranje grafa na osnovu odabrane godine
yearButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Ukloniti klasu "active" sa svih dugmića
        yearButtons.forEach(btn => btn.classList.remove('active'));

        // Dodati klasu "active" na odabrano dugme
        this.classList.add('active');

        // Dobaviti vrednost godine iz dugmeta
        const selectedYear = +this.getAttribute('data-year');
        d3.select("#yearLabel").text(selectedYear);

        // Ažurirati grafove na osnovu odabrane godine
        d3.select("#timeSlider").property("value", 0); // Restartiranje time slider-a na 0
        d3.select("#timeLabel").text(0);
        d3.select("#timeLabelEnd").text(1);
        previousBarsData = []; // Restartiranje prethodnih barova
        barSvg.selectAll(".bar").remove(); // Uklanjanje svih barova
        updateBarChart(selectedYear, 0);
        updateLineChart(selectedYear);
    });
});

function updateScatterPlot(year) {
    const filteredData = filterDataByYear(year);

    // Set up the dimensions and margins of the plot
    const margin = {top: 50, right: 50, bottom: 50, left: 50},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // Remove previous scatter plot if exists
    d3.select("#scatterPlot").selectAll("svg").remove();

    // Append the svg object to the body of the page
    const scatterSvg = d3.select("#scatterPlot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add X axis for Voltage
    const xScatter = d3.scaleLinear()
        .domain([d3.min(filteredData, d => d.Voltage) - 10, d3.max(filteredData, d => d.Voltage) + 10])
        .range([0, width]);
    scatterSvg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScatter));
    
    // Add Y axis for Global Intensity
    const yScatter = d3.scaleLinear()
        .domain([d3.min(filteredData, d => d.Global_intensity) - 2, d3.max(filteredData, d => d.Global_intensity) + 2])
        .range([height, 0]);
    scatterSvg.append("g")
        .call(d3.axisLeft(yScatter));

    // Color scale based on Global Active Power
    const color = d3.scaleSequential(d3.interpolateCool)
        .domain([d3.min(filteredData, d => d.Global_active_power), d3.max(filteredData, d => d.Global_active_power)]);

    // Add dots to the scatter plot
    scatterSvg.append('g')
        .selectAll("dot")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("cx", d => xScatter(d.Voltage))
        .attr("cy", d => yScatter(d.Global_intensity))
        .attr("r", 3)
        .style("fill", d => color(d.Global_active_power))  // Color based on Global Active Power

    // Add X-axis label
    scatterSvg.append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .text("Voltage (V)");

    // Add Y-axis label
    scatterSvg.append("text")
        .attr("class", "y-axis-label")
        .attr("x", -height / 2)
        .attr("y", -40)
        .attr("transform", "rotate(-90)")
        .attr("text-anchor", "middle")
        .text("Global Intensity (A)");

    // Add chart title
    scatterSvg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .text(`Voltage vs Global Intensity for Year ${year}`);
}

// Initial update of the scatter plot
updateScatterPlot(2006);

// Update the scatter plot when the year is changed
yearButtons.forEach(button => {
    button.addEventListener('click', function() {
        const selectedYear = +this.getAttribute('data-year');
        updateScatterPlot(selectedYear);
    });
});


});
