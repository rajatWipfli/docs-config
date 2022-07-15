 Sublist live reload feature allows the sublist to refresh automatically when any backend task is running which indirectly or directly modifies the data on the sublist.

### Technicals

  To enable live reload on a sublist follow the steps below.

  - Enable `liveReloadEnabled` by passing it to the config while creating the sublist via [UILib.createSublist]{@link module:UI/UILib.createSublist}.
  - The reload Suitelet needs to listen for get call for action `should_live_reload`. Response should return `TRUE` or `FALSE` as string values to the frontend. `TRUE` value tells the frontend that backend tasks are still running and frontend needs to continue the live reload.
  - For indicating a failure to determine the status for live reload, return a JSON response with first key named `error`. This will stop the live reloader on frontend and a info notification will be shown to the user.

  ![live-reload-disconnected-banner.jpeg](/assets/live-reload-disconnected-banner.jpeg)

  - On Client script, call the [LiveReload.enableSublistLiveReload]{@link module:Utilities/LiveReload.enableSublistLiveReload} on the desired sublist to start the live reload.

  ```js
        LiveReload.enableSublistLiveReload(currentRecord.get(), 'custsublist_batch');
  ```



### Example

##### ClientScript

 ```js
 /**
 *@NApiVersion 2.x
 *@NScriptType ClientScript
 */

define(['../../Utilities/liveReloadSublist'], function(LiveReload){

    function pageInit(){
        LiveReload.enableSublistLiveReload(currentRecord.get(), 'custsublist_batch');
    }

    return {
        pageInit: pageInit,
    }
});
```

##### Suitelet

 ```js
/**
 *@NApiVersion 2.x
 *@NScriptType Suitelet
 */

define(['N/ui/serverWidget', 'N/search', 'N/runtime', 'N/redirect', 'N/record', '../UILib.js', 'N/url', 'N/cache'], function(serverWidget, search, runtime, redirect, record, UILib, url, cache){

    function onRequest(params){
        action = params.request.parameters.action;

        try {
            var scriptObj = runtime.getCurrentScript();
            scriptId = scriptObj.id;
            deploymentId = scriptObj.deploymentId;
            clientScriptPath = './Invoice/paymentBatchesCS.js';

            if(request.method === 'GET'){
                switch(action){
                    case 'should_live_reload': break;
                    default:
                        generateMainBatchForm();
                        break;
                }
                if (action === 'should_live_reload') {
                    response.write(shouldLiveReloadSublist());
                    return;
                }
                UILib.createBackendFields(form, clientScriptPath, scriptId, deploymentId);
                response.writePage(form);
            }

        } catch(error){
            if (action === 'should_live_reload') {
                response.write(JSON.stringify({'error': error.message}));
                return;
            }
        }
    }

    function generateMainBatchForm(error){
        var sublistConfigObj = {
            sublistId: 'custsublist_batch',
            sublistLabel: 'Batches (' + batchResults.length + ')',
            createButton: true,
            exportButton: batchResults.length > 0,
            refreshButton: batchResults.length > 0,
            deleteButton: batchResults.length > 0,
            deleteBox: batchResults.length > 0,
            previousButton: !page.isFirst && batchResults.length > 0,
            nextButton: !page.isLast && batchResults.length > 0,
            currPage: parseInt(pageIndex),
            scriptId: scriptId,
            deploymentId: deploymentId,
            exportFunctionName: 'exportBatchCSV();',
            editLinkParams: {action: 'edit_batch', label: 'Details'},
            exportJSONParams: {action: 'paymentbatch'},
            liveReloadEnabled: batchResults.length > 0,
        };
        var sublist = UILib.createSublist(form, batchResults, sublistConfigObj);
    }

    function shouldLiveReloadSublist() {
        var instances = UILib.getRunningTasks(['customscriptconcur_connect_tasks', 'customscript_britt_mapping']);

        if (instances.length > 0) {
            return 'TRUE';
        }
        return 'FALSE';
    }

    return {
        onRequest: onRequest
    }
});
```
