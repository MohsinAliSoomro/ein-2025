$(document).ready(function (e) {
  $('#forgot-password-form').submit(function (e) {
    e.preventDefault();
    const data = $(this).serialize()

    $.ajax({
      type: "POST",
      url: "/forgot-password",
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
