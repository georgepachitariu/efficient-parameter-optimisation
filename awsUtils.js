awsUrl = "http://s3-eu-west-1.amazonaws.com/efficientparameteroptimisation";

class AwsUtil {

    static updateFixedRaster(targetNumber, callback) {

        $.getJSON(awsUrl + "/target/target_" + targetNumber + ".json",
            function (target_lineData) {

                $.get(awsUrl + "/target/raster_target_" + targetNumber, function (csvData) {

                    callback(charts_fixedRasterDiv,
                        target_lineData.target_raster_title,
                        csvData, true);

                });
            });
    }

    static updateVariableRaster(knobs, callback) {

        $.get(awsUrl + "/raster_data/" + knobs[0] + "_" + knobs[1] + "_" + knobs[2] + "_" + knobs[3] + "_" + knobs[4], function (csvData) {

            callback(charts_variableRasterDiv,
                charts_variableRasterTitle,
                csvData, false);

        });

    }

    static display(knobs, targetNumber) {
        AwsUtil.updateVariableRaster(knobs, Charts.drawRaster);

        $.getJSON(awsUrl + "/target/target_" + targetNumber + ".json", function (target_lineData) {

            $.getJSON(awsUrl + "/json_data/" + knobs[0] + "_" + knobs[1] + "_" + knobs[2] + "_" + knobs[3] + "_" + knobs[4] + ".json", function (current_lineData) {

                Charts.drawLineGraphs(current_lineData, target_lineData);

                var current_cost = current_lineData.cost[targetNumber - 1];                
                View.displayCurrentCost(current_cost);
            });
        });
    }


    static showBestFit(callback) {
        var targetNumber=View.getTargetNumber();
        
        $.get(awsUrl + "/solutions/solutions_" + targetNumber + ".csv", function (csvData) {

            callback(charts_variableRasterDiv,
                charts_variableRasterTitle,
                csvData);

        });

        $.getJSON(awsUrl + "/target/target_" + targetNumber + ".json", function (target_lineData) {

            $.getJSON(awsUrl + "/solutions/solutions_" + targetNumber + ".json", function (current_lineData) {

                Charts.drawLineGraphs(current_lineData, target_lineData);

                //View.displayBestFit(current_lineData);
            });
        });
    }

    static getAlgorithmScoreAndDisplayHighscores() {
        var targetNumber=View.getTargetNumber();

        $.getJSON(awsUrl + "/solutions/solutions_" + targetNumber + ".json", function (alg_solution_data) {
                HighScores.createAndDisplayHighScoreTable(alg_solution_data);
            });
    }

}