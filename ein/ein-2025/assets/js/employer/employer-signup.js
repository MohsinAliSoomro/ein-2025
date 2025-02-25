$(document).ready(function (e) {
  $('#employer-signup-form').submit(function (e) {
    e.preventDefault();
    var reg = /^([\w-\.]+@(?!gmail.com)(?!yahoo.com)(?!hotmail.com)(?!yahoo.co.in)(?!aol.com)(?!abc.com)(?!xyz.com)(?!pqr.com)(?!rediffmail.com)(?!live.com)(?!outlook.com)(?!me.com)(?!msn.com)(?!ymail.com)([\w-]+\.)+[\w-]{2,4})?$/;
    const email = $("#recruiterEmail").val()
    if (!reg.test(email)) {
      swal("Oops!", 'Please enter a buisness email!', "error")
      return
    }
    const password = $('#password').val();
    const confirmPassword = $('#confirm-password').val();
    if (password !== confirmPassword) {
      console.log("condition")
      swal("Oops!",'Password and confirm password do not match!', "error")
      return
    }
    const data = $(this).serialize()

    $.ajax({
      type: "POST",
      url: "signup",
      data: data,
      success: successResponseHandler,
      error: errorResponseHandler
    });

  })

  $('#password').keyup(function(){
    passwordChanged();
  });

  function successResponseHandler(response) {
    toastr.options.onHidden = () => location.href = 'login';
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

  function passwordChanged() {
    var strength = document.getElementById('strength');
    var strongRegex = new RegExp("^(?=.{8,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*\\W).*$", "g");
    var mediumRegex = new RegExp("^(?=.{8,})(((?=.*[a-zA-Z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
    var enoughRegex = new RegExp("(?=.{8,}).*", "g");
    var pwd = document.getElementById("password");
    if (pwd.value.length == 0) {
        strength.innerHTML = 'Type Password';
    } else if (false == enoughRegex.test(pwd.value)) {
        strength.innerHTML = 'More Characters';
    } else if (strongRegex.test(pwd.value)) {
        strength.innerHTML = '<span style="color:green">Strong!</span>';
    } else if (mediumRegex.test(pwd.value)) {
        strength.innerHTML = '<span style="color:orange">Medium!</span>';
    } else {
        strength.innerHTML = '<span style="color:red">Weak!</span>';
    }
  }
});
