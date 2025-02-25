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
    const zip = $('#zip').val()

    const url = `browse-candidates?query=${encodeURIComponent(keyword)}&state=${encodeURIComponent(state)}&city=${encodeURIComponent(city)}&zip=${encodeURIComponent(zip)}&skills=${encodeURIComponent(skills)}`
    location.href = url
  })

  $("#add-candidate").submit(function(e) {
    e.preventDefault()
    const data= $(this).serialize()
    $.ajax({
      type: "POST",
      url: "job-apply",
      data,
      success: successResponseHandler,
      error: errorResponseHandler
    });
  })


  $(document).on('click', '.job-apply', function (e) {
    const jobId = $(this).attr('data-id');

  })
  $(document).on('click', '.set-candidateId', function (e) {
    const candidateId = $(this).attr('data-id');
    $('#add-candidate .candidateId').val(candidateId);
    $.ajax({
      type: "POST",
      url: "candidate-eligible-jobs",
      data: {candidateId},
      success: function (response) {
        const jobs = response.data;
        $('#add-candidate #jobs-list').empty();
        $('#add-candidate #jobs-list').append('<option value="">Select Job</option>');
        for (const job of jobs) {
        $('#add-candidate #jobs-list').append(`<option value=${job.id}>${job.title}</option>`);

        }
        $('#add-to-job').modal('show');
      },
      error:errorResponseHandler
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
