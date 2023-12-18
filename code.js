function outlineDialog (userOptions, callback) {
	console.log ("outlineDialog");
	
	var theConcordOutline, divOutlineDialog;
	
	const savedStuff = {
		idOutliner: idDefaultOutliner,
		styleNode: undefined
		};
	const options = {
		title: "My outline dialog",
		flReadOnly: false,
		outlineFont: "Ubuntu",
		outlineFontSize: 14,
		outlineLineHeight: 20,
		idOutliner: "idOutlineDialogOutliner",
		extraButtonTitle: undefined, 
		styles: undefined,
		divDialogStyles: undefined, //the best way to add styles, tell us what div you want us to add to the list of classes
		whereToAppend: undefined,
		opmltext: initialOpmltext,
		extraButtonCallback: function () {
			},
		afterOpenCallback: function () {
			}
		};
	for (var x in userOptions) {
		options [x] = userOptions [x];
		}
	
	function insertStyles () { 
		var styleNode = document.createElement ("style");
		var styleText = document.createTextNode (options.styles);
		styleNode.type = "text/css";
		styleNode.appendChild (styleText);
		document.getElementsByTagName ("head") [0].appendChild (styleNode);
		savedStuff.styleNode = styleNode; //so we can delete it later
		}
	function closeOutlineDialog (flSave) {
		const opmltext = opOutlineToXml ();
		idDefaultOutliner = savedStuff.idOutliner;
		
		divOutlineDialog.modal ("hide"); 
		if (savedStuff.styleNode !== undefined) { //delete if it exists
			setTimeout (function () { //2/27/16 by DW -- wait a second before deleting styles, give dialog a chance to be hidden
				document.getElementsByTagName ("head") [0].removeChild (savedStuff.styleNode);
				delete savedStuff.styleNode;
				}, 1000);
			}
		
		if (callback !== undefined) {
			callback (flSave, opmltext);
			}
		
		concord.handleEvents = false; //11/19/23 by DW
		}
	function cancelOutlineDialog () {
		closeOutlineDialog (false);
		}
	function saveOutlineDialog () {
		closeOutlineDialog (true);
		}
	function setupDomStructure () {
		divOutlineDialog = $("<div class=\"modal hide fade divOutlineDialog\"></div>");
		
		const modalHeader = $("<div class=\"modal-header\"></div>");
		const closeIconInHeader = $("<a href=\"#\" class=\"close\" data-dismiss=\"modal\">&times;</a>");
		const divOutlineDialogTitle = $("<div class=\"divOutlineDialogTitle\"></div>");
		divOutlineDialogTitle.text (options.title);
		modalHeader.append (closeIconInHeader);
		modalHeader.append (divOutlineDialogTitle);
		divOutlineDialog.append (modalHeader);
		
		const modalBody = $("<div class=\"modal-body\"></div>");
		const divDialogElements = $("<div class=\"divDialogElements\"></div>");
		const divOutlineDialogOutline = $("<div class=\"divOutlineDialogOutline\" id=\"" + options.idOutliner + "\"></div>");
		theConcordOutline = divOutlineDialogOutline; //set global
		modalBody.append (divDialogElements);
		modalBody.append (divOutlineDialogOutline);
		divOutlineDialog.append (modalBody);
		
		const modalFooter = $("<div class=\"modal-footer\"></div>");
		const saveButton = $("<a href=\"#\" class=\"btn\">Save</a>");
		
		if (options.extraButtonTitle !== undefined) {
			const extraButton = $("<a href=\"#\" class=\"btn extraBtn\">" + options.extraButtonTitle + "</a>");
			modalFooter.append (extraButton);
			extraButton.click (function () {
				options.extraButtonCallback (opOutlineToXml ());
				});
			}
		
		if (!options.flReadOnly) { //Cancel button
			const cancelButton = $("<a href=\"#\" class=\"btn\" id=\"idOutlineDialogCancelButton\">Cancel</a>");
			modalFooter.append (cancelButton);
			cancelButton.click (function () {
				console.log ("click cancel button");
				cancelOutlineDialog ();
				});
			}
		
		modalFooter.append (saveButton);
		saveButton.click (function () {
			console.log ("click save button");
			saveOutlineDialog ();
			});
		
		divOutlineDialog.append (modalFooter);
		
		const divContainer = $("<div class=\"" + options.divDialogStyles + "\"></div>");
		divContainer.append (divOutlineDialog);
		return (divContainer);
		}
	
	const divContainer = setupDomStructure ();
	options.whereToAppend.append (divContainer);
	
	idDefaultOutliner = options.idOutliner;
	
	const outlinerOptions = {
		outlineFont: options.outlineFont,
		outlineFontSize: options.outlineFontSize,
		outlineLineHeight: options.outlineLineHeight,
		};
	opInitOutliner (options.opmltext, getBoolean (options.flReadOnly), undefined, undefined, outlinerOptions);
	
	insertStyles ();
	
	divOutlineDialog.modal ("show");
	divOutlineDialog.on ("shown", function () {
		theConcordOutline.focus (); 
		concord.handleEvents = true; 
		});
	
	options.afterOpenCallback ();
	}
