class View {

    static viewOnLoad() {
        ViewConfiguration.configureKnobIncrementors();
        ViewConfiguration.configureModal();
        $("#finishGameB").button();
        $("#showBestFitB").button();
        $("#simulateB").button();     
        $(".knobs").button();

        $(".knobs").mouseup(function(){
            $(this).blur();
        })    
    }

    static init() {
        View.enableKnobsAndSimulateButton();
                 
        // show finish_game button & hide new_game button
        $("#finishGameB").button("enable");

        // hide:
        $("#showBestFitB").button("disable");
        document.getElementById("nicknamePanel").style.display = 'none';
        document.getElementById("highscoresPanel").style.display = 'none';
        document.getElementById("bestFitPanel").style.display = 'none';

//        document.getElementById("finishGame").style.display = 'block';


        $(window).keydown(function (e) {
            if (e.keyCode == 13) {
                // key 'enter'
                Game.changeCombination();
            }
        });
    }

    static displayEndedGamePanel() {
        // show new_game button & hide finish_game button
        $("#finishGameB").button("disable");

        View.displayBestFitButton();
    }

    
    static displayNicknamePanel() {
        document.getElementById("nicknamePanel").style.display = 'block';
    }
    static hideNicknamePanel() {
        document.getElementById("nicknamePanel").style.display = 'none';
    }


    static displayBestFitButton() {
        $("#showBestFitB").button("enable");
    }
    static hideBestFitButton() {
        $("#showBestFitB").button("disable");
    }

    static displayHighScoreTable(tableHtml) {
        document.getElementById("highscoresTable").innerHTML = tableHtml;
        document.getElementById("highscoresPanel").style.display = 'block';
    }

    static hideHighscores() {
        document.getElementById("highscoresPanel").style.display = 'none';
    }

    static displayBestFit(current_lineData) {
        document.getElementById("bestFitPanel").style.display = 'block';

        var score = Math.round(10000.0 / current_lineData.cost[0]) / 10000;
        document.getElementById("score").innerHTML = "*" + score + "*";

        document.getElementById('bestFitValueB').innerHTML = Math.round(current_lineData.niter[0]);
    }

    static hideFinishGameButton() {
        $("#finishGameB").button("disable");
    }
    

    static getKnobs() {
        var knob1 = $('#knob1').val();
        var knob2 = $('#knob2').val();
        var knob3 = $('#knob3').val();
        var knob4 = $('#knob4').val();
        var knob5 = $('#knob5').val();
        return [knob1, knob2, knob3, knob4, knob5];
    }

    static getTargetNumber() {
        var targetNumber = document.getElementById('target').value;
        targetNumber = +targetNumber + +2;
        return targetNumber;
    }

    static setKnobs(knobs) {            
      $('#knob1').val(knobs[0]);
      $('#knob2').val(knobs[1]);
      $('#knob3').val(knobs[2]);
      $('#knob4').val(knobs[3]);
      $('#knob5').val(knobs[4]);
    }

    static displayCurrentCost(current_cost) {
        document.getElementById("score").innerHTML = 
                    Math.round(10000.0 / current_cost) / 10000;
    }

    static displayBestCost(best_cost) {
        document.getElementById("bestScore").innerHTML = 
                    Math.round(10000.0 / best_cost) / 10000;
    }

    static enableKnobsAndSimulateButton() {
        $(".knobs").button("enable");
        $("#simulateB").button("enable");
    }

    static disableKnobsAndSimulateButton() {
        $(".knobs").button("disable");
        $("#simulateB").button("disable");
    }
}