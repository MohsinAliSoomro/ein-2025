$(document).ready(function (e) {
  $('#candidate-login-form').submit(function (e) {
    e.preventDefault();
    const data = $(this).serialize()

    $.ajax({
      type: "POST",
      url: "login",
      data: data,
      success: successResponseHandler,
      error: errorResponseHandler
    });

  })

  function successResponseHandler(response) {
    // swal("Success!", response.message, "success").then(() => {
    //   location.href = response.redirectUrl
    // })
    // toastr.success( response.message );
    toastr.options.onHidden = () => location.href = response.redirectUrl;
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
