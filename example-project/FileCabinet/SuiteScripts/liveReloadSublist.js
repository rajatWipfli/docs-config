/**
 * @summary To be used on ClientScript only.
 * @module Utilities/LiveReload
 * @NScriptContext Client
 *
 */
define(['N/https', 'N/url'], function (https, url) {

    /**
     * Enable the live reload on the passed sublists
     * @param {*} currentRecord
     * @param {Array<string>|string} sublistIDs
     * @memberof module:Utilities/LiveReload
     */
    function enableSublistLiveReload(currentRecord, sublistIDs) {
        if (!jQuery) {
            return;
        }
        var sublistIDList = [];
        if (!Array.isArray(sublistIDs)) {
            sublistIDList.push(sublistIDs);
        } else{
            sublistIDList = sublistIDs;
        }

        sublistIDList.forEach(function (sublistID) {
            internalLiveReloader(currentRecord, sublistID);
        });
    }

    /**
     * @private
     * @param {*} currentRecord
     * @param {string} sublistID
     * @memberof module:Utilities/LiveReload
     *
     */
    function internalLiveReloader(currentRecord, sublistID) {
        var isLiveReloadEnabled = currentRecord.getField({
            fieldId: 'cust_live_reload_' + sublistID
        });
        if (!isLiveReloadEnabled) {
            return;
        }
        var runnerID = null;
        // Buffer calls accommodate extra calculations or delay cuased in updating the final status on list items after backend processing tasks are done.
        var bufferCalls = 2;
        // Whether the LiveReload has run once.
        var hasRun = false;
        clearTimeout(runnerID);
        var reloadCallback = function () {
            var scriptId = currentRecord.getValue({fieldId: 'custbody_script_id'});
            var deploymentId = currentRecord.getValue({fieldId: 'custbody_deployment_id'});
            https.get.promise({
                url: url.resolveScript({
                    scriptId: scriptId,
                    deploymentId: deploymentId,
                    params: {
                        action: 'should_live_reload',
                        sublistId: sublistID
                    }
                })
            }).then(function (response) {
                // Stop the live reload
                if (response.body === 'TRUE') {
                    hasRun = true;
                    runnerID = setTimeout(reloadCallback, 1000 * 3);
                    jQuery('#refresh' + sublistID).click();
                    // Only run the buffer calls when liveReload was active
                } else if(bufferCalls-- && hasRun){
                    runnerID = setTimeout(reloadCallback, 1000 * 3);
                    jQuery('#refresh' + sublistID).click();
                }
            }).catch(function () {
                clearInterval(runnerID);
                showLiveReloadStatus(true);
            });
        };

        reloadCallback();
    }

    /**
     * @private
     * @param {Boolean} isDisconnected
     * @memberof module:Utilities/LiveReload
     */
    function showLiveReloadStatus(isDisconnected) {
        var message = isDisconnected ? 'Live reload is disconnected. Please use the Refresh button or reload the page to refresh the list.' : '';

        var messageHTML = `<div class="unrollformsubtabheaderexpand" id="cust_live_reload_message_bar">
            <div class="uir-outside-fields-wrapper" data-field-type="help">
                <span id="criteriahelp_fs" class="text">
                    <div class="uir-field-help-icon" style="margin-bottom: 4px;"></div>
                    <div class="uir-field-help" style="padding: 13px 10px 13px 20px;">${message}</div>
                </span>
            </div></div>`;
        jQuery('#cust_live_reload_message_bar').remove();
        jQuery('.uir-list-control-bar').parent().prepend(messageHTML);
    }

    return {enableSublistLiveReload: enableSublistLiveReload};
});
