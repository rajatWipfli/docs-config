exports.defineTags = function (dict) {
    //  @NApiVersion
    dict.defineTag('NApiVersion', {
        mustHaveValue: true,
        onTagged: function (doclet, tag) {
            doclet.suitescipt = doclet.suitescipt || {};
            doclet.suitescipt['NApiVersion'] = tag.text;
        }
    });
    // @NScriptType
    dict.defineTag('NScriptType', {
        mustHaveValue: true,
        onTagged: function (doclet, tag) {
            doclet.suitescipt = doclet.suitescipt || {};
            doclet.suitescipt['NScriptType'] = tag.text;
        }
    });
    // @EntryPoint
    dict.defineTag('EntryPoint', {
        mustNotHaveValue: true,
        canHaveName: true,
        onTagged: function (doclet, tag) {
            doclet.suitescipt = doclet.suitescipt || {};
            if (doclet.meta?.code?.type === 'FunctionDeclaration') {
                doclet.suitescipt['isEntryPoint'] = true;
                doclet.suitescipt['EntryPointName'] = tag.text || doclet.meta?.code?.name;
            }
        }
    });
    // @NScriptContext
    dict.defineTag('NScriptContext', {
        mustHaveValue: true,
        canHaveName: false,
        onTagged: function (doclet, tag) {
            doclet.suitescipt = doclet.suitescipt || {};
            doclet.suitescipt['NScriptContext'] = tag.text;
        }
    });
};

exports.handlers = {
    newDoclet: function ({doclet}) {
        if (doclet.kind === 'module') {
            // console.log(doclet);
            addSuiteSciptMeta(doclet);
        }
        if (doclet.suitescipt && doclet.suitescipt['isEntryPoint']) {
        }
    }
}

function addSuiteSciptMeta(doclet) {
    const suitesciptDetailsItems = [];
    if (!doclet.suitescipt) {
        return;
    }
    if (doclet.suitescipt['NApiVersion']) {
        suitesciptDetailsItems.push(`<span><dt class="tag-source">NApiVersion:</dt>
        <dd class="tag-source"><ul class="dummy">${doclet.suitescipt['NApiVersion']}</ul></dd></span>`);
    }
    if (doclet.suitescipt['NScriptType']) {
        suitesciptDetailsItems.push(`<span><dt class="tag-source">NScriptType:</dt>
        <dd class="tag-source"><ul class="dummy">${doclet.suitescipt['NScriptType']}</ul></dd></span>`);
    }
    if (doclet.suitescipt['NScriptContext']) {
        suitesciptDetailsItems.push(`<span><dt class="tag-source">To be used by:</dt>
                <dd class="tag-source"><ul class="dummy">${doclet.suitescipt['NScriptContext']} scripts</ul></dd></span>`);
    }

    const suitesciptDetails = `<dl class="details netsuite_banner">${suitesciptDetailsItems.join('')}</dl>`;
    doclet.description = doclet.description ? `${suitesciptDetails}\n${doclet.description}` : suitesciptDetails;
    doclet.meta = null;
}
