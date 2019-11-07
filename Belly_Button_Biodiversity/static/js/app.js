// @TODO: Complete the following function that builds the metadata panel
function buildMetadata(sample) {

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((data) => {

      // Use d3 to select the panel with id of `#sample-metadata`
      let selectPanel = d3.select("#sample-metadata");
      
      console.log(sample);
      d3.json(`/${sample}`).then(function(data) {
        console.log("newdata", data);
        updatePlotly(data);
      });
      // Use `.html("") to clear any existing metadata
      selectPanel.html("");

      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new tags for each key-value in the metadata
      Object.entries(data).forEach(([key, value]) => {
          selectPanel.append("h6").text(`${key}:${value}`);
      });
  });
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to Fetch the Sample Data for the Plots
  d3.json(`/samples/${sample}`).then((data) => {

      let otu_ids = data.otu_ids;
      let otu_labels = data.otu_labels;
      let sample_values = data.sample_values;      

      // @TODO: Build a Pie Chart
      // HINT: Use slice() to Grab the Top 10 sample_values,
      // otu_ids, and otu_labels (10 Each)
      let pieChartData = [
        {
          values: sample_values.slice(0, 10),
          labels: otu_ids.slice(0, 10),
          hovertext: otu_labels.slice(0, 10),
          hoverinfo: "hovertext",
          type: "pie"
        }
      ];
      
      let pieChartLayout = {
        margin: { t: 0, l: 0 }
      };
  
      Plotly.plot("pie", pieChartData, pieChartLayout);

      // @TODO: Build a Bubble Chart Using the Sample Data
      let bubbleChartData = [
        {
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
            size: sample_values,
            color: otu_ids,
          }
        }
      ];

      let bubbleChartLayout = {
        margin: { t: 0 },
        hovermode: "closests",
        xaxis: { title: "OTU ID"}
      };
  
      Plotly.plot("bubble", bubbleChartData, bubbleChartLayout);
  });
};

function init() {

  // Grab a Reference to the Dropdown Select Element
  let dropdownSelect = d3.select("#selDataset");
  
  // Use the List of Sample Names to Populate the Select Options
  d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
          dropdownSelect
              .append("option")
              .text(sample)
              .property("value", sample)
      });
  
      // Use the First Sample from the List to Build Initial Plots
      let firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
  });
};
  
function collectNewData(newSample) {

  // Fetch New Data Each Time a New Sample is Selected
  buildCharts(newSample);
  buildMetadata(newSample);
};
  
// Initialize the Dashboard
init();