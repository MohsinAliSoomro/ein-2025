$(document).ready(function () {
  $("#skills").select2({
    placeholder: 'Search skills',
    tags: 'true',
  })

  $("#find-jobs-btn").click(function () {
    const keyword = $('#keyword').val()
    let skills = $('#skills').val()||''
    if(skills){
      skills = JSON.stringify(skills)
    }

    const state = $('#stateId').val()
    const city = $('#cityId').val()
    const category = $('#category').val()

    const url = `browse-jobs-list?query=${encodeURIComponent(keyword)}&state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}&category=${encodeURIComponent(category)}&skills=${encodeURIComponent(skills)}`
    location.href = url
  })


  $(document).on('click', '.job-apply', function (e) {
    const jobId = $(this).attr('data-id');
    $.ajax({
      type: "POST",
      url: "job-apply",
      data: { jobId },
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

  $('#show-hide-sidebar-btn').on('click', function(){
    if($('.show-hide-sidebar').hasClass('hidden-sm')){
      $('.show-hide-sidebar').removeClass('hidden-sm');
    } else {
      $('.show-hide-sidebar').addClass('hidden-sm');
    }

    if($('.show-hide-sidebar').hasClass('hidden-xs')){
      $('.show-hide-sidebar').removeClass('hidden-xs');
    } else {
      $('.show-hide-sidebar').addClass('hidden-xs');
    }
  });

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
