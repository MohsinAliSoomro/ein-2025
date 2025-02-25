$(document).ready(function (e) {
  $('#settings-form').submit(function (e) {
    e.preventDefault();
    const data = $(this).serialize()
    $.ajax({
      type: "POST",
      url: "settings",
      data: data,
      success: successResponseHandler,
      error: errorResponseHandler
    });

  })

  function successResponseHandler(response) {
    toastr.options.onHidden = () => location.reload();
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
