$(document).ready(function (e) {
  $('#reset-password-form').submit(function (e) {
    e.preventDefault();
    const password = $('#password').val();
    const confirmPassword = $('#confirm-password').val();
    if (password !== confirmPassword) {
      // console.log("condition")
      swal("Oops!",'Password and confirm password do not match!', "error")
      return
    }
    const data = $(this).serialize()
    $.ajax({
      type: "POST",
      url: "/reset-password",
      data: data,
      success: successResponseHandler,
      error: errorResponseHandler
    });

  })

  function successResponseHandler(response) {
    toastr.options.onHidden = () => location.href = '/';
    toastr.success(
      response.message,
    );
  }
  function errorResponseHandler(response) {
    if(response){
      swal("Oops!", response.responseJSON||"Something went wrong", "error")

    }else{
      swal("Oops!", 'Something went wrong', "error")

    }
  }
});
