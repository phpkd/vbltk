// There's only one difference between this function "phpkd_vbltk_dialog" & the native function "create_editor_dialog", it's the "dialog.style.zIndex" property. (Default: 1000, New: 50)
// This change to force the trnasliteration to float over the the dialog & all of it's content.
vB_Text_Editor.prototype.phpkd_vbltk_dialog = function(html, confirm_callback, bookmark)
{
	var dialog = this.dialog;

	if (!dialog)
	{
		dialog = document.createElement('form');
		document.body.appendChild(dialog);

		dialog.encoding = "multipart/form-data";
		dialog.id = this.editorid + '_dialog';
		dialog.style.position = 'absolute';
		dialog.style.zIndex = 50;
		dialog.style.border = '1px solid black';
		dialog.style.backgroundColor = 'white';

		YAHOO.util.Event.on(dialog, "submit", this.dialog_submit_event, this, true);
	}

	dialog.innerHTML = html;

	this.position_dialog(dialog);
	this.set_dialog_events(dialog);
	this.run_scripts_in_element(dialog);
	this.move_css_in_element(dialog);

	this.dialog = dialog;
	this.create_dialog_overlay();

	this.dialog_confirm_callback = confirm_callback;

	if (typeof(bookmark) != "undefined")
	{
		this.setbookmark();
	}

	return dialog;
}

/**
* Transliteration
*
* @param	event	Event object
*
* @return	boolean
*/
vB_Text_Editor.prototype.phpkd_vbltk = function(e)
{
	this.phpkd_vbltk_dialog('<img src="' + IMGDIR_MISC + '/lightbox_progress.gif" alt="" />', this.phpkd_vbltk_confirm);

	YAHOO.util.Connect.asyncRequest("POST", "ajax.php?do=phpkd_vbltk", {
		success: this.phpkd_vbltk_ajax,
		failure: this.remove_editor_dialog,
		timeout: vB_Default_Timeout,
		argument: [this.editorid],
		scope: this
	}, SESSIONURL
		+ "&securitytoken="
		+ SECURITYTOKEN
		+ "&ajax=1"
		+ "&do=phpkd_vbltk"
		+ "&template=transliteration"
	);
}

vB_Text_Editor.prototype.phpkd_vbltk_ajax = function(ajax)
{
	if (ajax.responseXML)
	{
		var html = ajax.responseXML.getElementsByTagName("html");

		if (html.length)
		{
			this.phpkd_vbltk_dialog(html[0].firstChild.nodeValue, this.phpkd_vbltk_confirm, true);
			YAHOO.util.Dom.get("phpkd_vbltk_textarea").focus();
			// YAHOO.util.Event.on("phpkd_vbltk_textarea", "keypress", this.dialog_submit_event, this, true);
			return;
		}
	}

	this.remove_editor_dialog();
}

vB_Text_Editor.prototype.phpkd_vbltk_confirm = function()
{
	var result = this.dialog.elements['phpkd_vbltk_textarea'].value;
	var doinsert = false;

	if (result = this.verify_prompt(result))
	{
		this.insert_text(result);
	}

	this.remove_editor_dialog();
}