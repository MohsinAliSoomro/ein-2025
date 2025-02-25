$(document).ready(function () {


  $(document).on('change', '.status', function (e) {
    const status = $(this).val();
    const id = $(this).attr('data-id');

    $.ajax({
      type: "POST",
      url: "employer-status",
      data: { status, id },
      success: successResponseHandler,
      error: errorResponseHandler
    });
  })

  $(document).on('click', '.delete', function (e) {
    e.preventDefault();
    const employerId = $(this).attr('data-id');
    swal({
      type: 'warning',
      title: 'Are you sure?',
      text: 'Do you really want to delete ?',
      buttons: ['Cancel', 'Yes!'],
      dangerMode: true,
    }).then(function (deleteClick) {
      if (deleteClick) {
        $.ajax({
          type: "DELETE",
          url: `employer-delete?employerId=${employerId}`,
          success: successResponseHandler,
          error: errorResponseHandler
        });
      }
    })
  })




  function successResponseHandler(response) {
    toastr.options.onHidden = () => location.reload();
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
