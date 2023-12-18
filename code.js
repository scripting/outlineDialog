function outlineDialog (userOptions, callback) {
	console.log ("outlineDialog");
	
	var theConcordOutline, divOutlineDialog;
	
	const savedStuff = {
		idOutliner: idDefaultOutliner
		};
	const options = {
		title: "My outline dialog",
		flReadOnly: false,
		outlineFont: "Ubuntu",
		outlineFontSize: 16,
		outlineLineHeight: 24,
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
		if (userOptions [x] !== undefined) {
			options [x] = userOptions [x];
			}
		}
	
	function closeOutlineDialog (flSave) {
		const opmltext = opOutlineToXml ();
		idDefaultOutliner = savedStuff.idOutliner;
		concord.handleEvents = false; //11/19/23 by DW
		
		divOutlineDialog.modal ("hide"); 
		divOutlineDialog.on ("hidden", function () {
			console.log ("hidden");
			divContainer.remove ();
			});
		
		if (callback !== undefined) {
			callback (flSave, opmltext);
			}
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
		const saveButtonText = (options.flReadOnly) ? "OK" : "Save";
		const saveButton = $("<a href=\"#\" class=\"btn\">" + saveButtonText + "</a>");
		
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
	function cleanUpOldOutlineDialogs () {
		$(".divOutlineDialog").remove ();
		if (options.divDialogStyles !== undefined) {
			$("." + options.divDialogStyles).remove ();
			}
		}
	function insertStyles () { 
		var styleNode = document.createElement ("style");
		var styleText = document.createTextNode (options.styles);
		styleNode.type = "text/css";
		styleNode.appendChild (styleText);
		document.getElementsByTagName ("head") [0].appendChild (styleNode);
		}
	
	cleanUpOldOutlineDialogs ();
	
	const divContainer = setupDomStructure ();
	options.whereToAppend.append (divContainer);
	
	idDefaultOutliner = options.idOutliner;
	
	const outlinerOptions = {
		outlineFont: options.outlineFont,
		outlineFontSize: options.outlineFontSize,
		outlineLineHeight: options.outlineLineHeight,
		};
	opInitOutliner (options.opmltext, getBoolean (options.flReadOnly), undefined, undefined, outlinerOptions);
	options.afterOpenCallback ();
	
	insertStyles ();
	
	divOutlineDialog.modal ("show");
	divOutlineDialog.on ("shown", function () {
		concord.handleEvents = true; 
		theConcordOutline.focus (); 
		});
	}
