$(document).ready(function (e) {
    
    $('#subjectId').change( function(){
        console.log('===========',$(this).val())

        if($(this).val() == 'Can’t find resources for job, need EIN Support for Sourcing'){
            $('#other-option').removeClass('hide');
            $('#other-option').find('input').attr('required', 'required');
        } else if($(this).val() == 'Others') {
            $('#other-option').removeClass('hide');
            $('#other-option').find('input').attr('required', 'required');
        } else {
            $('#other-option').addClass('hide');
            $('#other-option').find('input').removeAttr('required');
        }
    });

    $('#support-form').submit(function (e) {
      e.preventDefault();
      const data = $(this).serialize()
  
      $.ajax({
        type: "POST",
        url: "/employer/support-us",
        data: data,
        success: successResponseHandler,
        error: errorResponseHandler
      });
  
    })
  
    function successResponseHandler(response) {
      toastr.options.onHidden = () => location.href = '/employer/dashboard';
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
  