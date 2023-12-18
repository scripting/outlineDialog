function startup () {
	console.log ("startup");
	
	const options = {
		title: "My Test Outline",
		flReadOnly: false,
		outlineFont: "Arial",
		outlineFontSize: 17,
		outlineLineHeight: 26,
		extraButtonTitle: "Extra!", 
		styles: undefined,
		whereToAppend: $(".divPageBody"),
		styles: ".divOutlineDialogTitle {color: green};",
		divDialogStyles: "divDemoStyles",
		opmltext: localStorage.savedOpmltext,
		extraButtonCallback: function (opmltext) {
			console.log ("extraButtonCallback: opmltext == " + opmltext);
			},
		afterOpenCallback: function () {
			console.log ("afterOpenCallback");
			}
		};
	
	outlineDialog (options, function (flSave, opmltext) {
		if (flSave) {
			console.log ("saveCallback: opmltext == " + opmltext);
			}
		});
	}
