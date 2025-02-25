$(document).ready(function (e) {
  $('#admin-login-form').submit(function (e) {
    e.preventDefault();
    const data = $(this).serialize()
    console.log(data)
    $.ajax({
      type: "POST",
      url: "login",
      data: data,
      success: successResponseHandler,
      error: errorResponseHandler
    });

  })

  function successResponseHandler(response) {
    toastr.options.onHidden = () => location.href = 'dashboard';
    toastr.success(
      response.message,
    );
  }
  function errorResponseHandler(response) {
    if (response) {
      swal("Oops!", response.responseJSON||"Something went wrong", "error")

    } else {
      swal("Oops!", 'Something went wrong', "error")

    }
  }
});
