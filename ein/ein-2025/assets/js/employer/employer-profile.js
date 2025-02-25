$(document).ready(function () {
  $('#employer-profile-form').submit(function (e) {
    e.preventDefault();
    let data = $(this).serializeArray();
    $country = $('#countryId option:selected',this)

    data = data.filter(el => el.value && !['country'].includes(el.name))
    data.push({ name: 'country', value: $country.attr('countryid') })
    $.ajax({
      type: "POST",
      url: "profile-update",
      data: data,
      success: successResponseHandler,
      error: errorResponseHandler
    });

  })
  function successResponseHandler(response) {
    swal("Success!", response.message, "success").then(() => location.reload())
  }
  function errorResponseHandler(response) {
    if (response) {
      swal("Oops!", response.responseJSON||"Something went wrong", "error")

    } else {
      swal("Oops!", 'Something went wrong', "error")

    }
  }

});
