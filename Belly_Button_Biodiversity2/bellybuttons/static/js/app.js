function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;
  Plotly.d3.json(url, function(error, response){
    if(error) return console.warn(error);
     console.log(response);
     var data = response[0];
     console.log(data);
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel= d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(response).forEach(
      ([key, value])  => panel.append("p").text(`${key}: ${value}`)
     );
  });
};
function buildBubble(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  Plotly.d3.json(url, function (error, response){
    if (error) return console.log(error);

    // @TODO: Build a Bubble Chart using the sample data
    var x_values = response.otu_ids;
    var y_values = response.sample_values;
    var m_size = response.sample_values;
    var m_colors = response.otu_ids; 
    var t_values = [];
      for (i=0; i<x_values.length; i++) {
        t_values.push(response[x_values[i]-1]);
      };

    var trace = {
      x: x_values,
      y: y_values,
      text: t_values,
      mode: 'markers',
      marker: {
        color: m_colors,
        size: m_size
      } 
    };
  
    var data = [trace];

    var layout = {
      xaxis: { title: "OTU ID"},
    };

    Plotly.newPlot('bubble', data, layout);
    
  });
};  

    // @TODO: Build a Pie Chart
  function buildPie(sample)  {
    var url = `/samples/${sample}`;
    Plotly.d3.json(url,function(error,response) {  
      if(error) return console.log(error);
      var pie_values = [] 
      var pie_labels = []
      var pie_hover = []
      
      for(i=0;i<11;i++) {
        var pie_label = response.otu_ids[i];
        pie_labels.push(pie_label);
        var pie_value = response.sample_values[i];
        pie_values.push(pie_value);
        var hover = response[pie_label - 1];
        pie_hover.push(hover);
      };

      var trace1 = {
        values: pie_values,
        labels: pie_labels,
        hovertext: pie_hover,
        type: 'pie'
      };
      var data =[trace1]
     
      Plotly.newPlot('pie', data);

    });
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  console.log("Starting Code");
  // Use the list of sample names to populate the select options
  d3.json("/names", function(error,response) {
    if(error) return console.warn(error);
    var data = response;
    data.map(function(sample) {
        var optionChoice = document.createElement("option");
        optionChoice.text = sample;
        optionChoice.value = sample
        selector.appendChild(optionChoice);
    });
  });
};
// Initialize the dashboard
init();
// Use the first sample from the list to build the initial plots
function optionChanged(sample) {
  // Fetch new data each time a new sample is selected
  buildPie(sample);
  buildBubble(sample);
  buildMetadata(sample);
}

optionChanged(sample)

