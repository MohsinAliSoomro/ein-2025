$(document).ready(function (e) {

  $(function () {
      
    $(document).on("keydown",".percentage",function () {
      // Save old value.
      if (!$(this).val() || (parseInt($(this).val()) <= 100 && parseInt($(this).val()) >= 0))
      $(this).data("old", $(this).val());
    });
    $(document).on("keyup change",".percentage",function () {
      // Check correct, else revert back to old value.
      if (!$(this).val() || (parseInt($(this).val()) <= 100 && parseInt($(this).val()) >= 0))
        ;
      else
        $(this).val($(this).data("old"));
    });

   
    $(".number-field").keydown(function(event) {
      // Allow only backspace and delete
      if ( event.keyCode == 46 || event.keyCode == 8  || event.keyCode == 9 ) {
          // let it happen, don't do anything
      }
      else {
          // Ensure that it is a number and stop the keypress
          if (event.keyCode < 48 || event.keyCode > 57 ) {
              event.preventDefault(); 
          }   
      }
  });
  });

  $(`[name="relocate"]`).change(function (e) {
   
    if(e.target.value ==="Other"){
      $(".other").show()
    }else{
      $(".other").hide()
    }
    })
    
  // add skill
  $(document).on('click', ".add-skill", function (e) {
    $('.skills:last').after(`
    <div class=" skills">

                <div class="col-md-12 col-sm-12">
                  <input type="text" class="form-control name"
                    placeholder="Skills, e.g. Css, Html...">
                </div>

                <div class="col-md-12 col-sm-12">
                  <div class="input-group">
                    <span class="input-group-addon">%</span>
                    <input type="number" class="form-control percentage"
                      placeholder="85">
                  </div>
                </div>
                <div class="skills-feedback text-danger"></div>
                <button type="button" class="btn remove-skill">Remove</button>
              </div>
    `)
    $('.skills:last').hide()
    $('.skills:last').fadeIn('slow')
  })

  $(document).on('click', ".remove-skill", function (e) {
    const $skills = $(this).closest('.skills')

    $skills.fadeOut('slow', () => $skills.remove())
  })

  $("#choose-cover").click(function (e) {
    $("#cover-image").click();
  })
  $("#choose-resume").click(function (e) {
    $("#uploaded-resume").click();
  })



  // resume data submit
  $('#submit-resume').click(function (e) {
    e.preventDefault();
    const data = new FormData()
    const dataArray = $('body :input').serializeArray().filter(el=>el.value)

    function requiredField(fieldName){
      if(!dataArray.map(el=>el.name).includes(fieldName)){
        $(`#${fieldName}-feedback`).html("Required Field")
        $('html, body').animate({
          scrollTop: $(`#${fieldName}-feedback`).offset().top - 250
        }, 500);
        return false
      }else{
        $(`#${fieldName}-feedback`).html("")
        return true
      }
    }
    if(!requiredField("aboutNotes")) return
    if(!requiredField("state")) return
    if(!requiredField("city"))return
    if(!requiredField("relocate"))return


    // if($(`[name="relocate"]:checked`).val()==="Other"){
    //   if(!requiredField("relocateOne"))return
    //   if(!requiredField("relocateTwo"))return
    //   if(!requiredField("relocateThree"))return

    // }
    
    for (const field of dataArray) {
      if ([""].includes(field.name) && field.value === "") {
        $(`#${field.name}-feedback`).html("Required Field")
        $('html, body').animate({
          scrollTop: $(`#${field.name}-feedback`).offset().top - 150
        }, 500);
        return
      } else {
        $(`#${field.name}-feedback`).html("")
      }
      if (field.name.includes('[]')) { continue }
      data.append(field.name, field.value)
    }
    // const resumeUploaded = $("#uploaded-resume").attr("data-uploaded")
    // if ($("#uploaded-resume").val() === "" && !resumeUploaded) {
    //   $('html, body').animate({
    //     scrollTop: $(`#uploaded-resume-feedback`).offset().top - 350
    //   }, 500);

    //   $(`#uploaded-resume-feedback`).html("Please upload your resume.")
    //   return

    // }else{
    //   $(`#uploaded-resume-feedback`).html("")

    // }
    // data.append('uploadedResume', $("#uploaded-resume")[0].files[0])

    // education
    const educationRows = $(".education").length
    const educationData = []
    for (let i = 0; i < educationRows; i++) {
      educationData.push({
        collegeName: $(`.education:eq(${i}) .collegeName`).val(),
        qualification: $(`.education:eq(${i}) .qualification`).val(),
        fromDate: $(`.education:eq(${i}) .fromDate`).val(),
        toDate: $(`.education:eq(${i}) .toDate`).val(),
        notes: $(`.education:eq(${i}) .notes`).val(),
      })
    }
    data.append('educationData', JSON.stringify(educationData))

    // experience
    const experienceRows = $(".experience").length
    const experienceData = []
    for (let i = 0; i < experienceRows; i++) {
      experienceData.push({
        employer: $(`.experience:eq(${i}) .employer`).val(),
        position: $(`.experience:eq(${i}) .position`).val(),
        fromDate: $(`.experience:eq(${i}) .fromDate`).val(),
        toDate: $(`.experience:eq(${i}) .toDate`).val(),
        notes: $(`.experience:eq(${i}) .notes`).val(),
      })
    }
    data.append('experienceData', JSON.stringify(experienceData))

    // skills
    const skillsRows = $(".skills").length
    const skillsData = []
    for (let i = 0; i < skillsRows; i++) {
      skillsData.push({
        name: $(`.skills:eq(${i}) .name`).val(),
        percentage: $(`.skills:eq(${i}) .percentage`).val() != '' ? $(`.skills:eq(${i}) .percentage`).val() : 0,
      })
    }
    data.append('skillsData', JSON.stringify(skillsData))

    // location
    const locationRows = $(".location").length
    const locationData = []
    for (let i = 0; i < locationRows; i++) {
      locationData.push({
        city: $(`.location:eq(${i}) .city`).val(),
        state: $(`.location:eq(${i}) .state`).val(),
        zip: $(`.location:eq(${i}) .zip`).val(),
      })
    }
    data.append('locationData', JSON.stringify(locationData))


    $.ajax({
      type: "POST",
      url: "my-resume",
      data: data,
      processData: false,
      contentType: false,
      success: successResponseHandler,
      error: errorResponseHandler
    });

  })

  // add location
  $(document).on('click', ".add-location", function (e) {
    if($('.location').length >= 5) return false;
    $('.location:last').after(`
      <div class="location">
        <div class="col-md-12 col-sm-12">
          <label>Location <em class="sno"></em>*</label>
        </div>
        <div class="col-md-4 col-sm-4">
          <input type="text" class="form-control city" placeholder="City" required>
        </div>
        <div class="col-md-4 col-sm-4">
          <input type="text" class="form-control state" placeholder="State" required>
        </div>
        <div class="col-md-4 col-sm-4">
          <input type="text" class="form-control zip" placeholder="zip" required>
        </div>
        <button type="button" class="btn remove-location">Remove</button>
      </div>
    `)
    $('.location:last').hide()
    $('.location:last').fadeIn('slow', () => sno('.location .sno'))
  })

  $(document).on('click', ".remove-location", function (e) {
    if($('.location').length > 1){
      const $location = $(this).closest('.location')
      $location.fadeOut('slow', () => {$location.remove();sno('.location .sno');})
    }
  })

  $(document).on('change', 'input[name="relocate"]', (e) => {
    if($('input[name="relocate"]:checked').val() == 'Other'){
      $('.other-location').removeClass('hide');
    } else {
      $('.other-location').addClass('hide');
    }
  });

  let form1 = $( "#candidate-resume-form");
  let form2 = $( "#candidate-info-form");
  let form3 = $( "#candidate-job-form");
  let form4 = $( "#candidate-experience-form");
  let form5 = $( "#candidate-skill-form");
  let form6 = $( "#candidate-education-form");
  form1.validate();
  form2.validate();
  form3.validate();
  form4.validate();
  form5.validate();
  form6.validate();
  $('.navbar-nav.navbar-left a').click(function(e) {
    let _validate = true;
    console.log('required status = ', form1.valid())
    if(!form1.valid()){
      _validate = false;
    }
    if(!form2.valid()){
      _validate = false;
    }
    if(!form3.valid()){
      _validate = false;
    }
    if(!form4.valid()){
      _validate = false;
    }
    if(!form5.valid()){
      _validate = false;
    }
    if(!form6.valid()){
      _validate = false;
    }
    if(!_validate){
      e.preventDefault();
      console.log('Need to submit required filed');
    }
  });

  function sno(ele){
    let obj = $(ele);
    let i = 1;
    obj.each(function(){
      $(this).html(i);
      i++;
    })
  }
  function successResponseHandler(response) {
    swal("Success!", response.message, "success").then(() => location.href = 'profile-preview');
  }
  function errorResponseHandler(response) {
    if (response) {
      swal("Oops!", response.responseJSON || "Something went wrong", "error")

    } else {
      swal("Oops!", 'Something went wrong', "error")

    }
  }

  // upload
  $('#upload_img').on('click', function(){
    $('#image-error').html('');
    $('#uploaded-resume').trigger('click');
  })
  $('#uploaded-resume').on('change',function(){
      
      var file_data = $('#uploaded-resume').prop('files')[0];
      var form_data = new FormData();
      form_data.append('uploadedResume', file_data);
      $.ajax({
          url: '/candidate/upload-resume', // point to server-side controller method
          dataType: 'text', // what to expect back from the server
          cache: false,
          contentType: false,
          processData: false,
          data: form_data,
          type: 'post',
          success: function (response) {
              response = JSON.parse(response);
              if(response.status == 'SUCCESS'){
                if(response.data.email && $('input[name="email"]').val().trim() == ''){
                  $('input[name="email"]').val(response.data.email)
                }

                if(response.data.phone && $('input[name="phone"]').val().trim() == ''){
                  let phone = response.data.phone.split("").reverse().join("");
                  phone = phone.substr(0,10).split("").reverse().join("");
                  $('input[name="phone"]').val(phone)
                }
                
                if(response.data.skills){
                  let oldSkills = $('.skills').find('input.name').map(function() {return this.value;}).get()
                  console.log(oldSkills)
                  response.data.skills.forEach((skill, i)=>{
                      if(oldSkills.indexOf(skill.toLowerCase()) === -1){
                        $('.skills:last').after(`
                            <div class=" skills">
                                <div class="col-md-12 col-sm-12">
                                  <input type="text" class="form-control name"
                                    placeholder="Skills, e.g. Css, Html..." value="${skill}">
                                </div>
                                <div class="col-md-12 col-sm-12">
                                  <div class="input-group">
                                    <span class="input-group-addon">%</span>
                                    <input type="number" class="form-control percentage"
                                      placeholder="85">
                                  </div>
                                </div>
                                <button type="button" class="btn remove-skill">Remove</button>
                              </div>
                            `)
                        $('.skills:last').hide()
                        $('.skills:last').fadeIn('slow')
                      }
                  });
                }
              }
          },
          error: function (response) {
              $('#msg').html(response); // display error response from the server
          }
      });
  });

});
