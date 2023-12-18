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
		styles: ".divOutlineDialogTitle {color: orange};",
		divDialogStyles: "divDemoStyles",
		opmltext: undefined,
		extraButtonCallback: function (opmltext) {
			console.log ("extraButtonCallback: opmltext == " + opmltext);
			},
		afterOpenCallback: function () {
			console.log ("afterOpenCallback");
			opInsert ("Hello", down);
			}
		};
	
	outlineDialog (options, function (flSave, opmltext) {
		if (flSave) {
			console.log ("saveCallback: opmltext == " + opmltext);
			}
		});
	}
