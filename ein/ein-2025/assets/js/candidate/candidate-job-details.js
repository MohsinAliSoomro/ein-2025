$(document).ready(function () {

  $(document).on('click', '.job-apply', function (e) {
    const jobId = $(this).attr('data-id');
    
    const answers = [];
    $('.job-question').each(function() {
      if($(this).find('.answer').val().trim() != '') {
        answers.push({
          questionId: $(this).find('.question').val(),
          answer: $(this).find('.answer').val().trim()
        })
      }
    })
    if($('.question').length > answers.length){
      swal("Oops!", 'All answers are required', "error")
      return false;
    }
    $.ajax({
      type: "POST",
      url: "job-apply",
      data: { jobId, answers: JSON.stringify(answers) },
      success: successResponseHandler,
      error: errorResponseHandler
    });
  })
  $(document).on('click', '.job-withdraw', function (e) {
    const jobId = $(this).attr('data-id');
    swal({
      type: 'warning',
      title: 'Are you sure?',
      text: 'Do you really want to withdraw ?',
      buttons: ['Cancel', 'Yes!'],
      dangerMode: true,
    }).then(function (deleteClick) {
      if (deleteClick) {
        $.ajax({
          type: "POST",
          url: "job-withdraw",
          data: { jobId },
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
