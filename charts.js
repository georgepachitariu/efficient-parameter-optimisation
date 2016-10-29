
charts_variableRasterDiv = '#raster_variable';
charts_fixedRasterDiv = '#raster_fixed';
charts_variableRasterTitle = 'current simulation';

class Charts {

    static drawRaster(div, title, csvData, target) {
        var pointColor;
        if(target==true)
            pointColor='#00b300';
        else
            pointColor='#000000';

        $(div).highcharts(
            Charts.drawRasterChart(title, csvData, pointColor),
                Charts.addRasterLaneNumbersFunction
        );
    }

    static addRasterLaneNumbersFunction(chart) {
        for (var i = 1; i <= 6; i++) {
            chart.renderer.text(i, 45, 44 + i * 23)
                .css({
                    color: '#606060',
                    fontSize: '11px'
                })
                .add();
        }
    }

static initHighCharts() {
    if (!Highcharts.Series.prototype.renderCanvas) {
        console.error('Module not loaded');
    }
}
//'#00b300'
static drawRasterChart(chartTitle, csvData, pointColor) {
    var raster = {
        chart: { type: 'scatter' },
        data: { csv: csvData },
        title: { text: chartTitle },
        subtitle: { text: '' },
        xAxis: {
            title: {
                text: 'time'
            },
            min: 0,
            max: 3
        },
        yAxis: {
            title: {
                text: 'Trials'
            },
            min: 0,
            max: 60,
            tickInterval: 10,
            labels: {
                style: {
                    color: 'transparent'
                }
            },
        },
        series: [{
            name: 'Point',
            color: pointColor,
            marker: {
                radius: 1
            },
            tooltip: {
                followPointer: false,
                pointFormat: '[{point.x:.1f}, {point.y:.1f}]'
            }
        }],
    }

    return jQuery.fn.extend(raster, Charts.getStandardConfig());
}


static getStandardConfig() {
    return {
        legend: { enabled: false },
        tooltip: { enabled: false },
        credits: { enabled: false },
        navigation: {
            menuItemStyle: { fontSize: '10px' }
        },
        exporting: { enabled: false },
        plotOptions: {
            spline: {
                enableMouseTracking: false,
                lineWidth: 2,
                marker: { enabled: false },
                pointInterval: 2,
                pointStart: 1,
                shadow: false
            },
            series: {
                enableMouseTracking: false,
                animation: false,
                states: {
                    hover: { enabled: false }
                },
                shadow: false
            }
        }
    }
}

static drawLineGraphs(current_lineData, target_lineData) {

    if (current_lineData.AC[0] > 400) {
        document.getElementById('raster_variable').style.visibility = 'hidden';
        $('#raster_variable').find('.highcharts-container').hide();
        document.getElementById("score").innerHTML = '';

        current_lineData = {}

        document.getElementById("result").innerHTML = "firing rate not physiologically plausible";
    } else {
        document.getElementById("result").innerHTML = '';
    }


    var AC_chart = {
        chart: { type: 'spline' },
        title: { text: 'auto-correlogram'},
        xAxis: {
            title: { text: 'time (s)' },
            tickPositions: [0, 68, 136, 204],
            labels: {
                formatter: function () {
                    return this.value / 68;
                }
            },
        },
        yAxis: {
            title: { text: '' }
        },
        series: [{
            name: 'Metric1',
            data: target_lineData.AC,
            color: '#00b300'
        }, {
            name: 'Metric2',
            data: current_lineData.AC,
            color: '#000000'
        }]
    };

    var AC_chart = jQuery.fn.extend(AC_chart, Charts.getStandardConfig());
    $('#raster_line_AC').highcharts(AC_chart);




    var MUA_chart = {
        chart: { type: 'spline' },
        title: { text: 'multi-unit activity' },
        xAxis: {
            title: { text: '' },
            tickPositions: [0, 100, 200],
            labels: {
                formatter: function () {
                    return this.value / 200;
                }
            },
        },
        yAxis: {
            title: { text: 'firing rate (Hz)' },
            tickPositions: [0, 0.15, 0.3, 0.45],
            labels: {
                formatter: function () {
                    return Math.round(this.value * (10 / 0.15));
                }
            },
        },
        series: [{
            name: 'Metric1',
            data: target_lineData.MUA,
            color: '#00b300'
        }, {
            name: 'Metric2',
            data: current_lineData.MUA,
            color: '#000000'
        }]
    };

    var MUA_chart = jQuery.fn.extend(MUA_chart, Charts.getStandardConfig());
    $('#raster_line_MUA').highcharts(MUA_chart);



    var point_chart = {
        chart: { type: 'column' },
        title: { text: 'noise correlations' },
        xAxis: {
            labels: { enabled: false }
        },
        yAxis: {
            min: -0.02,
            max: 0.2,
            tickInterval: 0.05,
            // min: -1, max: 1, tickInterval: 0.2,
            gridLineColor: '#197F07',
            gridLineWidth: 0,
            lineWidth: 1,
            title: {
                text: ''
            },
            plotLines: [{
                color: '#FF0000',
                width: 1,
                value: 0
            }]
        },
        series: [{
            name: '',
            data: target_lineData.NC,
            color: '#00b300'
        }, {
            name: '',
            data: current_lineData.NC,
            color: '#000000'
        }]
    };

    var point_chart = jQuery.fn.extend(point_chart, Charts.getStandardConfig());
    $('#raster_point').highcharts(point_chart);
}

}