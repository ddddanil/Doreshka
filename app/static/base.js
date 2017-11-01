$(document).on("keypress", ":input", function(event) {  // решение из stackoverflow как не сабмитить формы по ентеру (я из жс отправляю)
    if (event.keyCode == 13) {
        event.preventDefault();
    }
});

function check_passwd()
{
    var password = document.forms['get_pass']['pass'].value;
    var jsonobj = {password: password};
    $.ajax({
	type: "POST",
	url: "/getpass",
	dataType: "json",
	data: jsonobj,
    });
}

function post_error(xhr, status, error) {
    if(error == "FORBIDDEN") // auth errorx
    {
	alert("You are not authorised to make changes")
    }
}
