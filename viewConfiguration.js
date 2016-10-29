class ViewConfiguration {

    static configureKnobIncrementors() {

        $('.qtyplus').click(function (e) {
            e.preventDefault();
            var fieldName = $(this).attr('id').split("_")[0];
            var currentVal = parseInt($('input[id=' + fieldName + ']').val());

            if (!isNaN(currentVal) && currentVal < 15) {
                // Increment
                $('input[id=' + fieldName + ']').val(currentVal + 1);
            }
        });

        $(".qtyminus").click(function (e) {
            e.preventDefault();
            var fieldName = $(this).attr('id').split("_")[0];
            var currentVal = parseInt($('input[id=' + fieldName + ']').val());

            if (!isNaN(currentVal) && currentVal > 1) {
                // Decrement
                $('input[id=' + fieldName + ']').val(currentVal - 1);
            }
        });
    }

    static configureModal() {

        var modal = document.getElementById('myModal');
        var btn = document.getElementById("modalBtn");
        var span = document.getElementsByClassName("close")[0];

        btn.onclick = function () {
            modal.style.display = "block";
        }

        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

        // we open the help modal
        modal.style.display = "block";
    }
}