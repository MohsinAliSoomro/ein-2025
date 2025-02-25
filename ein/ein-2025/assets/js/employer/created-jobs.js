$(document).ready(function (e) {


  $('#jb-filter').bind('change', function () {

    const selectedFilter = $(this).val();

    $(".job-row").each(function (index, element) {

      const jobStatus = $(element).attr('data-status')
      if (selectedFilter === jobStatus || !selectedFilter) {
        $(element).show();
      } else {
        $(element).hide();
      }

    });

  });
  $('#jb-filter').trigger('change')


  $('#jb-name-filter').bind('change', function () {
    const selectedFilter = $(this).val();
    $(".job-row").each(function (index, element) {

      const jobName = $(element).find('.job-name').text();
      
      if (jobName.indexOf(selectedFilter) !== -1) {
        $(element).show();
      } else {
        $(element).hide();
      }

    });

  });

  $('#jb-name-filter').trigger('keyup');



  $(document).on('click', '.delete', function (e) {
    e.preventDefault();
    const jobId = $(this).attr('data-id');


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
          url: `/employer/job-delete?jobId=${jobId}`,
          success: successResponseHandler,
          error: errorResponseHandler
        });
      }
    })
  })
  $(document).on('change', '.job-status', function (e) {
    e.preventDefault();
    const status = $(this).val();
    const id = $(this).attr('data-id');



    swal({
      type: 'warning',
      title: 'Are you sure?',
      text: 'Do you really want to change the status of this job ?',
      buttons: ['Cancel', 'Yes!'],
      dangerMode: true,
    }).then(function (deleteClick) {
      if (deleteClick) {
        $.ajax({
          type: "PUT",
          url: `/employer/job-update`,
          data: { id, status },
          success: successResponseHandler,
          error: errorResponseHandler
        });
      }
    })
  })

  $(document).on('click', '.edit-job', function (e) {
    e.preventDefault();
    const jobId = $(this).attr('data-id');
    $.ajax({
      type: "POST",
      url: "job-details",
      data: { jobId },
      success: function (response) {
        const job = response.data;
        for (const field in job) {
          if (field === 'languages') {
            const languages = job[field].split(',');
            for (const language of languages) {
              if ($('.language').find(`option:contains(${language})`).length) {

              } else {
                const newOption = new Option(language, language, true, true);
                $('.language').append(newOption).trigger('change');
              }
            }
            $('.language').val(languages)
            $('.language').trigger('change');
            continue;
          }
          if (field === 'skills') {
            const skills = job[field];
            $('.multiple-skill').val(skills.map(el => el.name))
            $('.multiple-skill').trigger('change');
            continue;
          }

          if (job.hasOwnProperty(field)) {
            const value = job[field];
            $(`.edit-job-form [name="${field}"]`).val(value);
            $(`.edit-job-form [name="${field}"]`).trigger('change');

          }
        }
      },
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
    if (response) {
      swal("Oops!", response.responseJSON || "Something went wrong", "error")

    } else {
      swal("Oops!", 'Something went wrong', "error")

    }
  }
});
