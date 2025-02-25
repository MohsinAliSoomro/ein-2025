$(document).ready(function () {
  $('#candidate-profile-form').submit(function (e) {
    e.preventDefault();
    let data = $(this).serializeArray();
    data = data.filter(el => el.value)
    $.ajax({
      type: "POST",
      url: "profile-update",
      data: data,
      success: successResponseHandler,
      error: errorResponseHandler
    });

  })
  function successResponseHandler(response) {
    swal("Success!", response.message, "success").then(()=>location.reload())
  }
  function errorResponseHandler(response) {
    if (response) {
      swal("Oops!", response.responseJSON||"Something went wrong", "error")

    } else {
      swal("Oops!", 'Something went wrong', "error")

    }
  }

});
