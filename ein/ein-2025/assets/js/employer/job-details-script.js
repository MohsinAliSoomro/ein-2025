$(document).ready(function () {
  var urlParams = new URLSearchParams(window.location.search);
  $(document).on('click', '.shortlist', function (e) {
    const candidateId = $(this).attr('data-id');
    const jobId = urlParams.get('id');
    $.ajax({
      type: "PATCH",
      url: "job-status",
      data: { jobId, candidateId, status: 'shortlisted' },
      success: successResponseHandler,
      error: errorResponseHandler
    });
  })

  $(document).on('click', '.delete', function (e) {
    const candidateId = $(this).attr('data-id');
    const jobId = urlParams.get('id');
    swal({
      type: 'warning',
      title: 'Are you sure?',
      text: 'Do you really want to delete this application ?',
      buttons: ['Cancel', 'Yes!'],
      dangerMode: true,
    }).then(function (deleteClick) {
      if (deleteClick) {
        $.ajax({
          type: "PATCH",
          url: "job-status",
          data: { jobId, candidateId, status: 'notInterested' },
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
