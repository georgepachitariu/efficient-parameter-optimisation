class Game {

static newGame(targetNumber) {
    View.init();
    View.setKnobs([7,7,7,7,7]);

    targetNumber = +targetNumber + +2;


    $.get("/changeLevel?targetNumber=" + targetNumber, function() {
        AwsUtil.updateFixedRaster(targetNumber, Charts.drawRaster);
        Game.changeCombination();
    });
}

static finishGame() {
    $.get("/finishGame", function(response) {
        View.disableKnobsAndSimulateButton();
        
        if (response == 1) {
            // if this is a highscore, we show the form to enter the nickname
            View.hideFinishGameButton();
            View.displayNicknamePanel();

        } else {
            // if there was no highscore, we don't need to wait for other user input
            // and we can display the highscores
            View.displayEndedGamePanel();
            AwsUtil.getAlgorithmScoreAndDisplayHighscores();
        }
    });
}

static submitNickname(nickname) {

    $.get("/submitNickname?nickname=" + nickname, function(response) {
        // also on the server it checks again if its a true highscore
        View.hideNicknamePanel();

        View.displayEndedGamePanel();
        AwsUtil.getAlgorithmScoreAndDisplayHighscores();
    });
}

static changeCombination() {
    var knobs=View.getKnobs();
    
    var targetNumber=View.getTargetNumber();
    AwsUtil.display(knobs, targetNumber);

    $.getJSON("/update?k1=" + knobs[0] + ";k2=" + knobs[1] + ";k3=" + knobs[2] + ";k4=" + 
        knobs[3] + ";k5=" + knobs[4], function (levelMeta) {
            
        var best_cost = levelMeta.bestScore;
        View.displayBestCost(best_cost);
    });
}

static jumpToBestCombinationFoundSoFar() {
    $.get("/jumpToBestCombinationFoundSoFar", function(result) {
        var knobs=result.split(",");
        View.setKnobs(knobs);        
        Game.refreshGameOutput();
    });
}

static refreshGameOutput() {
    var knobs=View.getKnobs();
    var targetNumber=View.getTargetNumber();
    
    $.getJSON("/getCurrentScore?k1=" + knobs[0] + ";k2=" + knobs[1] + ";k3=" + knobs[2] + ";k4=" + 
        knobs[3] + ";k5=" + knobs[4], function (levelMeta) {
            
        var best_cost = levelMeta.bestScore;
        View.displayBestCost(best_cost);
    });
    AwsUtil.display(knobs, targetNumber);
}


static showBestFit() {
    View.hideBestFitButton();
    AwsUtil.showBestFit(Charts.drawRaster);
}

}