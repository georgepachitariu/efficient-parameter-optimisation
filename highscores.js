
class HighScores {

    static createAndDisplayHighScoreTable(alg_solution_data) {
        $.getJSON("/getHghScores", function(arr) {
        
            var alg_score = Math.round(10000.0 / alg_solution_data.cost[0]) / 10000;
            var alg_steps = Math.round(alg_solution_data.niter[0]);

            var i;
            var tableHtml= "<table>" ;
            tableHtml += "<tr><td>Pos.</td><td>Nickname</td><td>Score</td><td>Steps</td></tr>";

            tableHtml += "<tr style=\"color: red;\"><td>*</td><td>ALGORITHM</td><td>"+alg_score+"</td><td>"+alg_steps+"</td></tr>";


            for(i = 0; i < arr.length; i++) {
                tableHtml += "<tr>";
                tableHtml += "<td>" + (i+1) + "</td><td>" + arr[i].fields.nickname +"</td>";
                tableHtml += "<td>" + (Math.round(10000.0/arr[i].fields.score)/10000) + "</td>";
                tableHtml += "<td>" + arr[i].fields.steps +"</td>";
                tableHtml += "</tr>";
            }
            tableHtml += "</table></div>";

            View.displayHighScoreTable(tableHtml);
        });


    }

}