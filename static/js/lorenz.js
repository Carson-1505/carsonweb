
let lorenz_data;
let lorenz_datafile;
async function loadCsv(datafile){
    // Lazily intialized lorenz data
    if (lorenz_data === undefined || lorenz_datafile !== datafile) {
        lorenz_data = await d3.csv(datafile);
        lorenz_datafile = datafile;
    }

    let x = [];
    let y = [];
    let z = [];

    for(const d of lorenz_data) {
        x.push(d.x);
        y.push(d.y);
        z.push(d.z);
    }

    return [x, y, z];
}

async function lorenz_plot() {
    PLOT = document.getElementById('plot-euler');

    Plotly.newPlot(
        PLOT,
        [{
            x: [],
            y: [],
            mode: 'markers'
        }],
        {
            xaxis: {range: [-40, 40]},
            yaxis: {range: [0, 60]}
        },
        {
            displayModeBar: false
        }
    )
}

// Store animationId to be able to cancel the animation frame
let animationId;
async function animate_lorenz(datafile) {

    cancelAnimationFrame(animationId);

    lorenz_plot();
    let [x_list, y_list, z_list] = await loadCsv(datafile);
    let frame_idx = 0;

    async function animation_frame (){

        frame_idx += 1;
        let x = x_list[frame_idx];
        let y = y_list[frame_idx];
        let z = z_list[frame_idx];
        Plotly.animate(PLOT, {
            data: [{x: [x], y: [z]}]
        }, {
            transition: {
                duration: 10
            },
            frame: {
                duration: 10,
                redraw: false
            }
        });
        // Stop animation when out of the data range
        if (frame_idx < x_list.length - 1) {
            animationId = requestAnimationFrame(animation_frame);
        }
    }

    animationId = requestAnimationFrame(animation_frame);
}
// Initialize the plot on the page
lorenz_plot();
