$(document).ready(function (e) {
  $('.custom-file-input').change(function (e) {
    let file = e.target.files[0]
    let fileName
    if(file){
      fileName = file.name
    }else{
      fileName = 'Select Job Image'

    }
    $('.custom-file-label').text(fileName);

  })

  $('#jb-category').change(function(e){
    if($(this).val() == 'others'){
      $(this).addClass('hide');
      $(this).next('.select2').addClass('hide');
      
      $('.other-category').removeClass('hide');
      $('.other-category').find('input').focus()
    }
  });

  $('#close-other-category').click(function(e){
      $('.other-category').find('input').val('');
      $('.other-category').addClass('hide');
      $('#jb-category').val('');
      $('#jb-category').removeClass('hide');
      $('#jb-category').next('.select2').removeClass('hide');
  });


  // job data submit
  // $('#post-job').submit(function (e) {
  //   console.log('post-job ======= ')
  //   e.preventDefault();
  //   const data = $("body :input").serializeArray();
  //   const formData = new FormData();
  //   for (const input of data) {
  //     formData.append(input.name, input.value);
  //   }

  //   const skillsRows = $(".skills").length
  //   const skillsData = []
  //   for (let i = 0; i < skillsRows; i++) {
  //     skillsData.push({
  //       name: $(`.skills:eq(${i}) .name`).val(),
  //       experienceYear: $(`.skills:eq(${i}) .experienceYear`).val(),
  //     })
  //   }
  //   data.append('skillsData', JSON.stringify(skillsData))
    
  //   // const image = $('.custom-file-input')[0].files[0]||''
  //   // formData.append('image',image)
  //   $.ajax({
  //     type: "POST",
  //     url: "post-new-job",
  //     data: formData,
  //     processData: false,
  //     contentType: false,
  //     success: successResponseHandler,
  //     error: errorResponseHandler
  //   });

  // })

  $('#post-job').submit(function(e){
    console.log('post-job ======= ')
    e.preventDefault();
    let myForm = document.getElementById('post-job');
    const formData = new FormData(myForm);
    // const data = $("body :input").serializeArray();
    // for (const input of data) {
    //   formData.append(input.name, input.value);
    // }
    const skillsRows = $(".skills").length
    const skillsData = []
    for (let i = 0; i < skillsRows; i++) {
      skillsData.push({
        name: $(`.skills:eq(${i}) .name`).val(),
        experienceYear: $(`.skills:eq(${i}) .experienceYear`).val(),
      })
    }
    formData.append('skillsData', JSON.stringify(skillsData))

    const question = []
    // default-question-checkbox
    $('.default-question-checkbox:checked').each(function(){
      let questionId = $(this).val();
      console.log('-----------', questionId)
      question.push({
        questionId: questionId,
        question: $(`#question-${questionId}`).val()
      })
    })

    $('.question').each(function(){
      let val = $(this).val().trim();
      console.log('-=-=-=-=-', val)
      if(val != '')
        question.push({
          question: val
        });
    })
    formData.append('questions', JSON.stringify(question))
    console.log('==formData==',formData)
    // return false;
    // const image = $('.custom-file-input')[0].files[0]||''
    // formData.append('image',image)
    $.ajax({
      type: "POST",
      url: "post-new-job",
      data: formData,
      processData: false,
      contentType: false,
      success: successResponseHandler,
      error: errorResponseHandler
    });
  });

  $('input[name="workPlace"]').on('change', function(){
    if($(this).val() == 1){
      $('input[name="remoteWork"]')[0].checked = false;
      $('input[name="remoteWork"]')[1].checked = false;
      $('input[name="remoteWork"]').removeAttr('disabled');
      $('#remote-work-panel').removeClass('hide');
    } else {
      $('input[name="remoteWork"]').attr('disabled', 'disabled');
      $('#remote-work-panel').addClass('hide');
    }
  });

  // add more functionality start

	let maxField = 5; //Input fields increment limitation
  let addButton = $('.add_button'); //Add button selector
  let wrapper = $('.field_wrapper'); //Input field wrapper
  let x = 1; //Initial field counter is 1
  
  //Once add button is clicked<input type="text" name="field_name[]" value=""/><input type="text" name="field_name[]" value=""/>
  $(addButton).click('.add_button',function(){
    x = $(wrapper).find('.no-of-rows').length;
    //Check maximum number of input fields
    if(x < maxField){ 
      let selectSkills= $('#select-skill').html();
      let fieldHTML = '<div class="row skills no-of-rows"><div class="col-sm-5"><div class="form-group"><select class="multiple-skill form-control name" required>'+selectSkills+'</select></div></div><div class="col-sm-5"><input type="number" class="form-control experienceYear" placeholder="Experince in Years" /></div><div class="col-sm-2"><span class="remove-btn"><a href="javascript:void(0);" class="remove_button"><i class="fa fa-minus"></i></a></span></div></div>'; //New input field html 
      $(wrapper).append(fieldHTML); //Add field html
      $(".multiple-skill").select2({
        placeholder: "Choose Skills",
        tags:true
      });
        x++; //Increment field counter
    } 
    if(x > 4) {
      $(this).addClass('hide');
    }
  });

  //Once remove button is clicked
  $(wrapper).on('click', '.remove_button', function(e){
		e.preventDefault();
			let obj = $(this);
      obj.closest('.no-of-rows').remove(); //Remove field html
      x--; //Decrement field counter
      if(x < 5){
        $('.add_button').removeClass('hide');
      }
    });
  // add more functionality end

  // add more Question start

  let q_wrapper = $('.q_wrapper'); //Input field wrapper
  
  $('.q-add-button').click('.q-add-button',function(){
    //Check maximum number of input fields
      let fieldHTML = '<div class="row questions-row"><div class="col-sm-10"><div class="form-group"><input type="text" class="form-control question" value=""></div></div><div class="col-sm-2"><span class="q-remove-btn"><a href="javascript:void(0);" class="q-remove-button"><i class="fa fa-minus"></i></a></span></div></div>'; //New input field html 
      $(q_wrapper).append(fieldHTML); //Add field html
    
  });

  //Once remove button is clicked
  $(q_wrapper).on('click', '.q-remove-button', function(e){
		e.preventDefault();
			let obj = $(this);
      obj.closest('.questions-row').remove(); //Remove field html
     
    });
  // add more functionality end


  function successResponseHandler(response) {
    swal("Success!", response.message, "success").then(() => location.href = 'created-jobs');
  }
  function errorResponseHandler(response) {
    if (response) {
      swal("Oops!", response.responseJSON||"Something went wrong", "error")

    } else {
      swal("Oops!", 'Something went wrong', "error")

    }
  }
});
