
$('.apply-job-btn').on('click', function(e){

    e.preventDefault();
    const data = {

    }

    $.ajax({
      type: "POST",
      url: "/candidate/job-apply",
      data: {jobId : $(this).attr('data-id')},
      success: successResponseHandler,
      error: errorResponseHandler
    });

  })

  function successResponseHandler(response) {
    toastr.options.onHidden = () => location.href = '/candidate/job-details';
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