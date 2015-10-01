// ==UserScript==
//@name        Attask Balance
//@version     0.1
//@description Auto calculate hours balance
//@author      Sam Tay
//@match       https://blueacorn.attask-ondemand.com/task/view*
//@grant       none
// ==/UserScript==

jQuery(document).ready(function($) {
    function updateBalance() {
        // Get task ID
        var taskId = (function(variable) {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if(pair[0] == variable){return pair[1];}
            }
            return(false);
        })('ID');

        // Delete old callouts
        $('#samtay-callout').remove();

        // Ajax get task details tab content
        $.post('https://blueacorn.attask-ondemand.com/tile', {
            updateListLimit: "20",
            detailObjCode: "TASK",
            detailObjID: taskId,
            content: "tabs-task-details-forms"
        }).done(function(data, textStatus, jqXHR) {
            var $miniDocument = $(data),
                planned = $miniDocument.find('li[name="workRequiredExpression"] div.view').text().toFloat(),
                used = $miniDocument.find('li[name="actualWorkFieldLong"] div.view').text().toFloat(),
                balance = planned - used;

            // Put balance in the nav, easy to see there
            var balanceCallout = '<span id="samtay-callout" style="color:red;float:right;"><strong>Hours Left: '
                + balance + '</strong></span>';
            $('div#breadcrumb-task-details nav').append(balanceCallout);
        });
    }

    updateBalance();

    // Update balance after logging time, wait a bit for request to finish
    $('#LogTimePanel .LogTime button.submit').on('click', function() {
        setTimeout(updateBalance, 2500);
    });
});